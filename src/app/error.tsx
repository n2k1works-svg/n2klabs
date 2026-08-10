"use client";

/**
 * Root error boundary — catches uncaught errors in any server or client
 * component below the root layout. Shows a branded error page instead of
 * Next.js's default gray stack-trace page.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08),transparent_60%)]" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-mono text-xs tracking-[0.4em] text-[var(--accent)] uppercase mb-4">
          Error / 500
        </div>
        <h1 className="font-sans font-black text-5xl md:text-6xl text-[#f0ece6] tracking-tight mb-6">
          Something broke.
        </h1>
        <p className="text-[#8a8a93] text-sm leading-relaxed mb-8">
          An unexpected error occurred. Our team has been notified.
          You can try again, or reach us directly at{" "}
          <a
            href="mailto:hello@n2klabs.com"
            className="text-[var(--accent)] underline underline-offset-4 hover:text-white transition-colors"
          >
            hello@n2klabs.com
          </a>
          .
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--accent)] text-[#0a0a0c] font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-[rgba(255,255,255,0.15)] text-[#f0ece6] font-semibold text-sm rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            Go home
          </a>
        </div>
        {error.digest && (
          <p className="mt-8 font-mono text-[10px] text-[#5a5a63]">
            Ref: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
