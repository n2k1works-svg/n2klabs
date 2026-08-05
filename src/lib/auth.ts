import { cookies } from "next/headers";

const SESSION_COOKIE = "n2k_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Simple, database-free admin auth.
 *
 * The password is checked against the ADMIN_PASSWORD env var. No AdminUser
 * table is needed — this works identically on local dev (SQLite) and on
 * Vercel (no DB). The session cookie is a SHA-256 hash of the password,
 * so it can't be forged without knowing the password.
 */

export async function hashPassword(pw: string): Promise<string> {
  const enc = new TextEncoder().encode(`n2k::${pw}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  if (pw === stored) return true;
  const h = await hashPassword(pw);
  return h === stored;
}

/** Check a submitted password against the ADMIN_PASSWORD env var. */
export async function checkAdminPassword(pw: string): Promise<boolean> {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return false;
  // Direct match (env var is plaintext) or hashed match
  if (pw === adminPw) return true;
  return verifyPassword(pw, adminPw);
}

/** Create a session cookie. Token = hash(password) so it's tied to the credential. */
export async function createSession(): Promise<void> {
  const adminPw = process.env.ADMIN_PASSWORD || "";
  const token = await hashPassword(adminPw);
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

/** Return the admin user if the session cookie is valid. No DB lookup. */
export async function getAdminUser(): Promise<{ email: string; name: string | null } | null> {
  try {
    const adminPw = process.env.ADMIN_PASSWORD;
    if (!adminPw) return null;
    const expectedToken = await hashPassword(adminPw);

    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token || token !== expectedToken) return null;

    return {
      email: process.env.ADMIN_EMAIL || "admin@n2klabs.com",
      name: "N2K Admin",
    };
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
