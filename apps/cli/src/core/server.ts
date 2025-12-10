import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "http";
import { Schema } from "../types";
import { dataGenerator } from "./generator.js";
import { ChaosEngine } from "./chaos.js";
import { logger } from "../utils/logger.js";
import { generateDocsHtml } from "../utils/docsTemplate.js";
import { storage } from "./StorageService.js";

export class MockServer {
  private app: express.Application;
  private server?: Server;
  private schema: Schema;
  private chaosEngine: ChaosEngine;

  constructor(schema: Schema) {
    this.app = express();
    this.schema = schema;
    this.chaosEngine = new ChaosEngine(schema.chaos);
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    // CORS
    if (this.schema.cors?.enabled) {
      this.app.use(
        cors({
          origin: [
            ...this.schema.cors.origins,
            "https://mockserver.himanshuat.com",
            "http://localhost:3000",
          ],
        }),
      );
    }

    // Body parser
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Request logging
    if (this.schema.logging?.requests) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        // Skip logging for system routes to avoid noise
        if (req.path.startsWith("/_mockserver") || req.path.startsWith("/_system")) {
          return next();
        }

        const start = Date.now();
        res.on("finish", () => {
          const duration = Date.now() - start;
          logger.request(req, res, duration);
        });
        next();
      });
    }

    // Delay middleware
    if (this.schema.delay?.enabled) {
      this.app.use(async (req: Request, res: Response, next: NextFunction) => {
        // Skip delay for system routes
        if (req.path.startsWith("/_mockserver") || req.path.startsWith("/_system")) {
          return next();
        }

        const delay =
          Math.random() * (this.schema.delay!.max - this.schema.delay!.min) +
          this.schema.delay!.min;
        await new Promise((resolve) => setTimeout(resolve, delay));
        next();
      });
    }
  }

  private setupRoutes() {
    // System routes
    this.app.get("/_system/health", (req, res) => {
      res.json({ status: "ok", uptime: process.uptime() });
    });

    this.app.get("/_system/schema", (req, res) => {
      res.json(this.schema);
    });

    this.app.get("/docs", (req, res) => {
      const html = generateDocsHtml(this.schema);
      res.send(html);
    });

    // --- NEW: Management API Routes ---
    const router = express.Router();

    // Get Schema
    router.get("/schema", async (req, res) => {
      const currentSchema = await storage.getSchema();
      res.json(currentSchema || this.schema);
    });

    // Update Schema
    router.put("/schema", async (req, res) => {
      try {
        const newSchema = req.body;
        // Basic validation TODO: Add more robust validation using validate.ts logic
        if (!newSchema || !newSchema.resources) {
          return res.status(400).json({ error: "Invalid schema" });
        }
        await storage.saveSchema(newSchema);
        this.updateSchema(newSchema);
        res.json({ success: true, schema: newSchema });
      } catch (error) {
        res.status(500).json({ error: "Failed to save schema" });
      }
    });

    // Get Resource Data
    router.get("/data/:resource", async (req, res) => {
      const resourceId = req.params.resource;
      const data = await storage.getData(resourceId);
      res.json(data);
    });

    // Create Resource Data
    router.post("/data/:resource", async (req, res) => {
      const resourceId = req.params.resource;
      const newItem = req.body;
      const data = await storage.getData(resourceId);
      data.push({ ...newItem, id: newItem.id || crypto.randomUUID() });
      await storage.saveData(resourceId, data);
      res.status(201).json(newItem);
    });

    // Update Resource Data
    router.put("/data/:resource/:id", async (req, res) => {
      const { resource, id } = req.params;
      const updates = req.body;
      const data = await storage.getData(resource);
      const index = data.findIndex((item: any) => item.id === id);

      if (index === -1) return res.status(404).json({ error: "Item not found" });

      data[index] = { ...data[index], ...updates };
      await storage.saveData(resource, data);
      res.json(data[index]);
    });

    // Delete Resource Data
    router.delete("/data/:resource/:id", async (req, res) => {
      const { resource, id } = req.params;
      const data = await storage.getData(resource);
      const filtered = data.filter((item: any) => item.id !== id);

      if (data.length === filtered.length) return res.status(404).json({ error: "Item not found" });

      await storage.saveData(resource, filtered);
      res.json({ success: true });
    });

    this.app.use("/_mockserver", router);
    // ----------------------------------

    // Dynamic resource routes
    this.app.use(async (req: Request, res: Response, next: NextFunction) => {
      // Skip system routes
      if (req.path.startsWith("/_system") || req.path.startsWith("/_mockserver") || req.path === "/docs") return next();

      // Find matching resource
      const resource = this.findMatchingResource(req.path, req.method);

      if (resource) {
        // Check chaos
        const chaosResult = this.chaosEngine.shouldFail(resource);
        if (chaosResult.fail) {
          logger.chaos(
            `${chaosResult.code} on ${req.method} ${req.path} - ${chaosResult.message}`,
          );
          return res
            .status(chaosResult.code)
            .json({ error: chaosResult.message });
        }

        // Get or Generate data
        // Try to get from storage first
        let data = await storage.getData(resource.id);

        // If no data in storage, generate and save it
        // Note: Using a simple check for empty array might differ from "file doesn't exist"
        // Ideally StorageService should tell us if it was a cache miss.
        // For now, assuming if empty, we re-generate IF existing count > 0 in schema. 
        // But what if user deleted all data? 
        // Let's improve StorageService or just assume if file read fails/empty AND first run, we generate.
        // For now, let's keep it simple: If data is empty array, currently it returns empty array.
        // We need a way to know if it was "not found".
        // Let's assume if it returns [], we check if we should generate.
        // Actually, let's rely on server initialization to populate data? 
        // OR: lazy load here.

        // Simple heuristic: If data is empty, regenerate. 
        // Limitation: Can't have truly empty resource. 
        // Better: Check file existence specific method. 
        // For this iteration, I'll modify StorageService to throw or return null if not found.

        // Let's assume storage.getData returns [] if not found for now as implemented.
        // Implementation update: lazy generation logic in-place.
        if (data.length === 0 && resource.count > 0) {
          // Check if file existed? StorageService swallows error.
          // Let's assume we want to hydrate if empty.
          data = dataGenerator.generateData(resource.fields, resource.count);
          await storage.saveData(resource.id, data);
        }

        // Handle pagination
        if (resource.pagination?.enabled) {
          const page = parseInt(req.query.page as string) || 1;
          const limit =
            parseInt(req.query.limit as string) || resource.pagination.pageSize;
          const start = (page - 1) * limit;
          const end = start + limit;
          const paginatedData = data.slice(start, end);

          return res.json({
            data: paginatedData,
            pagination: {
              page,
              limit,
              total: data.length,
              totalPages: Math.ceil(data.length / limit),
              hasNext: end < data.length,
              hasPrev: page > 1,
            },
          });
        }

        // Return data
        return res.json(data);
      }

      next();
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: "Endpoint not found",
        path: req.path,
        availableEndpoints: this.schema.resources.map((r) => ({
          method: r.method || "GET",
          endpoint: r.endpoint,
        })),
      });
    });
  }

  private findMatchingResource(path: string, method: string) {
    return this.schema.resources.find((r) => {
      const resourceMethod = r.method || "GET";
      if (resourceMethod !== method) return false;

      // Exact match
      if (r.endpoint === path) return true;

      // Dynamic route match (e.g., /api/users/:id)
      const pattern = r.endpoint.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    });
  }

  async start(): Promise<void> {
    // Initialize storage with current schema if needed
    await storage.init(this.schema);

    return new Promise((resolve) => {
      this.server = this.app.listen(this.schema.port, this.schema.host, () => {
        resolve();
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }

  updateSchema(schema: Schema) {
    this.schema = schema;
    this.chaosEngine = new ChaosEngine(schema.chaos);
  }
}
