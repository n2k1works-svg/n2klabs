import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";
// Allow up to 15MB per upload (Next.js body size limit).
export const fetchCache = "force-no-store";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * POST /api/upload
 *
 * Accepts a single file via multipart/form-data (field name "file").
 * Returns a JSON object `{ url }` where `url` is a base64 data URL.
 *
 * On Vercel the filesystem is read-only, so we can't persist uploads to
 * disk — instead we return the file as a base64 data URL which gets stored
 * in the Project.images JSON array in Postgres.
 *
 * Requires admin session.
 */
export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided (field name must be 'file')" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File too large. Max ${MAX_BYTES / 1024 / 1024}MB, got ${(
            file.size /
            1024 /
            1024
          ).toFixed(1)}MB`,
        },
        { status: 413 },
      );
    }

    // Validate content type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Only image files are accepted (got ${file.type || "unknown"})` },
        { status: 400 },
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Upload endpoint. POST a file with field name 'file'. Max 15MB.",
    maxBytes: MAX_BYTES,
  });
}
