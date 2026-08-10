import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import {
  testimonialCreateSchema,
  testimonialUpdateSchema,
  testimonialDeleteSchema,
} from "@/lib/validate";

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
    const parsed = testimonialCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const created = await db.testimonial.create({
      data: {
        name: d.name,
        role: d.role,
        company: d.company || null,
        quote: d.quote,
        rating: d.rating || 5,
        avatar: d.avatar || null,
        order: d.order || 0,
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
    const parsed = testimonialUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    const d = parsed.data;
    const { id, ...rest } = d;
    if (rest.rating !== undefined) rest.rating = rest.rating;
    if (rest.order !== undefined) rest.order = rest.order;
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
    const body = await req.json();
    const parsed = testimonialDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    await db.testimonial.delete({ where: { id: parsed.data.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
