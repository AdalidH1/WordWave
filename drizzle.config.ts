
import { defineConfig } from "drizzle-kit";

// @ts-ignore
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
});