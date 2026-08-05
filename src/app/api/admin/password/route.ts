import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

// The admin password is managed via the ADMIN_PASSWORD env var, which can't
// be changed at runtime. This route returns instructions instead of
// attempting a DB update.
export async function POST() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    error: "Password is managed via the ADMIN_PASSWORD env var. Edit .env (local) or Vercel env vars (production), then redeploy.",
  }, { status: 400 });
}
