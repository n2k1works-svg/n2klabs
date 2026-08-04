import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ projects: rows });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const created = await db.project.create({
      data: {
        title: body.title,
        client: body.client,
        category: body.category,
        description: body.description,
        challenge: body.challenge || null,
        solution: body.solution || null,
        result: body.result || null,
        url: body.url || null,
        image: body.image || null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        featured: !!body.featured,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json({ project: created });
  } catch (e) {
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
    if (Array.isArray(rest.tags)) data.tags = JSON.stringify(rest.tags);
    if (Array.isArray(rest.gallery)) data.gallery = JSON.stringify(rest.gallery);
    if (rest.order !== undefined) data.order = Number(rest.order);
    const updated = await db.project.update({ where: { id }, data });
    return NextResponse.json({ project: updated });
  } catch (e) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
