import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import { statCreateSchema, statUpdateSchema, statDeleteSchema } from "@/lib/validate";

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
    const parsed = statCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const created = await db.stat.create({
      data: {
        label: d.label,
        value: d.value,
        suffix: d.suffix || null,
        order: d.order || 0,
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
    const parsed = statUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const { id, ...rest } = d;
    if (rest.value !== undefined) rest.value = rest.value;
    if (rest.order !== undefined) rest.order = rest.order;
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
    const body = await req.json();
    const parsed = statDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    await db.stat.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
