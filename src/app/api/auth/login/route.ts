import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validate";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Rate limit: 5 login attempts per minute per IP
  const allowed = await rateLimit(req, RATE_LIMITS.login);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const ok = await checkAdminPassword(parsed.data.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    await createSession();
    return NextResponse.json({ ok: true, user: { name: "N2K Admin" } });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
