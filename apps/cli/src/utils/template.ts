import { Schema } from "../types";

const socialTemplate: Schema = {
  port: 9500,
  host: "localhost",
  delay: { enabled: false, min: 100, max: 1000 },
  chaos: { enabled: true, globalErrorRate: 0.05 },
  cors: { enabled: true, origins: ["*"] },
  logging: { level: "info", format: "pretty", requests: true },
  resources: [
    {
      id: "users",
      name: "Users",
      endpoint: "/api/users",
      method: "GET",
      count: 50,
      pagination: { enabled: true, pageSize: 20 },
      fields: {
        id: "uuid",
        username: "username",
        email: "email",
        firstName: "firstName",
        lastName: "lastName",
        avatar: "avatar",
        bio: "sentence",
        verified: "boolean",
        followersCount: "integer:0:10000",
        followingCount: "integer:0:5000",
        createdAt: "date:past",
      },
    },
    {
      id: "posts",
      name: "Posts",
      endpoint: "/api/posts",
      method: "GET",
      count: 100,
      pagination: { enabled: true, pageSize: 15 },
      fields: {
        id: "uuid",
        userId: "uuid",
        username: "username",
        userAvatar: "avatar",
        content: "paragraph",
        likesCount: "integer:0:10000",
        commentsCount: "integer:0:1000",
        createdAt: "date:recent",
      },
    },
  ],
};

const ecommerceTemplate: Schema = {
  port: 9500,
  host: "localhost",
  delay: { enabled: false, min: 100, max: 1000 },
  chaos: { enabled: false, globalErrorRate: 0.02 },
  cors: { enabled: true, origins: ["*"] },
  logging: { level: "info", format: "pretty", requests: true },
  resources: [
    {
      id: "products",
      name: "Products",
      endpoint: "/api/products",
      method: "GET",
      count: 50,
      pagination: { enabled: true, pageSize: 20 },
      fields: {
        id: "uuid",
        name: "sentence",
        description: "paragraph",
        price: "integer:10:1000",
        category: "enum:electronics,clothing,books,home",
        stock: "integer:0:100",
        rating: "integer:1:5",
        image: "image",
        createdAt: "date:past",
      },
    },
    {
      id: "orders",
      name: "Orders",
      endpoint: "/api/orders",
      method: "GET",
      count: 30,
      fields: {
        id: "uuid",
        userId: "uuid",
        total: "integer:50:5000",
        status: "enum:pending,processing,shipped,delivered",
        items: "integer:1:10",
        createdAt: "date:recent",
      },
    },
  ],
};

const basicTemplate: Schema = {
  port: 9500,
  host: "localhost",
  delay: { enabled: false, min: 100, max: 1000 },
  chaos: { enabled: false, globalErrorRate: 0.01 },
  cors: { enabled: true, origins: ["*"] },
  logging: { level: "info", format: "pretty", requests: true },
  resources: [
    {
      id: "items",
      name: "Items",
      endpoint: "/api/items",
      method: "GET",
      count: 20,
      fields: {
        id: "uuid",
        name: "sentence",
        description: "paragraph",
        createdAt: "date:recent",
      },
    },
  ],
};

const defaultTemplate: Schema = {
  port: 9500,
  host: "localhost",
  delay: { enabled: false, min: 100, max: 1000 },
  chaos: { enabled: true, globalErrorRate: 0.01 },
  auth: {
    enabled: true,
    type: "bearer",
    tokens: ["mock-token-123", "admin-token-456"],
  },
  cors: { enabled: true, origins: ["*"] },
  logging: { level: "info", format: "pretty", requests: true },
  resources: [
    {
      id: "users",
      name: "Users",
      endpoint: "/api/users",
      method: "GET",
      count: 20,
      pagination: { enabled: true, pageSize: 10 },
      fields: {
        id: "uuid",
        username: "username",
        email: "email",
        password: "password", // Simulated password field
        role: "enum:user,admin,guest",
        firstName: "firstName",
        lastName: "lastName",
        avatar: "avatar",
        isActive: "boolean",
        createdAt: "date:past",
      },
    },
    {
      id: "auth-me",
      name: "Current User",
      endpoint: "/api/auth/me",
      method: "GET",
      count: 1,
      fields: {
        id: "uuid",
        username: "username",
        email: "email",
        role: "enum:user,admin",
        permissions: "array:word:2:5",
      },
      errorConfig: {
        rate: 0,
        code: 401,
        message: "Unauthorized",
      },
    },
    {
      id: "posts",
      name: "Posts",
      endpoint: "/api/posts",
      method: "GET",
      count: 50,
      pagination: { enabled: true, pageSize: 10 },
      fields: {
        id: "uuid",
        authorId: "uuid",
        title: "sentence",
        content: "paragraph",
        published: "boolean",
        tags: "array:word:1:3",
        createdAt: "date:recent",
      },
    },
  ],
};

export const templates = {
  get(name: string): Schema | null {
    switch (name) {
      case "default":
        return defaultTemplate;
      case "social":
        return socialTemplate;
      case "ecommerce":
        return ecommerceTemplate;
      case "basic":
        return basicTemplate;
      default:
        // Default to defaultTemplate if name is not found, or strict check?
        // Let's keep it strict for now but 'default' is the fallback key.
        return null;
    }
  },
};
