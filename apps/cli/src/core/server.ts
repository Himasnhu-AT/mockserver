import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "http";
import { Schema } from "../types";
import { dataGenerator } from "./generator.js";
import { ChaosEngine } from "./chaos.js";
import { logger } from "../utils/logger.js";
import { generateDocsHtml } from "../utils/docsTemplate.js";

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

    // Dynamic resource routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // Skip system routes
      if (req.path.startsWith("/_system")) return next();

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

        // Generate data
        let data = dataGenerator.generateData(resource.fields, resource.count);

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
