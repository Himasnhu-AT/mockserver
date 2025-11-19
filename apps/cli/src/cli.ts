import { Command } from "commander";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

// --- Types ---
type FieldType =
  | "uuid"
  | "email"
  | "firstName"
  | "sentence"
  | "paragraph"
  | "avatar"
  | "integer"
  | string;

interface Resource {
  id: string;
  name: string;
  endpoint: string;
  count: number;
  fields: Record<string, FieldType>;
  errorConfig?: {
    rate: number; // 0.0 to 1.0
    code: number;
    message: string;
  };
}

interface Schema {
  port: number;
  chaos: {
    globalErrorRate: number;
    enabled: boolean;
  };
  resources: Resource[];
}

// --- Data Generator Factory ---
// This is the shared brain for both Mock Server and Database Seeder
const generateData = (fields: Record<string, FieldType>, count: number) => {
  return Array.from({ length: count }).map(() => {
    const row: any = {};

    for (const [key, type] of Object.entries(fields)) {
      if (type === "uuid") row[key] = faker.string.uuid();
      else if (type === "email") row[key] = faker.internet.email();
      else if (type === "firstName") row[key] = faker.person.firstName();
      else if (type === "sentence") row[key] = faker.lorem.sentence();
      else if (type === "paragraph") row[key] = faker.lorem.paragraph();
      else if (type === "avatar") row[key] = faker.image.avatar();
      else if (type === "integer")
        row[key] = faker.number.int({ min: 0, max: 1000 });
      else if (type.startsWith("enum:")) {
        const options = type.replace("enum:", "").split(",");
        row[key] = faker.helpers.arrayElement(options);
      } else {
        row[key] = `Unknown Type: ${type}`;
      }
    }
    return row;
  });
};

// --- CLI Setup ---
const program = new Command();
const SCHEMA_PATH = path.join(process.cwd(), "schema.json");

const loadSchema = (): Schema => {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error("schema.json not found. Please create one.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
};

const saveSchema = (schema: Schema) => {
  fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2));
};

program
  .name("mock-chaos")
  .description("Dynamic Mock Server with Chaos Engineering capabilities");

program
  .command("start")
  .description("Start the mock server and web UI")
  .action(() => {
    let schema = loadSchema();
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    // 1. System API (For the Web UI to control the CLI)
    app.get("/_system/schema", (_req, res) => {
      res.json(loadSchema());
    });

    app.post("/_system/schema", (req, res) => {
      try {
        schema = req.body; // Update in-memory
        saveSchema(schema); // Persist to disk
        console.log("🔄 Schema updated via Web UI");
        res.json({ success: true, message: "Schema updated" });
      } catch (e) {
        res.status(500).json({ error: "Failed to save schema" });
      }
    });

    // 2. Dynamic Middleware for Chaos & Routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Skip system routes
      if (req.path.startsWith("/_system")) return next();

      // Find matching resource in schema
      const resource = schema.resources.find((r) => r.endpoint === req.path);

      if (resource) {
        // A. CHAOS CHECK
        const shouldError =
          schema.chaos.enabled &&
          Math.random() <
            (resource.errorConfig?.rate || schema.chaos.globalErrorRate);

        if (shouldError) {
          const code = resource.errorConfig?.code || 500;
          const msg = resource.errorConfig?.message || "Chaos Monkey struck!";
          console.log(`🔥 Injecting Chaos Error (${code}) on ${req.path}`);
          return res.status(code).json({ error: msg });
        }

        // B. SUCCESS RESPONSE
        const data = generateData(resource.fields, resource.count);
        return res.json(data);
      }

      next();
    });

    app.listen(schema.port, () => {
      console.log(`
🚀 CLI Server Running
---------------------
📡 API Base:    http://localhost:${schema.port}
🔧 Dashboard:   http://localhost:3000?host=localhost:9500 (Not implemented in this file, serve React here)
📂 Schema:      ${SCHEMA_PATH}
      `);

      // Log active routes
      schema.resources.forEach((r) => {
        console.log(`   ➜  GET ${r.endpoint} (${r.count} items)`);
      });
    });
  });

program.parse(process.argv);
