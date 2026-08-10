import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Image upload endpoint for the admin Projects editor.
 *
 * Accepts a single file via multipart/form-data ("file" field) and returns
 * a base64 data URL. The data URL is stored directly in the Project.images
 * JSON array column — no external file storage (S3, Vercel Blob) needed.
 *
 * This keeps the deployment simple (no storage credentials to manage) at
 * the cost of larger DB rows. For a small agency portfolio with a handful of
 * project screenshots, this is the right tradeoff.
 *
 * Limits:
 *   - 2 MB per file (enforced) — keeps base64 within Turso's row size limit
 *   - image/* MIME types only (enforced)
 *   - admin auth required
 *
 * Why 2 MB: images are stored as base64 data URLs in the Project.images
 * JSON column. Base64 encoding adds ~33% overhead, so a 2 MB image becomes
 * ~2.7 MB in the DB. Turso (libSQL) has a ~4 MB row size limit, and the
 * images column may hold multiple images, so 2 MB per upload is the safe
 * ceiling. For larger images, compress before uploading or migrate to
 * Vercel Blob / S3.
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit: 10 uploads per minute per IP
  const allowed = await rateLimit(req, RATE_LIMITS.upload);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many upload requests. Please slow down." },
      { status: 429 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Max: 2 MB. For larger images, compress before uploading.` },
        { status: 413 },
      );
    }

    // Convert to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error("[upload] failed:", msg);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
