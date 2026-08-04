import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.stat.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ stats: rows });
  } catch {
    return NextResponse.json({ stats: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const created = await db.stat.create({
      data: {
        label: body.label,
        value: Number(body.value) || 0,
        suffix: body.suffix || null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json({ stat: created });
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
    if (rest.value !== undefined) rest.value = Number(rest.value);
    if (rest.order !== undefined) rest.order = Number(rest.order);
    const updated = await db.stat.update({ where: { id }, data: rest });
    return NextResponse.json({ stat: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.stat.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
