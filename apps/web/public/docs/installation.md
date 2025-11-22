# Installation

MockServer is built on Node.js. Ensure you have Node.js 18+ installed on your machine.

## Global Installation (Recommended)

Installing globally allows you to use the `mockserver` command in any directory on your machine.

```bash
npm install -g mockserver-cli
# or
pnpm add -g mockserver-cli
````

## Local Installation

If you prefer to keep dependencies specific to a project (useful for CI/CD), install it as a dev dependency.

```bash
npm install --save-dev mockserver-cli
```

## Quick Start

Once installed, navigate to your project folder and initialize a new configuration:

```bash
mockserver init --template social
mockserver start --watch
```

You should see the server startup banner and the URL where your API is running (default: `http://localhost:9500`).
