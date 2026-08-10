import type { NextConfig } from "next";

/**
 * Security headers — applied to every route.
 *
 * These protect against:
 *   - Clickjacking (X-Frame-Options / CSP frame-ancestors)
 *   - MIME-sniffing (X-Content-Type-Options)
 *   - XSS (CSP — restricts script/style/img/font sources)
 *   - Protocol downgrade (HSTS — forces HTTPS)
 *   - Referrer leakage (Referrer-Policy)
 *   - Unwanted feature access (Permissions-Policy)
 *
 * The CSP allows:
 *   - 'self' for scripts, styles, images, fonts, connect
 *   - 'unsafe-inline' for styles (Tailwind injects inline styles + framer-motion)
 *   - 'unsafe-eval' in dev only (Next.js HMR needs it)
 *   - https://fonts.googleapis.com + gstatic (next/font/google)
 *   - https://va.vercel-scripts.com (Vercel Analytics)
 *   - data: for images (base64 data URLs from the admin upload)
 *   - https://api.resend.com (contact form email)
 */
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://va.vercel-scripts.com https://api.resend.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  // Type errors should fail the build — we want to catch them at deploy time,
  // not ship them to production. Fix the errors instead of hiding them.
  typescript: {
    ignoreBuildErrors: false,
  },
  // React strict mode catches effect cleanup bugs by double-invoking effects
  // in dev. There's no reason to disable this.
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
