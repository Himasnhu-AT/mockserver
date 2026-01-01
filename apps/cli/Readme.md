# 🚀 MockServer CLI

A powerful CLI tool to spin up mock servers instantly with built-in chaos engineering capabilities. Perfect for frontend development when backend APIs aren't ready yet.

## ✨ Features

- 🎯 **Quick Setup** - Initialize and start mock servers in seconds
- 📱 **Ready-Made Templates** - Social media, e-commerce, and basic templates
- 🔥 **Chaos Engineering** - Test error handling with configurable failure rates
- 📊 **Pagination Support** - Automatic pagination for large datasets
- 🎨 **Pretty Logging** - Beautiful, colorful CLI output
- ⚡ **Hot Reload** - Watch mode for schema changes
- 🌐 **Full REST Support** - GET, POST, PUT, PATCH, DELETE methods
- 📝 **Rich Data Types** - 20+ field types powered by Faker.js

## 📦 Installation

```bash
npm install -g cli-mockserver
```

Or use locally in your project:

```bash
npm install --save-dev cli-mockserver
```

## 🚀 Quick Start

### 1. Initialize a new schema

```bash
mockserver init
# OR
npx cli-mockserver init
```

Choose from templates:

- 📱 Social Media (posts, comments, users, likes, etc.)
- 🛒 E-commerce (products, orders, cart)
- 📝 Basic (simple REST endpoints)

### 2. Start the server

```bash
mockserver start
# OR
npx cli-mockserver start
```

Your mock API is now running at `http://localhost:9500`!

### 3. Test your endpoints

```bash
curl http://localhost:9500/api/users
curl http://localhost:9500/api/posts
curl http://localhost:9500/api/posts/123/comments
```

## 📖 Commands

### `start` - Start the mock server

```bash
mockserver start [options]

Options:
  -p, --port <port>        Override port from schema
  -h, --host <host>        Host address (default: localhost)
  --no-chaos               Disable chaos engineering
  -w, --watch              Watch schema file for changes
```

### `init` - Initialize a new schema

```bash
mockserver init [options]

Options:
  -t, --template <name>    Use template (social, ecommerce, basic)
  -f, --force              Overwrite existing schema
```

### `validate` - Validate schema.json

```bash
mockserver validate [options]

Options:
  -s, --schema <path>      Path to schema file
```

### `info` - Show schema information

```bash
mockserver info
```

### `generate` - Generate static JSON files

```bash
mockserver generate [options]

Options:
  -o, --output <dir>       Output directory (default: ./mock-data)
```

## 🎨 Field Types

MockServer supports 20+ field types:

### Basic Types

- `uuid` - Unique identifier
- `email` - Email address
- `username` - Username
- `firstName` - First name
- `lastName` - Last name
- `sentence` - Random sentence
- `paragraph` - Random paragraph
- `word` - Random word
- `avatar` - Avatar image URL
- `image` - Random image URL
- `url` - Random URL
- `city` - City name
- `timezone` - Timezone string
- `boolean` - true/false

### Date Types

- `date:past` - Past date
- `date:recent` - Recent date (last few days)
- `date:future` - Future date
- `date:recent:nullable` - Recent date or null

### Advanced Types

- `integer:min:max` - Integer in range (e.g., `integer:0:100`)
- `enum:a,b,c` - Random from list (e.g., `enum:admin,user,guest`)
- `array:type:min:max` - Array of items (e.g., `array:image:0:5`)
- `image:type` - Typed image (e.g., `image:landscape`, `image:portrait`)

### Nested Objects

```json
{
  "fields": {
    "user": {
      "id": "uuid",
      "name": "firstName",
      "email": "email"
    }
  }
}
```

## 🔥 Chaos Engineering

Enable chaos mode to test error handling:

```json
{
  "chaos": {
    "enabled": true,
    "globalErrorRate": 0.05,
    "scenarios": {
      "timeout": 0.02,
      "serverError": 0.03,
      "networkError": 0.02
    }
  }
}
```

Set resource-specific error rates:

```json
{
  "resources": [
    {
      "endpoint": "/api/users",
      "errorConfig": {
        "rate": 0.8,
        "code": 503,
        "message": "Database Connection Failed"
      }
    }
  ]
}
```

## 📊 Pagination

Enable pagination for large datasets:

```json
{
  "resources": [
    {
      "endpoint": "/api/posts",
      "count": 100,
      "pagination": {
        "enabled": true,
        "pageSize": 15
      }
    }
  ]
}
```

Query with pagination:

```bash
curl http://localhost:9500/api/posts?page=2&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## 🎯 Example Schema

Here's a complete social media schema:

```json
{
  "port": 9500,
  "host": "localhost",
  "chaos": {
    "enabled": true,
    "globalErrorRate": 0.05
  },
  "resources": [
    {
      "id": "users",
      "name": "Users",
      "endpoint": "/api/users",
      "method": "GET",
      "count": 50,
      "pagination": {
        "enabled": true,
        "pageSize": 20
      },
      "fields": {
        "id": "uuid",
        "username": "username",
        "email": "email",
        "avatar": "avatar",
        "verified": "boolean",
        "followersCount": "integer:0:10000",
        "bio": "sentence",
        "createdAt": "date:past"
      }
    }
  ]
}
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/himasnhu-at/mockserver.git
cd mockserver

# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

BSD-3-Clause License - feel free to use this in your projects!

## 🙏 Acknowledgments

- Powered by [Faker.js](https://fakerjs.dev/) for realistic data generation
- Built with [Express](https://expressjs.com/) and [Commander](https://github.com/tj/commander.js/)
- Beautiful CLI with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

---

Made with ❤️ for frontend developers who are tired of waiting for backend APIs
