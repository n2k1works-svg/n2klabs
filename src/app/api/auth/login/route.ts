import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }
    const ok = await checkAdminPassword(password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    await createSession();
    return NextResponse.json({ ok: true, user: { name: "N2K Admin" } });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
