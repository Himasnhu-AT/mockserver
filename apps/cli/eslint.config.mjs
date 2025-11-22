import { defineConfig } from "eslint/config";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    ignores: ["dist/**"],
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...ts.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
