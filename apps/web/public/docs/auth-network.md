# Auth & Network

MockServer provides built-in utilities to simulate real-world networking constraints and security headers.

## CORS (Cross-Origin Resource Sharing)

If your frontend runs on port 3000 and MockServer runs on 9500, you must enable CORS to allow the browser to fetch data.

```json
"cors": {
  "enabled": true,
  "origins": ["http://localhost:3000", "http://localhost:5173"]
}
```

Use `"*"` in origins to allow all connections.

## Authentication

You can simulate protected routes. When enabled, MockServer checks for an `Authorization` header. If missing or invalid, it returns a `401 Unauthorized` status.

```json
"auth": {
  "enabled": true,
  "type": "bearer",
  "tokens": ["mock-token-123", "admin-token-456"]
}
```

- **type**: Currently supports `bearer` (standard JWT pattern).
- **tokens**: An array of valid strings. Any token not in this list will be rejected.

## Global Delay

To test loading skeletons and spinners in your UI, add artificial delay:

```json
"delay": {
  "enabled": true,
  "min": 500,  // Minimum 500ms
  "max": 1500  // Maximum 1.5s
}
```
