import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * Custom 404 page — branded, with navigation back to the site.
 * Replaces Next.js's default "404 | This page could not be found."
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08),transparent_60%)]" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--accent)] uppercase mb-4">
          Error / 404
        </div>
        <h1 className="font-sans font-black text-7xl md:text-8xl text-[#f0ece6] tracking-tight mb-6">
          404
        </h1>
        <p className="text-[#8a8a93] text-sm leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          N2K Labs builds digital experiences — this just isn&apos;t one of them.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--accent)] text-[#0a0a0c] font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to home
          </Link>
          <a
            href={`mailto:${siteConfig.email}`}
            className="px-6 py-3 border border-[rgba(255,255,255,0.15)] text-[#f0ece6] font-semibold text-sm rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
