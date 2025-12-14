#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { startServer } from "./commands/start.js";
import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { infoCommand } from "./commands/info.js";
import { generateCommand } from "./commands/generate.js";
import figlet from "figlet";
import { logger } from "./utils/logger.js";

const program = new Command();

// ASCII Art Banner
console.log(
  chalk.cyan(
    figlet.textSync("MockServer", {
      font: "Standard",
      horizontalLayout: "default",
    }),
  ),
);

console.log(chalk.gray("  Dynamic Mock Server with Chaos Engineering\n"));

program
  .name("mockserver")
  .description("Spin up mock servers instantly with chaos capabilities")
  .version("1.0.0")
  .option("-v, --verbose", "Enable verbose logging");

// Middleware to handle global options
program.hook("preAction", (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.verbose) {
    // We imported 'logger' from './utils/logger.js', so we can assume it's the singleton
    // But we need to import it here to set it, or rely on commands doing it?
    // Better to strict import here
    logger.enableDebug();
    logger.debug("Verbose mode enabled");
  }
});

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

// --- NEW CODE START ---
// Append detailed command options to the global help
program.addHelpText("after", () => {
  let helpText = `\n${chalk.bold.cyan("COMMAND DETAILS:")}\n`;

  program.commands.forEach((cmd) => {
    helpText += `\n  ${chalk.yellow.bold(cmd.name())} ${chalk.gray(cmd.description())}\n`;

    if (cmd.options.length > 0) {
      cmd.options.forEach((option) => {
        // Pad flags so descriptions align nicely
        const flags = option.flags.padEnd(25);
        helpText += `    ${chalk.green(flags)} ${option.description}\n`;
      });
    } else {
      helpText += `    ${chalk.gray("No specific options")}\n`;
    }
  });

  return helpText;
});
// --- NEW CODE END ---

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.help(); // .help() automatically calls outputHelp() and exits
}
