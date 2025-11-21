import chalk from "chalk";
import { SchemaManager } from "../utils/schema";
import Table from "cli-table3";

export function infoCommand() {
  const schemaManager = new SchemaManager();
  const schema = schemaManager.load();

  if (!schema) {
    process.exit(1);
  }

  console.log(chalk.bold.cyan("\n📊 Schema Information\n"));

  // General info
  console.log(chalk.gray("Port:       ") + chalk.white(schema.port));
  console.log(chalk.gray("Host:       ") + chalk.white(schema.host));
  console.log(
    chalk.gray("Chaos:      ") +
      (schema.chaos.enabled
        ? chalk.red("Enabled") +
          chalk.gray(` (${(schema.chaos.globalErrorRate * 100).toFixed(1)}%)`)
        : chalk.green("Disabled")),
  );
  console.log(
    chalk.gray("Resources:  ") + chalk.white(schema.resources.length),
  );

  // Resources table
  console.log(chalk.bold("\n📡 Endpoints:\n"));

  const table = new Table({
    head: [
      chalk.cyan("Method"),
      chalk.cyan("Endpoint"),
      chalk.cyan("Items"),
      chalk.cyan("Error Rate"),
    ],
    colWidths: [10, 40, 10, 15],
  });

  schema.resources.forEach((resource) => {
    const errorRate = resource.errorConfig
      ? `${(resource.errorConfig.rate * 100).toFixed(1)}%`
      : "-";

    table.push([
      resource.method || "GET",
      resource.endpoint,
      resource.count.toString(),
      errorRate,
    ]);
  });

  console.log(table.toString());

  // Example usage
  console.log(chalk.bold("\n💡 Example Usage:\n"));
  const firstResource = schema.resources[0];
  if (firstResource) {
    console.log(
      chalk.gray("  curl ") +
        chalk.white(
          `http://${schema.host}:${schema.port}${firstResource.endpoint}`,
        ),
    );
  }
  console.log();
}
