"use client";

import { motion } from "framer-motion";
import { ArrowUp, Twitter, Instagram, Globe, Github, ShieldCheck } from "lucide-react";
import type { SettingsMap } from "@/lib/data";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Footer({ settings }: { settings: SettingsMap }) {
  const email = settings["contact.email"] || "hello@n2klabs.com";
  const socials = [
    { icon: Twitter, href: settings["social.twitter"], label: "Twitter / X" },
    { icon: Instagram, href: settings["social.instagram"], label: "Instagram" },
    { icon: Globe, href: settings["social.website"], label: "Website" },
    { icon: Github, href: settings["social.github"], label: "GitHub" },
  ].filter((s) => s.href);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-auto border-t border-white/5 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[radial-gradient(ellipse,rgba(var(--accent-rgb),0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-black text-3xl tracking-tight text-[#f0ece6]">
                N2K
              </span>
              <span className="font-black text-3xl text-[var(--accent)]">.</span>
              <span className="font-black text-3xl tracking-tight text-[#f0ece6]">
                Labs
              </span>
            </div>
            <p className="max-w-sm text-sm text-[#8a8a93] leading-relaxed mb-6">
              {settings["site.description"] ||
                "A South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms."}
            </p>
            <a
              href={`mailto:${email}`}
              data-cursor="hover"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0ece6] hover:text-[var(--accent)] transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" />
              {email}
            </a>
          </div>

          {/* quick links */}
          <div className="lg:col-span-3">
            <div className="mono-label text-[var(--accent)] mb-4">{"NAVIGATE"}</div>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-cursor="hover"
                    className="text-sm text-[#8a8a93] transition-colors hover:text-[#f0ece6]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* socials + admin */}
          <div className="lg:col-span-4">
            <div className="mono-label text-[var(--accent)] mb-4">{"CONNECT"}</div>
            <div className="flex flex-wrap gap-3 mb-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor="hover"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#8a8a93] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <a
              href="/?view=admin"
              data-cursor="hover"
              className="inline-flex items-center gap-2 mono-label text-[#9aa0a8] transition-colors hover:text-[var(--accent)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Access
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="mono-label text-[#9aa0a8]">
            © {new Date().getFullYear()} N2K Labs — South Pacific, Fiji. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ y: -3 }}
              onClick={scrollTop}
              data-cursor="hover"
              aria-label="Back to top"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#8a8a93] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
