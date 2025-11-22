# CLI Commands

The CLI is your primary interface for managing the mock server.

## `init`

Initialize a new `schema.json` file in the current directory.

```bash
mockserver init [options]
````

**Options:**

  * `-t, --template <name>`: Use a preset template (`social`, `ecommerce`, `basic`).
  * `-f, --force`: Overwrite an existing schema file.

## `start`

Starts the mock server using the configuration found in `schema.json`.

```bash
mockserver start [options]
```

**Options:**

  * `-p, --port <number>`: Override the port defined in the schema.
  * `-h, --host <string>`: specific host address (default: `localhost`).
  * `-w, --watch`: Watch the schema file for changes and auto-restart.
  * `--no-chaos`: Disable chaos engineering features (useful for end-to-end tests).

## `generate`

Generates static JSON files from your schema. Useful if you want to export the mocked data for use in Storybook or offline demos.

```bash
mockserver generate --output ./data
```

## `validate`

Validates your `schema.json` against the internal MockServer specification to catch typos in field types or configuration.

```bash
mockserver validate
```
