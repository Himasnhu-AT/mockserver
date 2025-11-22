# Defining Resources

Resources map a URL endpoint to a generated data structure.

## The Resource Object

```json
{
  "id": "users",
  "name": "Users List",
  "endpoint": "/api/users",
  "method": "GET",
  "count": 50,
  "fields": { ... }
}
````

  * **id**: Unique internal identifier.
  * **endpoint**: The URL path. Supports parameters like `/api/users/:id`.
  * **method**: HTTP method (GET, POST, etc).
  * **count**: How many items to generate in the array.

## Dynamic Routes

For detail views, use the `:param` syntax:

```json
{
  "id": "user-detail",
  "endpoint": "/api/users/:id",
  "count": 1, 
  "fields": {
    "id": "uuid",
    "username": "username"
  }
}
```

When you request `/api/users/123`, MockServer will generate a single object.

## Pagination

MockServer handles pagination logic automatically if enabled.

```json
"pagination": {
  "enabled": true,
  "pageSize": 20
}
```

The response structure changes to standard envelope format:

```json
{
  "data": [ ... ], // 20 items
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```
