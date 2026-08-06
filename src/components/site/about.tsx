"use client";

import { motion } from "framer-motion";
import { Target, Eye, Zap } from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { SettingsMap } from "@/lib/data";

/**
 * About — the "story" section.
 *
 * Fully content-driven: every visible string is read from `settings`
 * (populated by /api/settings, seeded in prisma/seed.ts, and editable from
 * the admin Settings tab). Falls back to sensible defaults baked into
 * FALLBACK_SETTINGS (src/lib/data.ts) so the section renders even if the
 * database is unreachable.
 *
 * Settings keys consumed:
 *   about.kicker, about.heading.line1, about.heading.line2,
 *   about.heading.highlight, about.story1, about.story2,
 *   about.signature.name, about.signature.location,
 *   about.value{1,2,3}.title, about.value{1,2,3}.text
 *
 * The three "values" (Mission / Vision / Method) keep their lucide icons
 * mapped by position so admins only edit the copy, not the icon system.
 */
const VALUE_ICONS = [Target, Eye, Zap];

type ValueItem = {
  icon: (typeof VALUE_ICONS)[number];
  title: string;
  text: string;
};

export function About({ settings }: { settings: SettingsMap }) {
  const s = settings || {};
  const kicker = s["about.kicker"] || "About N2K Labs";
  const line1 = s["about.heading.line1"] || "We build the digital";
  const line2 = s["about.heading.line2"] || "infrastructure of";
  const highlight = s["about.heading.highlight"] || "ambitious brands.";
  const story1 =
    s["about.story1"] ||
    "N2K Labs was founded on a simple conviction: the South Pacific deserves digital experiences as refined as anything coming out of Sydney, Singapore, or San Francisco.";
  const story2 =
    s["about.story2"] ||
    "From our base in Fiji, we partner with businesses, startups, and entrepreneurs who refuse to settle. We blend strategy, design, and engineering into work that performs — fast, accessible, and unmistakably premium. Every project is an opportunity to raise the bar for what's possible in the region.";
  const sigName = s["about.signature.name"] || "The N2K Labs Team";
  const sigLocation = s["about.signature.location"] || "/ South Pacific, Fiji";

  const values: ValueItem[] = [1, 2, 3].map((i) => ({
    icon: VALUE_ICONS[i - 1],
    title: s[`about.value${i}.title`] || ["Mission", "Vision", "Method"][i - 1],
    text:
      s[`about.value${i}.text`] ||
      [
        "To give South Pacific businesses a digital presence that rivals the best in the world — no compromises.",
        "A region known not for its limitations, but for the world-class experiences built within it.",
        "Strategy first, design-led, engineered to last. Every pixel and every millisecond matters.",
      ][i - 1],
  }));

  return (
    <section id="about" className="cv-auto contain-paint relative overflow-hidden py-24 md:py-36 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(var(--accent-rgb),0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 01"
          kicker={kicker}
          title={
            <>
              {line1}
              <br />
              {line2}{" "}
              <span className="text-gradient-cyan">{highlight}</span>
            </>
          }
          description={s["site.tagline"] || "Digital Solutions That Elevate"}
        />

        {/* Story block */}
        <div className="mt-16 grid lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass rounded-2xl p-8 md:p-10"
          >
            <div className="mono-label text-[var(--accent)] mb-4">{"THE STORY"}</div>
            <p className="text-lg md:text-xl text-[#f0ece6] leading-relaxed mb-6">
              {story1}
            </p>
            <p className="text-base md:text-lg text-[#b0aca6] leading-relaxed">
              {story2}
            </p>

            {/* signature line */}
            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-deep)] flex items-center justify-center font-black text-[#0a0a0c]">
                N2K
              </div>
              <div>
                <div className="text-sm font-semibold text-[#f0ece6]">
                  {sigName}
                </div>
                <div className="mono-label text-[#8a8a93]">
                  {sigLocation}
                </div>
              </div>
            </div>
          </motion.div>

          {/* values */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#121218] p-6 transition-colors hover:border-[rgba(var(--accent-rgb),0.4)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)] transition-shadow group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mono-label text-[#8a8a93] mb-1">
                      {v.title}
                    </div>
                    <p className="text-sm md:text-base text-[#b0aca6] leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-[var(--accent)] to-transparent transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
