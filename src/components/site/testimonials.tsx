"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { TestimonialData } from "@/lib/data";

export function Testimonials({ testimonials }: { testimonials: TestimonialData[] }) {
  const [idx, setIdx] = useState(0);
  const count = testimonials.length;
  if (count === 0) return null;

  const go = (d: number) => setIdx((p) => (p + d + count) % count);
  const active = testimonials[idx];

  return (
    <section id="testimonials" className="relative py-24 md:py-36 bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* left heading */}
          <div className="lg:col-span-4">
            <SectionHeading
              index="/ 05"
              kicker="Client Voices"
              title={
                <>
                  Trusted by
                  <br />
                  <span className="text-gradient-cyan">the ambitious.</span>
                </>
              }
            />
            <p className="mt-6 text-sm text-[#8a8a93] leading-relaxed">
              Don&apos;t take our word for it — here&apos;s what the people we
              build for have to say.
            </p>
          </div>

          {/* right card */}
          <div className="lg:col-span-8">
            <div className="relative glass rounded-2xl p-8 md:p-12 min-h-[340px]">
              <Quote className="absolute top-6 right-6 h-16 w-16 text-white/[0.04]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#00d4ff] text-[#00d4ff]"
                      />
                    ))}
                  </div>

                  <p className="text-xl md:text-3xl font-medium text-[#f0ece6] leading-relaxed mb-8">
                    &ldquo;{active.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 font-bold text-[#00d4ff]">
                      {active.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[#f0ece6]">
                        {active.name}
                      </div>
                      <div className="mono-label text-[#8a8a93]">
                        {active.role}
                        {active.company ? ` · ${active.company}` : ""}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* controls */}
            <div className="mt-6 flex items-center justify-between">
              {/* dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    data-cursor="hover"
                    className={`h-1.5 rounded-full transition-all ${
                      i === idx
                        ? "w-8 bg-[#00d4ff]"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  data-cursor="hover"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#f0ece6] transition-colors hover:border-[#00d4ff] hover:text-[#00d4ff]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  data-cursor="hover"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#f0ece6] transition-colors hover:border-[#00d4ff] hover:text-[#00d4ff]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
