import ora from "ora";
import fs from "fs";
import path from "path";
import { SchemaManager } from "../utils/schema";
import { dataGenerator } from "../core/generator";
import { logger } from "../utils/logger";
import { CommandOptions } from "../types";

export function generateCommand(options: CommandOptions) {
  const spinner = ora("Loading schema...").start();
  const schemaManager = new SchemaManager();
  const schema = schemaManager.load();

  if (!schema) {
    spinner.fail("Failed to load schema");
    process.exit(1);
  }

  const outputDir = options.output || "./mock-data";

  spinner.text = "Creating output directory...";

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  spinner.text = "Generating data files...";

  let generatedCount = 0;

  try {
    schema.resources.forEach((resource) => {
      const data = dataGenerator.generateData(resource.fields, resource.count);

      // Create filename from endpoint
      const filename = resource.id + ".json";
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      generatedCount++;
    });

    spinner.succeed(`Generated ${generatedCount} data files`);
    logger.success(`\n✨ Files saved to: ${outputDir}`);
    logger.info("You can now use these JSON files in your project\n");
  } catch (error: any) {
    spinner.fail("Failed to generate files");
    logger.error(error.message);
    process.exit(1);
  }
}
