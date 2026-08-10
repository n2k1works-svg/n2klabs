import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceDeleteSchema,
} from "@/lib/validate";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.service.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ services: rows });
  } catch {
    return NextResponse.json({ services: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = serviceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const created = await db.service.create({
      data: {
        title: d.title,
        slug: d.slug || d.title.toLowerCase().replace(/\s+/g, "-"),
        description: d.description,
        features: d.features ? JSON.stringify(d.features) : null,
        icon: d.icon || "Code2",
        order: d.order || 0,
      },
    });
    return NextResponse.json({ service: created });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = serviceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const { id, ...rest } = d;
    const data: Record<string, unknown> = { ...rest };
    if (Array.isArray(rest.features)) data.features = JSON.stringify(rest.features);
    if (rest.order !== undefined) data.order = rest.order;
    const updated = await db.service.update({ where: { id }, data });
    return NextResponse.json({ service: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = serviceDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    await db.service.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
