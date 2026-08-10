import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { siteConfig } from "@/lib/site";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
};

/**
 * Shared layout for legal pages (Privacy Policy, Terms of Service).
 *
 * Branded to match the main site: dark background (#0a0a0c), cyan accent
 * (#00d4ff), JetBrains Mono labels, grid overlay, and the same glow treatment
 * used elsewhere on the site.
 *
 * Features:
 *   - Sticky sidebar table-of-contents on desktop (scroll-spy via CSS only)
 *   - Mobile TOC collapses to a <details> element
 *   - Skip-to-content link for keyboard accessibility
 *   - "Last updated" date prominently shown
 *   - Back-to-home CTA at the bottom
 */
export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-[#f0ece6]">
      {/* Background effects (same as main site) */}
      <div className="absolute inset-0 grid-overlay opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.08),transparent_70%)] pointer-events-none" />

      {/* Skip link */}
      <a
        href="#legal-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:border-[var(--accent)] focus:bg-[#0a0a0c] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--accent)]"
      >
        Skip to content
      </a>

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a8a93] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to N2K Labs
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5">
              <Shield className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <span className="mono-label text-[var(--accent)]">LEGAL</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-[#8a8a93] max-w-2xl mb-6">{subtitle}</p>
          <p className="mono-label text-[#9aa0a8]">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content + TOC */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Desktop TOC — sticky sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
              <div className="mono-label text-[var(--accent)] mb-4">
                ON THIS PAGE
              </div>
              <ul className="space-y-2 border-l border-white/10">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block pl-4 py-1 text-sm text-[#8a8a93] hover:text-[var(--accent)] hover:border-l-2 hover:border-[var(--accent)] -ml-px transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Link
                  href="/privacy"
                  className={`block text-sm py-1 transition-colors ${
                    title === "Privacy Policy"
                      ? "text-[var(--accent)] font-medium"
                      : "text-[#8a8a93] hover:text-[var(--accent)]"
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className={`block text-sm py-1 transition-colors ${
                    title === "Terms of Service"
                      ? "text-[var(--accent)] font-medium"
                      : "text-[#8a8a93] hover:text-[var(--accent)]"
                  }`}
                >
                  Terms of Service
                </Link>
              </div>
            </nav>
          </aside>

          {/* Mobile TOC — collapsible */}
          <details className="lg:hidden mb-8 border border-white/10 rounded-lg bg-white/[0.02]">
            <summary className="cursor-pointer p-4 mono-label text-[var(--accent)]">
              ON THIS PAGE
            </summary>
            <ul className="px-4 pb-4 space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1 text-sm text-[#8a8a93] hover:text-[var(--accent)]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          {/* Main content */}
          <main
            id="legal-content"
            className="lg:col-span-9 max-w-3xl"
          >
            <div className="space-y-12">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#f0ece6]">
                    {s.title}
                  </h2>
                  <div className="prose-legal text-[#a8a8b3] leading-relaxed space-y-4 [&_a]:text-[var(--accent)] [&_a:hover]:underline [&_strong]:text-[#f0ece6] [&_code]:text-[var(--accent)] [&_code]:bg-[var(--accent)]/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2 text-[#f0ece6]">
                  Questions about this document?
                </h3>
                <p className="text-sm text-[#8a8a93] mb-4">
                  We&rsquo;re happy to clarify anything in this policy. Reach
                  out and we&rsquo;ll get back to you within 1-2 business days.
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" />
                  {siteConfig.email}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-[#8a8a93] hover:text-[var(--accent)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to N2K Labs
                </Link>
                <div className="flex items-center gap-4 text-sm">
                  <Link
                    href="/privacy"
                    className={`transition-colors ${
                      title === "Privacy Policy"
                        ? "text-[var(--accent)]"
                        : "text-[#8a8a93] hover:text-[var(--accent)]"
                    }`}
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-white/20">/</span>
                  <Link
                    href="/terms"
                    className={`transition-colors ${
                      title === "Terms of Service"
                        ? "text-[var(--accent)]"
                        : "text-[#8a8a93] hover:text-[var(--accent)]"
                    }`}
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
