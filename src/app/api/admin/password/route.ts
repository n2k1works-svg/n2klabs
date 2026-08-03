import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser, verifyPassword, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both passwords required" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const admin = await db.adminUser.findUnique({ where: { email: user.email } });
    if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const ok = await verifyPassword(currentPassword, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 401 });
    }
    const newHash = await hashPassword(newPassword);
    await db.adminUser.update({
      where: { email: user.email },
      data: { passwordHash: newHash },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
