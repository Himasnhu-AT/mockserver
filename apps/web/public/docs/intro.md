# Introduction

**MockServer** is a dynamic backend simulator designed specifically for frontend developers. It allows you to generate realistic data relationships, handle pagination, and simulate infrastructure failures via Chaos Engineering principles—all controlled by a single JSON schema.

## Why MockServer?

Frontend development often stalls when waiting for backend APIs to be built or when the staging environment is down. MockServer solves this by decoupling your workflow.

| Feature                 | Description                                                                                           |
| :---------------------- | :---------------------------------------------------------------------------------------------------- |
| ⚡️ **Instant APIs**    | Define resources in JSON and get a full CRUD API with pagination, searching, and filtering instantly. |
| 🎲 **Chaos Mode**       | Test your app's resilience by simulating random timeouts, 500 errors, and network failures.           |
| 🧬 **Realistic Data**   | Generate avatars, bios, dates, and nested arrays using a powerful string-based typing system.         |
| 🛠 **Zero Boilerplate** | No controllers, no services. Just run `mockserver start` and focus on your frontend.                  |

## How it works

1.  **Define:** Create a `schema.json` defining your resources and data types.
2.  **Run:** Start the server with `mockserver start`.
3.  **Consume:** Fetch data from `http://localhost:9500/api/...` in your frontend.

MockServer doesn't just return static JSON; it generates data dynamically based on your rules, ensuring you never see the exact same stale data twice unless you want to.
