# Schema Configuration

The `schema.json` file is the brain of your mock server. It dictates server settings, behavior, and the data model.

## Basic Structure

A minimal configuration looks like this:

```json
{
  "port": 9500,
  "host": "localhost",
  "delay": {
    "enabled": true,
    "min": 200,
    "max": 1000
  },
  "logging": {
    "level": "info",
    "requests": true
  },
  "resources": []
}
```

## Global Settings

| Setting   | Type   | Description                         |
| :-------- | :----- | :---------------------------------- |
| `port`    | number | The port the server listens on.     |
| `host`    | string | usually "localhost" or "0.0.0.0".   |
| `delay`   | object | Simulates global network latency.   |
| `logging` | object | Controls terminal output verbosity. |

## Logging Config

If you are debugging connection issues, enable request logging:

```json
"logging": {
  "level": "debug",
  "format": "pretty",
  "requests": true
}
```
