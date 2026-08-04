"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { StatData } from "@/lib/data";

/**
 * Counter — animates a number from 0 to `value` over 1.6s when scrolled into view.
 *
 * PERFORMANCE: writes the current value directly to the DOM via ref.textContent
 * instead of calling setState on every animation frame. The previous
 * implementation triggered ~60 React re-renders per second per counter, and
 * with 4 counters on the StatsBar that's 240 re-renders/sec landing exactly at
 * the Hero→StatsBar scroll boundary — a major cause of the "first to second
 * page" scroll choppiness.
 */
function Counter({ value, suffix }: { value: number; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver replaces useInView so we don't need the extra
    // hook + state cycle. Start counting only when the element is visible.
    let raf = 0;
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const dur = 1600;
            const tick = (t: number) => {
              const p = Math.min((t - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const n = Math.round(value * eased);
              el.textContent = `${n}${suffix || ""}`;
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.3 }
    );

    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="font-mono">
      0{suffix}
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
              <div className="mono-label text-[var(--accent)] mb-3">
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
