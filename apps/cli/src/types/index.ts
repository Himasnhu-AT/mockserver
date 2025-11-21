export type FieldType =
  | "uuid"
  | "email"
  | "username"
  | "firstName"
  | "lastName"
  | "sentence"
  | "paragraph"
  | "word"
  | "avatar"
  | "image"
  | "url"
  | "city"
  | "timezone"
  | "boolean"
  | "date:past"
  | "date:recent"
  | "date:future"
  | "date:recent:nullable"
  | string; // For dynamic types like "integer:0:100", "enum:a,b,c", "array:type:min:max"

export interface ErrorConfig {
  rate: number;
  code: number;
  message: string;
}

export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
}

export interface Resource {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  count: number;
  fields: Record<string, FieldType | any>;
  errorConfig?: ErrorConfig;
  pagination?: PaginationConfig;
}

export interface DelayConfig {
  enabled: boolean;
  min: number;
  max: number;
}

export interface ChaosConfig {
  enabled: boolean;
  globalErrorRate: number;
  scenarios?: {
    timeout?: number;
    serverError?: number;
    networkError?: number;
  };
}

export interface AuthConfig {
  enabled: boolean;
  type: "bearer" | "basic" | "apikey";
  tokens?: string[];
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
}

export interface LoggingConfig {
  level: "debug" | "info" | "warn" | "error";
  format: "pretty" | "json";
  requests: boolean;
}

export interface Schema {
  port: number;
  host: string;
  delay?: DelayConfig;
  chaos: ChaosConfig;
  auth?: AuthConfig;
  cors?: CorsConfig;
  logging?: LoggingConfig;
  resources: Resource[];
}

export interface CommandOptions {
  port?: number;
  host?: string;
  chaos?: boolean;
  watch?: boolean;
  template?: string;
  force?: boolean;
  schema?: string;
  output?: string;
}
