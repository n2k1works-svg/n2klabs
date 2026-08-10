import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Health check endpoint — verifies DB connectivity.
 *
 * Use with uptime monitors (UptimeRobot, BetterUptime, Vercel's built-in
 * monitor) to detect both HTTP outages AND database outages.
 *
 * GET /api/health
 * → 200 { ok: true, db: "connected" }   (DB reachable)
 * → 503 { ok: false, db: "disconnected" } (DB unreachable)
 */
export async function GET() {
  try {
    await db.setting.count();
    return NextResponse.json({ ok: true, db: "connected", timestamp: new Date().toISOString() });
  } catch (e) {
    console.error("[health] DB check failed:", e);
    return NextResponse.json(
      { ok: false, db: "disconnected", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
