# 🌐 MockServer Web

The official website, documentation, and visual schema builder for **MockServer CLI**.

## ✨ Features

- **Landing Page**: Product showcase, feature breakdown, and interactive demos.
- **Visual Schema Builder**: A drag-and-drop interface (`/schemabuilder`) to design your API schemas visually.
    - Connects directly to your local CLI instance so changes are saved instantly.
    - Test endpoints directly from the browser.
- **Documentation**: Comprehensive guides and API references (`/docs`).

## 🛠️ Development

This is a [Next.js](https://nextjs.org) application.

### Prerequisites

- Node.js 20+
- pnpm

### Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Key Routes

- `/` - Landing Page
- `/schemabuilder` - The Visual Schema Editor (requires CLI to be running on port 9500)
- `/docs` - Documentation

## 📦 Build

```bash
pnpm build
pnpm start
```
