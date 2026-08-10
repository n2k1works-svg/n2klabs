/**
 * Site configuration — resolves the public site URL from environment variables.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — explicit override (set this when you add the
 *                              custom domain, e.g. https://n2klabs.com)
 *   2. NEXT_PUBLIC_VERCEL_URL — auto-injected by Vercel on every deployment,
 *                              e.g. n2k-labs-xxx.vercel.app (always HTTPS)
 *   3. http://localhost:3000  — local dev fallback
 *
 * This means: on Vercel, sitemap.xml, robots.txt, OpenGraph tags, and JSON-LD
 * structured data all automatically point to the correct deployment URL with
 * zero config. When you add the custom domain later, just set
 * NEXT_PUBLIC_SITE_URL in the Vercel dashboard and everything retargets.
 */
function resolveSiteUrl(): string {
  // 1. Explicit override (custom domain)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // 2. Vercel auto-injects this on every deployment (always HTTPS)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // 3. Local dev — HTTP, not HTTPS
  return "http://localhost:3000";
}

export const siteConfig = {
  url: resolveSiteUrl(),
  name: "N2K Labs",
  tagline: "Digital Solutions That Elevate",
  description:
    "N2K Labs is a South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.",
  // Contact details (used by JSON-LD structured data + contact form)
  email: process.env.CONTACT_EMAIL ?? "hello@n2klabs.com",
  // Phone omitted — N2K Labs is currently an unregistered sole proprietor
  // without a business phone line. Add one here once it's available.
  phone: null,
  location: "South Pacific, Fiji",
  // Social links (used in footer + JSON-LD)
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
} as const;

/** Helper: strip trailing slash for consistent URL joins. */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
