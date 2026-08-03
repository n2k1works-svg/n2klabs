"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { StatData } from "@/lib/data";

function Counter({ value, suffix }: { value: number; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {n}
      {suffix}
    </span>
  );
}

export function StatsBar({ stats }: { stats: StatData[] }) {
  return (
    <section className="relative border-y border-white/5 bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-10" />
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="px-4 md:px-8 py-10 md:py-14 text-center md:text-left"
            >
              <div className="mono-label text-[#00d4ff] mb-3">
                / 0{i + 1}
              </div>
              <div className="text-4xl md:text-6xl font-black tracking-tight text-[#f0ece6] text-glow-soft">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-[#8a8a93]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
