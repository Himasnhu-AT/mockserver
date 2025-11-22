import ora from "ora";
import { SchemaManager } from "../utils/schema.js";
import { logger } from "../utils/logger.js";
import { CommandOptions } from "../types";

export function validateCommand(options: CommandOptions) {
  const spinner = ora("Loading schema...").start();
  const schemaManager = new SchemaManager(options.schema);

  try {
    const schema = schemaManager.load();

    if (!schema) {
      spinner.fail("Failed to load schema");
      process.exit(1);
    }

    spinner.text = "Validating schema...";

    const validation = schemaManager.validate(schema);

    if (validation.valid) {
      spinner.succeed("Schema is valid ✓");
      logger.info(`\nResources: ${schema.resources.length}`);
      logger.info(`Port: ${schema.port}`);
      logger.info(`Chaos: ${schema.chaos.enabled ? "Enabled" : "Disabled"}`);
    } else {
      spinner.fail("Schema validation failed");
      console.log("\n");
      validation.errors.forEach((error) => logger.error(error));
      process.exit(1);
    }
  } catch (error: any) {
    spinner.fail("Validation error");
    logger.error(error.message);
    process.exit(1);
  }
}
