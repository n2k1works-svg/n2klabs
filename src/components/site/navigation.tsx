"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { LiveClock } from "./live-clock";
import { MagneticButton } from "./magnetic-button";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const startProject = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Ctrl+Shift+A → jump to the dedicated admin dashboard page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        window.location.href = "/?view=admin";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#0a0a0c]/70 backdrop-blur-xl border-b border-white/5"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Left group: hamburger + location/clock — grouped so justify-between pins them left, clearing the centered logo */}
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              data-cursor="hover"
              className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg px-2 py-2 group"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-6 bg-[#f0ece6] transition-all group-hover:bg-[var(--accent)]" />
                <span className="block h-px w-6 bg-[#f0ece6] transition-all group-hover:bg-[var(--accent)]" />
                <span className="block h-px w-4 bg-[#f0ece6] transition-all group-hover:bg-[var(--accent)] group-hover:w-6" />
              </span>
              <span className="mono-label text-[#8a8a93] hidden sm:inline">Menu</span>
            </button>

            {/* location + clock — only on large screens, stays in left group */}
            <div className="hidden xl:flex items-center gap-2 mono-label text-[#8a8a93]">
              <span className="text-[var(--accent)]">/</span>
              <span>South Pacific, FIJI</span>
              <span className="text-white/20">•</span>
              <LiveClock className="text-[#f0ece6]" />
            </div>
          </div>

          {/* Center: logo — absolutely centered, center column is empty so no collision */}
          <a
            href="#home"
            data-cursor="hover"
            className="absolute left-1/2 -translate-x-1/2 flex min-h-[44px] items-center gap-1 z-10"
          >
            <span className="font-black text-xl md:text-2xl tracking-tight text-[#f0ece6]">
              N2K
            </span>
            <span className="font-black text-xl md:text-2xl text-[var(--accent)]">.</span>
          </a>

          {/* Right: CTA */}
          <MagneticButton
            as="button"
            onClick={startProject}
            className="btn-shine group relative inline-flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2.5 text-sm font-semibold text-[#0a0a0c] transition-shadow hover:shadow-[0_0_24px_rgba(240,236,230,0.4)]"
          >
            <span>Start Project</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] bg-[#0a0a0c]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 grid-overlay opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb),0.12),transparent_60%)]" />

            <div className="relative h-full flex flex-col">
              {/* top bar */}
              <div className="flex items-center justify-between px-4 md:px-8 py-5">
                <span className="mono-label text-[#8a8a93]">
                  <span className="text-[var(--accent)]">/</span> Navigation
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  data-cursor="hover"
                  className="flex min-h-[44px] items-center gap-2 group"
                >
                  <span className="mono-label text-[#8a8a93] group-hover:text-[#f0ece6]">Close</span>
                  <X className="h-5 w-5 text-[#f0ece6] group-hover:text-[var(--accent)] transition-colors" />
                </button>
              </div>

              {/* links */}
              <nav className="flex-1 flex flex-col justify-center px-4 md:px-16">
                {NAV_LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    data-cursor="hover"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                    className="group flex items-baseline gap-6 border-b border-white/5 py-5 md:py-7"
                  >
                    <span className="font-mono text-xs text-[var(--accent)] w-8">
                      0{i + 1}
                    </span>
                    <span className="text-4xl md:text-7xl font-black tracking-tight text-[#f0ece6]/70 group-hover:text-[#f0ece6] group-hover:translate-x-3 transition-all duration-300">
                      {l.label}
                    </span>
                    <ArrowUpRight className="hidden md:block h-8 w-8 text-[var(--accent)] opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-300" />
                  </motion.a>
                ))}
              </nav>

              {/* bottom */}
              <div className="px-4 md:px-16 py-8 flex flex-wrap items-center justify-between gap-4">
                <div className="mono-label text-[#8a8a93]">
                  <span className="text-[var(--accent)]">/</span> hello@n2klabs.com
                </div>
                <div className="flex gap-2 mono-label text-[#8a8a93]">
                  <span className="text-[var(--accent)]">/</span> Pacific/Fiji
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
