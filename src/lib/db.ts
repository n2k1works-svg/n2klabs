import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

// Prisma + Turso (libSQL) client setup using the driver adapter.
//
// DATABASE_URL must be in the form:
//   libsql://<db-name>-<handle>.turso.io?authToken=<token>
// (Both local .env and the Vercel env var must use this format.)
//
// PrismaLibSql is a driver adapter FACTORY — it accepts a libsql Config
// object (not a pre-built Client) and creates its own internal client.
//
// On Vercel, the libSQL adapter keeps a single warm PrismaClient across
// hot-reloads in dev (via globalThis), and spins up a fresh one per
// serverless invocation in production — which is what we want for libSQL.
//
// Prisma 7 note: driver adapters are now GA — no previewFeatures flag
// needed in schema.prisma. The class was renamed from PrismaLibSQL
// (Prisma 6) to PrismaLibSql (Prisma 7).

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. For local dev, set it to ' +
        '"file:/home/z/my-project/db/custom.db" (local SQLite). For production, ' +
        'use a Turso libsql:// URL set in the Vercel env vars.',
    )
  }
  // Both forms are valid for the @prisma/adapter-libsql driver:
  //   - file:/path/to/local.db   → local SQLite (dev)
  //   - libsql://host?authToken= → remote Turso (prod)
  // We do NOT reject file: URLs — local SQLite is the intended dev mode.
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
