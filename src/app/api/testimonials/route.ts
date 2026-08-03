import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ testimonials: rows });
  } catch {
    return NextResponse.json({ testimonials: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const created = await db.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        company: body.company || null,
        quote: body.quote,
        rating: Number(body.rating) || 5,
        avatar: body.avatar || null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json({ testimonial: created });
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
    if (rest.rating !== undefined) rest.rating = Number(rest.rating);
    if (rest.order !== undefined) rest.order = Number(rest.order);
    const updated = await db.testimonial.update({ where: { id }, data: rest });
    return NextResponse.json({ testimonial: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
