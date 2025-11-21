import { ChaosConfig, Resource } from "../types";

interface ChaosResult {
  fail: boolean;
  code: number;
  message: string;
}

export class ChaosEngine {
  private config: ChaosConfig;

  constructor(config: ChaosConfig) {
    this.config = config;
  }

  shouldFail(resource: Resource): ChaosResult {
    if (!this.config.enabled) {
      return { fail: false, code: 200, message: "" };
    }

    // Check resource-specific error config first
    if (resource.errorConfig) {
      const shouldError = Math.random() < resource.errorConfig.rate;
      if (shouldError) {
        return {
          fail: true,
          code: resource.errorConfig.code,
          message: resource.errorConfig.message,
        };
      }
    }

    // Check global scenarios
    const random = Math.random();
    let cumulative = 0;

    // Timeout scenario
    if (this.config.scenarios?.timeout) {
      cumulative += this.config.scenarios.timeout;
      if (random < cumulative) {
        return {
          fail: true,
          code: 408,
          message: "Request Timeout",
        };
      }
    }

    // Server error scenario
    if (this.config.scenarios?.serverError) {
      cumulative += this.config.scenarios.serverError;
      if (random < cumulative) {
        return {
          fail: true,
          code: 500,
          message: "Internal Server Error",
        };
      }
    }

    // Network error scenario
    if (this.config.scenarios?.networkError) {
      cumulative += this.config.scenarios.networkError;
      if (random < cumulative) {
        return {
          fail: true,
          code: 503,
          message: "Service Unavailable",
        };
      }
    }

    // Global error rate
    const shouldGlobalError = Math.random() < this.config.globalErrorRate;
    if (shouldGlobalError) {
      return {
        fail: true,
        code: this.randomErrorCode(),
        message: this.randomErrorMessage(),
      };
    }

    return { fail: false, code: 200, message: "" };
  }

  private randomErrorCode(): number {
    const codes = [400, 401, 403, 404, 429, 500, 502, 503];
    return codes[Math.floor(Math.random() * codes.length)];
  }

  private randomErrorMessage(): string {
    const messages = [
      "Chaos Monkey struck!",
      "Service temporarily unavailable",
      "Rate limit exceeded",
      "Bad Gateway",
      "Database connection failed",
      "Authentication failed",
      "Network error occurred",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
