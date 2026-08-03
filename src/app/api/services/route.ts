import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

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
    const created = await db.service.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.description,
        features: body.features ? JSON.stringify(body.features) : null,
        icon: body.icon || "Code2",
        order: Number(body.order) || 0,
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
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data: Record<string, unknown> = { ...rest };
    if (Array.isArray(rest.features)) data.features = JSON.stringify(rest.features);
    if (rest.order !== undefined) data.order = Number(rest.order);
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
    const { id } = await req.json();
    await db.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
