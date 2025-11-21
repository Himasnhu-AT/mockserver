import ora from "ora";
import { SchemaManager } from "../utils/schema";
import { MockServer } from "../core/server";
import { logger } from "../utils/logger";
import * as fs from "fs";
import { CommandOptions } from "../types";

export async function startServer(options: CommandOptions) {
  const spinner = ora("Loading schema...").start();

  try {
    // Load schema
    const schemaManager = new SchemaManager(options.schema);
    const schema = schemaManager.load();

    if (!schema) {
      spinner.fail("Failed to load schema");
      process.exit(1);
    }

    spinner.text = "Validating schema...";

    // Validate schema
    const validation = schemaManager.validate(schema);
    if (!validation.valid) {
      spinner.fail("Schema validation failed");
      validation.errors.forEach((err) => logger.error(err));
      process.exit(1);
    }

    spinner.succeed("Schema loaded and validated");

    // Override options
    if (options.port) schema.port = options.port;
    if (options.host) schema.host = options.host;
    if (options.chaos === false) schema.chaos.enabled = false;

    // Create and start server
    const server = new MockServer(schema);

    spinner.text = "Starting server...";
    await server.start();
    spinner.succeed("Server started successfully");

    // Display info
    logger.banner(schema.port, schema.host, schema.resources.length);
    logger.routes(
      schema.resources.map((r) => ({
        endpoint: r.endpoint,
        method: r.method || "GET",
        count: r.count,
      })),
    );

    if (schema.chaos.enabled) {
      logger.warn(
        `Chaos mode enabled (${(schema.chaos.globalErrorRate * 100).toFixed(1)}% error rate)`,
      );
    }

    // Watch mode
    if (options.watch) {
      logger.info("Watching schema file for changes...\n");
      fs.watch(schemaManager["schemaPath"], (eventType) => {
        if (eventType === "change") {
          logger.info("Schema changed, reloading...");
          const newSchema = schemaManager.load();
          if (newSchema) {
            server.updateSchema(newSchema);
            logger.success("Schema reloaded");
          }
        }
      });
    }

    // Handle shutdown
    process.on("SIGINT", () => {
      console.log("\n");
      logger.info("Shutting down server...");
      server.stop();
      process.exit(0);
    });
  } catch (error: any) {
    spinner.fail("Failed to start server");
    logger.error(error.message);
    process.exit(1);
  }
}
