import * as fs from "fs";
import * as path from "path";
import { Schema } from "../types";
import { logger } from "./logger.js";

export class SchemaManager {
  private schemaPath: string;

  constructor(customPath?: string) {
    if (customPath) {
      this.schemaPath = customPath;
    } else {
      const mockServerDir = path.join(process.cwd(), ".mockserver");
      // Ensure .mockserver directory exists
      if (!fs.existsSync(mockServerDir)) {
        fs.mkdirSync(mockServerDir, { recursive: true });
      }
      this.schemaPath = path.join(mockServerDir, "schema.json");
    }
  }

  load(): Schema | null {
    try {
      if (!fs.existsSync(this.schemaPath)) {
        logger.error(`Schema file not found: ${this.schemaPath}`);
        logger.info("Run 'mockserver init' to create a new schema");
        return null;
      }

      const content = fs.readFileSync(this.schemaPath, "utf-8");
      const schema = JSON.parse(content);

      // Apply defaults
      return this.applyDefaults(schema);
    } catch (error: any) {
      logger.error(`Failed to load schema: ${error.message}`);
      return null;
    }
  }

  save(schema: Schema): boolean {
    try {
      fs.writeFileSync(this.schemaPath, JSON.stringify(schema, null, 2));
      logger.success(`Schema saved to ${this.schemaPath}`);
      return true;
    } catch (error: any) {
      logger.error(`Failed to save schema: ${error.message}`);
      return false;
    }
  }

  validate(schema: Schema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!schema.port) errors.push("Missing 'port' field");
    if (!schema.resources) errors.push("Missing 'resources' field");
    if (!Array.isArray(schema.resources))
      errors.push("'resources' must be an array");

    // Port validation
    if (schema.port < 1 || schema.port > 65535) {
      errors.push("Port must be between 1 and 65535");
    }

    // Resource validation
    schema.resources?.forEach((resource, index) => {
      if (!resource.id) errors.push(`Resource ${index}: Missing 'id'`);
      if (!resource.name) errors.push(`Resource ${index}: Missing 'name'`);
      if (!resource.endpoint)
        errors.push(`Resource ${index}: Missing 'endpoint'`);
      if (!resource.fields) errors.push(`Resource ${index}: Missing 'fields'`);
      if (resource.count && resource.count < 0) {
        errors.push(`Resource ${index}: 'count' must be positive`);
      }

      // Endpoint validation
      if (resource.endpoint && !resource.endpoint.startsWith("/")) {
        errors.push(`Resource ${index}: Endpoint must start with '/'`);
      }

      // Error config validation
      if (resource.errorConfig) {
        if (resource.errorConfig.rate < 0 || resource.errorConfig.rate > 1) {
          errors.push(`Resource ${index}: Error rate must be between 0 and 1`);
        }
      }
    });

    // Chaos config validation
    if (schema.chaos) {
      if (
        schema.chaos.globalErrorRate < 0 ||
        schema.chaos.globalErrorRate > 1
      ) {
        errors.push("Global error rate must be between 0 and 1");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  exists(): boolean {
    return fs.existsSync(this.schemaPath);
  }

  private applyDefaults(schema: Partial<Schema>): Schema {
    return {
      port: schema.port || 9500,
      host: schema.host || "localhost",
      delay: schema.delay || { enabled: false, min: 100, max: 1000 },
      chaos: schema.chaos || { enabled: false, globalErrorRate: 0.05 },
      auth: schema.auth || { enabled: false, type: "bearer", tokens: [] },
      cors: schema.cors || { enabled: true, origins: ["*"] },
      logging: schema.logging || {
        level: "info",
        format: "pretty",
        requests: true,
      },
      resources: schema.resources || [],
    };
  }
}
