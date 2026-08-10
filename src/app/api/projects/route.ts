import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import {
  projectCreateSchema,
  projectUpdateSchema,
  projectDeleteSchema,
} from "@/lib/validate";

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
    const rows = await db.project.findMany({ orderBy: { order: "asc" } });
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
    const body = await req.json();
    const parsed = projectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const images = d.images || [];
    const created = await db.project.create({
      data: {
        title: d.title,
        client: d.client,
        category: d.category,
        description: d.description,
        challenge: d.challenge || null,
        solution: d.solution || null,
        result: d.result || null,
        url: d.url || null,
        image: d.image || images[0] || null,
        images: JSON.stringify(images),
        tags: d.tags ? JSON.stringify(d.tags) : null,
        gallery: d.gallery ? JSON.stringify(d.gallery) : null,
        featured: d.featured || false,
        order: d.order || 0,
      },
    });
    return NextResponse.json({ project: created });
  } catch (e) {
    console.error("[projects] POST failed:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const { createdAt, updatedAt, ...writable } = d as Record<string, unknown>;
    const id = d.id;

    const data: Record<string, unknown> = { ...writable };
    delete data.id;

    if (Array.isArray(d.images)) {
      data.images = JSON.stringify(d.images);
      if (d.images.length && !d.image) {
        data.image = d.images[0];
      } else if (d.image !== undefined) {
        data.image = d.image;
      } else if (d.images.length === 0) {
        data.image = null;
      }
    } else if (typeof d.images === "string") {
      data.images = d.images;
    }

    if (Array.isArray(d.tags)) data.tags = JSON.stringify(d.tags);
    if (Array.isArray(d.gallery)) data.gallery = JSON.stringify(d.gallery);
    if (d.order !== undefined) data.order = d.order;

    // Remove fields that shouldn't be written directly
    delete data.image;
    if (d.image !== undefined) data.image = d.image;

    const updated = await db.project.update({ where: { id }, data: data as any });
    return NextResponse.json({ project: updated });
  } catch (e) {
    console.error("[projects] PUT failed:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = projectDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    await db.project.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[projects] DELETE failed:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
