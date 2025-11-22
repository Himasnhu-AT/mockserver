import ora from "ora";
import inquirer from "inquirer";
import { SchemaManager } from "../utils/schema.js";
import { logger } from "../utils/logger.js";
import { CommandOptions } from "../types";
import { templates } from "../utils/template.js";

export async function initCommand(options: CommandOptions) {
  const schemaManager = new SchemaManager();

  // Check if schema exists
  if (schemaManager.exists() && !options.force) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "schema.json already exists. Overwrite?",
        default: false,
      },
    ]);

    if (!overwrite) {
      logger.info("Initialization cancelled");
      return;
    }
  }

  let template = options.template;

  // Ask for template if not provided
  if (!template) {
    const { selectedTemplate } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedTemplate",
        message: "Choose a template:",
        choices: [
          { name: "📱 Social Media", value: "social" },
          { name: "🛒 E-commerce", value: "ecommerce" },
          { name: "📝 Basic", value: "basic" },
        ],
      },
    ]);
    template = selectedTemplate;
  }

  const spinner = ora("Generating schema...").start();

  try {
    // Get template
    const schema = templates.get(template!);

    if (!schema) {
      spinner.fail(`Template '${template}' not found`);
      return;
    }

    // Save schema
    schemaManager.save(schema);
    spinner.succeed("Schema created successfully");

    logger.success("\n✨ All set! Next steps:");
    logger.info("1. Edit schema.json to customize your endpoints");
    logger.info("2. Run 'mock-chaos start' to start the server");
    logger.info("3. Run 'mock-chaos info' to see available endpoints\n");
  } catch (error: any) {
    spinner.fail("Failed to create schema");
    logger.error(error.message);
  }
}
