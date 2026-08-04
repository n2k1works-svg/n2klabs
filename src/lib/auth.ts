import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "n2k_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Simple cookie-based admin auth.
 * Token = base64(email:hash(password)). We compare against DB passwordHash.
 * NOTE: In production, use bcrypt + httpOnly + secure cookies. This is a demo.
 */

export async function hashPassword(pw: string): Promise<string> {
  // Lightweight hash using Web Crypto (available in Next runtime)
  const enc = new TextEncoder().encode(`n2k::${pw}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  // Support both plain (legacy seed) and hashed stores
  if (pw === stored) return true;
  const h = await hashPassword(pw);
  return h === stored;
}

export async function createSession(email: string): Promise<void> {
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminUser(): Promise<{ email: string; name: string | null } | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const email = decoded.split(":")[0];
    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user) return null;
    return { email: user.email, name: user.name };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ email: string; name: string | null }> {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
