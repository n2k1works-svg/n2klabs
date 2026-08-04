"use client";

import { motion } from "framer-motion";

export function SectionHeading({
  index,
  kicker,
  title,
  description,
  align = "left",
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <span className="font-mono text-xs text-[var(--accent)]">{index}</span>
        <span className="h-px w-8 bg-[rgba(var(--accent-rgb),0.6)]" />
        <span className="mono-label text-[#8a8a93]">{kicker}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#f0ece6] leading-[0.95]"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className={`text-base md:text-lg text-[#8a8a93] leading-relaxed ${
            align === "center" ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
