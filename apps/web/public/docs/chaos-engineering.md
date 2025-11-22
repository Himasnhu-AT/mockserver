# Chaos Engineering

Frontend applications often fail gracefully in development but crash in production due to network flakiness. **Chaos Mode** proactively introduces these failures during development.

## Enabling Chaos

Chaos mode is configured globally in your schema:

```json
"chaos": {
  "enabled": true,
  "globalErrorRate": 0.1,
  "scenarios": {
    "timeout": 0.05,
    "serverError": 0.03,
    "networkError": 0.02
  }
}
```

## How Probability Works

- `globalErrorRate`: The overall chance (0.0 to 1.0) that a request will fail. Here, **10%** of all requests will trigger a chaos event.
- `scenarios`: Defines _how_ it fails.
  - **timeout**: The request hangs indefinitely or takes exceedingly long (simulates dropped packets).
  - **serverError**: Returns `500 Internal Server Error`.
  - **networkError**: abruptly closes the connection.

## Resource-Level Overrides

You can define specific error rates for critical endpoints (e.g., a payment endpoint) inside the resource definition:

```json
{
  "id": "payments",
  "endpoint": "/api/pay",
  "errorConfig": {
    "rate": 0.5, // 50% failure rate for testing error boundaries
    "code": 503,
    "message": "Payment gateway busy"
  }
}
```
