# Relationships

MockServer allows you to define complex nested objects directly in your resource fields to simulate relational data.

## Nested Objects

You can define a field as a raw JSON object to create nested structures.

```json
"fields": {
  "id": "uuid",
  "content": "paragraph",
  "author": {
    "id": "uuid",
    "name": "username",
    "verified": "boolean"
  },
  "stats": {
    "likes": "integer:0:1000",
    "shares": "integer:0:500"
  }
}
```

## Arrays of Objects

Currently, to generate an array of complex objects (e.g., a list of comments inside a post), you should define a separate resource endpoint for the comments (e.g., `/api/posts/:id/comments`).

However, for simple arrays of primitives, you can use the `array` type:

```json
"tags": "array:word:3:5"
// Result: ["tech", "coding", "javascript", "mock"]
```

## Foreign Keys

In `v0.1`, relationships are simulated structurally. If you need strict foreign key integrity (e.g., `userId` in a Post strictly matching an `id` in Users), you currently need to rely on the generated UUIDs.

_Future versions (v0.2+) will include strict relationship mapping._
