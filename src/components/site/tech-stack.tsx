"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";

const STACK = [
  { name: "Next.js 16", cat: "Framework" },
  { name: "TypeScript", cat: "Language" },
  { name: "React", cat: "Library" },
  { name: "Tailwind CSS", cat: "Styling" },
  { name: "Prisma ORM", cat: "Database" },
  { name: "PostgreSQL", cat: "Database" },
  { name: "Framer Motion", cat: "Animation" },
  { name: "shadcn/ui", cat: "Components" },
  { name: "Vercel", cat: "Hosting" },
  { name: "Resend", cat: "Email" },
  { name: "NextAuth", cat: "Auth" },
  { name: "Zustand", cat: "State" },
];

const MARQUEE = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind",
  "Prisma",
  "PostgreSQL",
  "Vercel",
  "Framer Motion",
  "shadcn/ui",
  "Resend",
];

export function TechStack() {
  return (
    <section id="tech" className="relative py-24 md:py-36 bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />

      {/* marquee strip */}
      <div className="relative mb-20 border-y border-white/5 py-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-12">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="text-2xl md:text-4xl font-black tracking-tight text-white/[0.07]">
                {t}
              </span>
              <span className="text-[#00d4ff]/30 text-2xl">/</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 06"
          kicker="Our Toolkit"
          title={
            <>
              Modern stack,
              <br />
              <span className="text-gradient-cyan">zero compromises.</span>
            </>
          }
          description="We build on a foundation of best-in-class, type-safe, and battle-tested technologies."
        />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {STACK.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#121218] p-5 transition-colors hover:border-[#00d4ff]/40"
            >
              <div className="mono-label text-[#00d4ff] mb-2">{s.cat}</div>
              <div className="text-lg font-semibold text-[#f0ece6]">
                {s.name}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#00d4ff] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
