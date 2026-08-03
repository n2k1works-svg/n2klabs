"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Page intro loader with N2K monogram + scan line. */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#0a0a0c]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* grid */}
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12),transparent_60%)]" />

          <motion.div
            className="relative font-mono text-xs tracking-[0.4em] text-[#00d4ff] uppercase mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            N2K / Labs
          </motion.div>

          <motion.div
            className="relative font-sans font-black text-5xl md:text-7xl text-[#f0ece6] tracking-tight"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            N2K<span className="text-[#00d4ff]">.</span>
          </motion.div>

          <motion.div
            className="relative mt-8 h-px w-48 overflow-hidden bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            className="relative mt-6 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Initializing systems
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
