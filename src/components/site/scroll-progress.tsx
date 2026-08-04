"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Top scroll progress bar in cyan. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-deep)] glow-cyan-sm"
      style={{ scaleX }}
    />
  );
}
