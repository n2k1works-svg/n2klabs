import { defineConfig } from "prisma/config";

// Prisma 7 config file (replaces the deprecated `package.json#prisma` field).
// See: https://www.prisma.io/docs/orpc/prisma-config
//
// In Prisma 7, the datasource URL was REMOVED from schema.prisma and moved
// here. The runtime PrismaClient uses the driver adapter (src/lib/db.ts),
// while this datasource.url is used by migration/introspection commands
// (prisma db push, prisma migrate, prisma db execute, etc.).
//
// NOTE: Prisma 7 does NOT auto-load .env files (unlike Prisma 6). The
// `env()` helper from `prisma/config` throws if the var is missing, which
// breaks `prisma generate` in environments where DATABASE_URL is only in
// .env (e.g. local dev via `bun run db:generate`). We use `process.env`
// directly so `prisma generate` works without the URL, and `prisma db push`
// picks it up when it's set (Vercel sets real env vars; for local push use
// `bun --env-file=.env run db:push`).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    // Command Prisma runs after `prisma db push` / `prisma migrate dev` to seed
    // the database with static content (services, settings, stats, etc.).
    seed: "bun prisma/seed.ts",
  },
});
