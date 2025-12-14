import chalk from "chalk";
import { Request, Response } from "express";

export class Logger {
  private requestCount = 0;
  private debugMode = false;

  enableDebug() {
    this.debugMode = true;
  }

  debug(message: string) {
    if (this.debugMode) {
      console.log(chalk.gray("DEBUG:"), message);
    }
  }

  success(message: string) {
    console.log(chalk.green("✓"), message);
  }

  error(message: string) {
    console.log(chalk.red("✗"), message);
  }

  warn(message: string) {
    console.log(chalk.yellow("⚠"), message);
  }

  info(message: string) {
    console.log(chalk.blue("ℹ"), message);
  }

  chaos(message: string) {
    console.log(chalk.magenta("🔥"), message);
  }

  request(req: Request, res: Response, duration: number) {
    this.requestCount++;
    const method = this.colorMethod(req.method);
    const status = this.colorStatus(res.statusCode);
    const time = chalk.gray(`${duration}ms`);

    console.log(
      `${chalk.gray(`[${this.requestCount}]`)} ${method} ${req.path} ${status} ${time}`,
    );
  }

  banner(port: number, host: string, resourceCount: number) {
    console.log(chalk.cyan("\n╔══════════════════════════════════════════╗"));
    console.log(
      chalk.cyan("║") +
      chalk.bold.white("    🚀 Mock Server Running              ") +
      chalk.cyan("║"),
    );
    console.log(chalk.cyan("╚══════════════════════════════════════════╝\n"));

    console.log(
      chalk.gray("  Server:     ") + chalk.white(`http://${host}:${port}`),
    );
    console.log(
      chalk.gray("  Resources:  ") + chalk.white(`${resourceCount} endpoints`),
    );
    console.log(chalk.gray("  Status:     ") + chalk.green("● Active\n"));
  }

  routes(
    resources: Array<{ endpoint: string; method: string; count: number }>,
  ) {
    console.log(chalk.bold("📡 Available Endpoints:\n"));
    resources.forEach((r) => {
      const method = this.colorMethod(r.method);
      console.log(
        `   ${method} ${chalk.white(r.endpoint)} ${chalk.gray(`(${r.count} items)`)}`,
      );
    });
    console.log();
  }

  private colorMethod(method: string): string {
    const colors: Record<string, any> = {
      GET: chalk.green,
      POST: chalk.blue,
      PUT: chalk.yellow,
      PATCH: chalk.magenta,
      DELETE: chalk.red,
    };
    return (colors[method] || chalk.white)(method.padEnd(6));
  }

  private colorStatus(status: number): string {
    if (status >= 200 && status < 300) return chalk.green(status);
    if (status >= 300 && status < 400) return chalk.blue(status);
    if (status >= 400 && status < 500) return chalk.yellow(status);
    return chalk.red(status);
  }
}

export const logger = new Logger();
