import { db } from "./db";

/**
 * Runtime auto-migration — now a no-op.
 *
 * Historically this checked whether the `images` column existed on the Project
 * table and added it if missing (a workaround for when Vercel's read-only
 * build filesystem prevented `prisma db push` from running). The check used
 * PostgreSQL's `information_schema.columns`.
 *
 * With the Turso (libSQL/SQLite) migration, this is no longer needed:
 *   - The schema is managed by `prisma db push` (run manually or on deploy).
 *   - The Turso DB already has all columns including `images`.
 *   - SQLite doesn't have `information_schema` — only `PRAGMA table_info`.
 *
 * Kept as a no-op (instead of deleted) so callers in projects/route.ts don't
 * need to change. It caches `true` immediately and does no DB work.
 */
let migrated = true;

export async function ensureMigrated(): Promise<void> {
  // No-op: schema is managed by Prisma migrations against Turso.
  // The `images` column already exists in the Turso DB.
  return;
}
