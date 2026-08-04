"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket, LifeBuoy } from "lucide-react";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    icon: Search,
    no: "01",
    title: "Discovery",
    text: "We dig into your goals, audience, and competitive landscape to define what success actually looks like.",
  },
  {
    icon: PenTool,
    no: "02",
    title: "Design",
    text: "Strategy becomes structure — wireframes, design systems, and prototypes that align everyone before a line of code.",
  },
  {
    icon: Code2,
    no: "03",
    title: "Development",
    text: "We engineer with modern, battle-tested infrastructure — fast, accessible, and built to scale.",
  },
  {
    icon: Rocket,
    no: "04",
    title: "Launch",
    text: "QA, performance audits, SEO, and a clean deploy. We ship with confidence and documentation.",
  },
  {
    icon: LifeBuoy,
    no: "05",
    title: "Support",
    text: "Post-launch monitoring, iteration, and growth — we stay in your corner long after go-live.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-24 md:py-36 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 04"
          kicker="How We Work"
          title={
            <>
              A process built for
              <br />
              <span className="text-gradient-cyan">momentum & clarity.</span>
            </>
          }
          description="Five disciplined stages that turn ambition into a shipped, measurable result."
        />

        <div className="mt-16 relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-[42px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.3)] to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="group relative"
              >
                {/* node */}
                <div className="relative mb-6 flex items-center lg:justify-start">
                  <div className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full border border-white/10 bg-[#0e0e12] transition-all duration-300 group-hover:border-[rgba(var(--accent-rgb),0.5)] group-hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]">
                    <s.icon className="h-7 w-7 text-[var(--accent)]" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-[10px] font-bold text-[#0a0a0c]">
                      {s.no}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#f0ece6] mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[#8a8a93] leading-relaxed">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
