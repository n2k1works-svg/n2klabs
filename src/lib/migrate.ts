import { db } from "./db";

/**
 * Runtime auto-migration.
 *
 * Vercel's filesystem is read-only during builds, and `prisma db push` may
 * fail if DATABASE_URL isn't ready. This ensures schema additions (like the
 * `images` column on Project) are applied lazily at runtime on the first API
 * call after a deploy — without needing a build-time migration step.
 *
 * The check is cached so it only runs once per cold start.
 */

let migrated = false;

export async function ensureMigrated(): Promise<void> {
  if (migrated) return;

  try {
    // Check whether the `images` column exists on the Project table.
    // Postgres: information_schema.columns
    const rows = await db.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Project'
          AND column_name = 'images'
      ) AS exists
    `;
    const exists = rows[0]?.exists;
    if (!exists) {
      // Column missing — add it with a safe default.
      await db.$executeRawUnsafe(
        `ALTER TABLE "Project" ADD COLUMN "images" TEXT NOT NULL DEFAULT '[]'`,
      );
      console.log("[migrate] Added images column to Project table");
    }
    migrated = true;
  } catch (e) {
    // Don't crash the request — the API handlers have their own fallbacks.
    console.error("[migrate] ensureMigrated failed (non-fatal):", e);
    // Cache true anyway so we don't retry on every request.
    migrated = true;
  }
}
