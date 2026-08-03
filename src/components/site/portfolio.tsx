"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, Target, Wrench, TrendingUp } from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { ProjectData } from "@/lib/data";

const FILTERS = ["All", "Web Development", "E-Commerce", "Web App", "Brand & Web"];

export function Portfolio({ projects }: { projects: ProjectData[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<ProjectData | null>(null);

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="relative py-24 md:py-36 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(0,136,204,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 03"
          kicker="Selected Work"
          title={
            <>
              Where craft
              <br />
              <span className="text-gradient-cyan">meets impact.</span>
            </>
          }
          description="Every great studio starts with one defining project. Here's ours — a collaboration with Elux Designs."
        />

        {/* filters — hidden when only 1 project */}
        {projects.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor="hover"
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  filter === f
                    ? "border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff] glow-cyan-sm"
                    : "border-white/10 bg-white/[0.02] text-[#8a8a93] hover:border-white/30 hover:text-[#f0ece6]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* grid — single project spans full width */}
        <div className={`mt-10 grid gap-4 md:gap-6 ${projects.length === 1 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {filtered.map((p, i) => (
            <motion.button
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
              onClick={() => setActive(p)}
              data-cursor="hover"
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121218] text-left transition-all duration-300 hover:border-[#00d4ff]/40 ${projects.length === 1 ? "md:col-span-2 lg:col-span-3" : ""}`}
            >
              {/* image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#121218] to-[#0a0a0c]">
                    <div className="text-center">
                      <div className="font-mono text-xs text-[#00d4ff]/40 mb-2">
                        {"NO PREVIEW"}
                      </div>
                      <div className="font-black text-3xl text-white/10">
                        {p.title}
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
                {/* featured badge */}
                {p.featured && (
                  <div className="absolute top-4 left-4 rounded-full border border-[#00d4ff]/30 bg-[#0a0a0c]/70 px-3 py-1 mono-label text-[#00d4ff] backdrop-blur-md">
                    Featured
                  </div>
                )}
                {/* category */}
                <div className="absolute top-4 right-4 rounded-full border border-white/10 bg-[#0a0a0c]/70 px-3 py-1 mono-label text-[#8a8a93] backdrop-blur-md">
                  {p.category}
                </div>
              </div>

              {/* content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mono-label text-[#8a8a93] mb-2">
                      {p.client}
                    </div>
                    <h3 className="text-2xl font-bold text-[#f0ece6] group-hover:text-[#00d4ff] transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#8a8a93] transition-all group-hover:border-[#00d4ff] group-hover:text-[#00d4ff]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#8a8a93] leading-relaxed line-clamp-2">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-[#8a8a93]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* case study modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-end md:items-center justify-center p-0 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-md"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[92svh] overflow-y-auto no-scrollbar rounded-t-3xl md:rounded-2xl border border-white/10 bg-[#0e0e12]"
            >
              {/* header image */}
              <div className="relative aspect-[16/8] overflow-hidden rounded-t-3xl md:rounded-t-2xl">
                {active.image ? (
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#121218] to-[#0a0a0c]">
                    <span className="font-black text-5xl text-white/10">
                      {active.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent" />
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0c]/70 text-[#f0ece6] backdrop-blur-md transition-colors hover:border-[#00d4ff] hover:text-[#00d4ff]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 px-3 py-1 mono-label text-[#00d4ff]">
                    {active.category}
                  </span>
                  <span className="mono-label text-[#8a8a93]">
                    {active.client}
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-[#f0ece6] mb-4">
                  {active.title}
                </h3>
                <p className="text-base md:text-lg text-[#b0aca6] leading-relaxed mb-8">
                  {active.description}
                </p>

                {/* challenge / solution / result */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Target, label: "Challenge", text: active.challenge },
                    { icon: Wrench, label: "Solution", text: active.solution },
                    { icon: TrendingUp, label: "Result", text: active.result },
                  ].map(({ icon: Icon, label, text }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-[#121218] p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-[#00d4ff]" />
                        <span className="mono-label text-[#8a8a93]">{label}</span>
                      </div>
                      <p className="text-sm text-[#b0aca6] leading-relaxed">
                        {text || "—"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* tags */}
                <div className="mb-8 flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-[#8a8a93]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="btn-shine group inline-flex items-center gap-2 rounded-full bg-[#f0ece6] px-6 py-3 text-sm font-semibold text-[#0a0a0c] transition-shadow hover:shadow-[0_0_30px_rgba(240,236,230,0.4)]"
                  >
                    Visit Live Site
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
