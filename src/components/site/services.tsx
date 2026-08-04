"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  PenTool,
  ShoppingBag,
  Compass,
  Sparkles,
  LineChart,
  Plus,
  Check,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { ServiceData } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  Code2,
  PenTool,
  ShoppingBag,
  Compass,
  Sparkles,
  LineChart,
};

export function Services({ services }: { services: ServiceData[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" className="cv-auto contain-paint relative overflow-hidden py-24 md:py-36 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 02"
          kicker="What We Do"
          title={
            <>
              Capabilities engineered
              <br />
              for <span className="text-gradient-cyan">elevation.</span>
            </>
          }
          description="Six disciplines, one obsessive standard. We deliver the full stack of capabilities modern brands need to win online."
        />

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] || Code2;
            const isOpen = open === s.id;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121218] p-7 transition-all duration-300 hover:border-[rgba(var(--accent-rgb),0.4)] hover:bg-[#14141a]"
              >
                {/* number */}
                <div className="absolute top-6 right-6 font-mono text-xs text-[#3a3a40]">
                  0{i + 1}
                </div>

                {/* icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(var(--accent-rgb),0.2)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)] transition-all duration-300 group-hover:border-[rgba(var(--accent-rgb),0.5)] group-hover:shadow-[0_0_28px_rgba(var(--accent-rgb),0.35)]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-2xl font-bold text-[#f0ece6] mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-[#8a8a93] leading-relaxed mb-5">
                  {s.description}
                </p>

                {/* features */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-2 mb-4"
                    >
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-[#b0aca6]"
                        >
                          <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                          {f}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {/* expand toggle */}
                <button
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  data-cursor="hover"
                  className="mt-2 inline-flex items-center gap-2 mono-label text-[#8a8a93] transition-colors hover:text-[var(--accent)]"
                >
                  {isOpen ? "Less" : "Details"}
                  <Plus
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {/* hover glow line */}
                <div className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
