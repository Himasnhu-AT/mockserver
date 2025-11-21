#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { startServer } from "./commands/start";
import { initCommand } from "./commands/init";
import { validateCommand } from "./commands/validate";
import { infoCommand } from "./commands/info";
import { generateCommand } from "./commands/generate";
import figlet from "figlet";

const program = new Command();

// ASCII Art Banner
console.log(
  chalk.cyan(
    figlet.textSync("MockChaos", {
      font: "Standard",
      horizontalLayout: "default",
    }),
  ),
);

console.log(chalk.gray("  Dynamic Mock Server with Chaos Engineering\n"));

program
  .name("mock-chaos")
  .description("Spin up mock servers instantly with chaos capabilities")
  .version("1.0.0");

// Commands
program
  .command("start")
  .description("Start the mock server")
  .option("-p, --port <port>", "Override port from schema")
  .option("-h, --host <host>", "Host address", "localhost")
  .option("--no-chaos", "Disable chaos engineering")
  .option("-w, --watch", "Watch schema file for changes")
  .action(startServer);

program
  .command("init")
  .description("Initialize a new schema.json")
  .option("-t, --template <name>", "Use template (social, ecommerce, basic)")
  .option("-f, --force", "Overwrite existing schema")
  .action(initCommand);

program
  .command("validate")
  .description("Validate schema.json")
  .option("-s, --schema <path>", "Path to schema file")
  .action(validateCommand);

program
  .command("info")
  .description("Show current schema information")
  .action(infoCommand);

program
  .command("generate")
  .description("Generate static JSON files from schema")
  .option("-o, --output <dir>", "Output directory", "./mock-data")
  .action(generateCommand);

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
