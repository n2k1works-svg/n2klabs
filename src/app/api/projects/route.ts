import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import { ensureMigrated } from "@/lib/migrate";

export const runtime = "nodejs";

/** Parse a JSON string into an array, defaulting to []. */
function parseArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    await ensureMigrated();
    const rows = await db.project.findMany({ orderBy: { order: "asc" } });
    // Surface images as a real array (stored as JSON string in DB).
    const projects = rows.map((r) => ({
      ...r,
      tags: parseArray(r.tags),
      images: parseArray(r.images),
      gallery: parseArray(r.gallery),
    }));
    return NextResponse.json({ projects });
  } catch (e) {
    console.error("[projects] GET failed:", e);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureMigrated();
    const body = await req.json();

    // images: accept either an array of strings or a JSON string.
    let images: string[] = [];
    if (Array.isArray(body.images)) {
      images = body.images.filter((x: unknown) => typeof x === "string");
    } else if (typeof body.images === "string") {
      images = parseArray(body.images);
    }

    const created = await db.project.create({
      data: {
        title: String(body.title || ""),
        client: String(body.client || ""),
        category: String(body.category || ""),
        description: String(body.description || ""),
        challenge: body.challenge || null,
        solution: body.solution || null,
        result: body.result || null,
        url: body.url || null,
        // `image` = primary/cover = first of images if not explicitly set
        image: body.image || images[0] || null,
        images: JSON.stringify(images),
        tags: body.tags ? JSON.stringify(body.tags) : null,
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        featured: !!body.featured,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json({ project: created });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    console.error("[projects] POST failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureMigrated();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    // ── Strip fields that must never be overwritten on update ──────────
    // createdAt / updatedAt are auto-managed by Prisma; passing them back
    // (which the client does, because GET returns them) causes a Prisma
    // validation error → "Update failed". This was the root cause of the
    // "Save failed" bug in the admin panel.
    const { createdAt, updatedAt, ...writable } = rest;

    const data: Record<string, unknown> = { ...writable };

    // ── images array → JSON string ──────────────────────────────────────
    if (Array.isArray(body.images)) {
      const imgs = body.images.filter((x: unknown) => typeof x === "string");
      data.images = JSON.stringify(imgs);
      // Keep `image` (cover) in sync with the first image when the client
      // doesn't explicitly set it.
      if (imgs.length && !body.image) {
        data.image = imgs[0];
      } else if (body.image !== undefined) {
        data.image = body.image;
      } else if (imgs.length === 0) {
        data.image = null;
      }
    } else if (typeof body.images === "string") {
      data.images = body.images;
    }

    if (Array.isArray(body.tags)) data.tags = JSON.stringify(body.tags);
    if (Array.isArray(body.gallery)) data.gallery = JSON.stringify(body.gallery);
    if (body.order !== undefined) data.order = Number(body.order);

    const updated = await db.project.update({ where: { id }, data });
    return NextResponse.json({ project: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    console.error("[projects] PUT failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    console.error("[projects] DELETE failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
