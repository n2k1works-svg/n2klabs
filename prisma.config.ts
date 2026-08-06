import { defineConfig } from "prisma/config";

// Prisma config file (replaces the deprecated `package.json#prisma` field).
// See: https://www.prisma.io/docs/orpc/prisma-config
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // Command Prisma runs after `prisma db push` / `prisma migrate dev` to seed
    // the database with static content (services, settings, stats, etc.).
    seed: "bun prisma/seed.ts",
  },
});
