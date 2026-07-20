import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 reads the datasource URL from this file (not schema.prisma).
 * Build-time `prisma generate` does not connect to the DB — a placeholder is OK locally.
 * `prisma migrate deploy` (Railway start) must run with a real DATABASE_URL.
 */
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://build:build@127.0.0.1:5432/railway_build_placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
