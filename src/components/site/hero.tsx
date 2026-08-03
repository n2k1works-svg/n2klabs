"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight, Star, Twitter, Instagram, Globe } from "lucide-react";
import { MagneticButton } from "./magnetic-button";

const HERO_TITLE = "N2K Labs".split("");

/** Floating glassmorphic HUD panel with corner marks + faux data UI. */
function HudPanel({
  className = "",
  title,
  children,
  delay = 0,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className={`hud-corners glass-strong absolute rounded-xl p-4 animate-float ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mono-label text-[#00d4ff] mb-3">{title}</div>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#0a0a0c]"
    >
      {/* Z-1: 3D background */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: bgY, scale: bgScale }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-bg.png)" }}
        />
        {/* darken */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/40 via-[#0a0a0c]/30 to-[#0a0a0c]" />
        {/* volumetric light from top-center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,212,255,0.28),transparent_70%)]" />
        {/* cyan edge glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_60%_at_10%_60%,rgba(0,212,255,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_60%_at_90%_70%,rgba(0,136,204,0.10),transparent_70%)]" />
      </motion.div>

      {/* Z-2: perspective grid overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-60">
        <div className="absolute inset-0 grid-perspective" />
      </div>
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

      {/* Z-3: floating HUD panels */}
      {/* Panel 1 — top right: project metrics */}
      <HudPanel
        title="// SYS.STATUS"
        className="hidden md:block top-[18%] right-[6%] w-60"
        delay={0.6}
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#8a8a93]">UPTIME</span>
            <span className="font-mono text-[#f0ece6]">99.98%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[99%] bg-[#00d4ff] glow-cyan-sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#8a8a93]">PROJECTS</span>
            <span className="font-mono text-[#f0ece6]">87</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] bg-[#00d4ff]" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#8a8a93]">PERF</span>
            <span className="font-mono text-[#00d4ff]">A+</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[95%] bg-[#00d4ff] glow-cyan-sm" />
          </div>
        </div>
        <div className="mt-3 scan-line w-full animate-pulse-glow" />
      </HudPanel>

      {/* Panel 2 — mid left: blueprint/coords */}
      <HudPanel
        title="// BLUEPRINT"
        className="hidden lg:block bottom-[26%] left-[4%] w-56 animate-float-slow"
        delay={0.9}
      >
        <BlueprintContent />
      </HudPanel>

      {/* Panel 3 — right lower: build stack */}
      <HudPanel
        title="// STACK"
        className="hidden lg:block bottom-[20%] right-[5%] w-48 animate-float"
        delay={1.1}
      >
        <div className="space-y-1.5 font-mono text-[11px]">
          {[
            ["Next.js 16", "ACTIVE"],
            ["TypeScript", "ACTIVE"],
            ["Prisma", "ACTIVE"],
            ["Tailwind", "ACTIVE"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[#8a8a93]">{k}</span>
              <span className="flex items-center gap-1 text-[#00d4ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff] animate-blink" />
                {v}
              </span>
            </div>
          ))}
        </div>
      </HudPanel>

      {/* Z-4: hero typography */}
      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col justify-center px-4 md:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          {/* tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff] animate-blink" />
            <span className="mono-label text-[#8a8a93]">
              Digital Solutions Studio — Est. 2016
            </span>
          </motion.div>

          {/* Massive title */}
          <h1 className="font-black tracking-tighter leading-[0.85] text-[#f0ece6] text-[18vw] md:text-[16vw] lg:text-[14vw] xl:text-[180px]">
            <span className="block">
              {HERO_TITLE.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={mounted ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.06,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                  style={{ transformOrigin: "bottom" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-end gap-6 md:gap-12"
          >
            <p className="max-w-md text-base md:text-lg text-[#b0aca6] leading-relaxed">
              An award-grade digital studio in the South Pacific crafting
              world-class web experiences, brands, and commerce platforms.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton
                as="a"
                href="#portfolio"
                className="btn-shine group inline-flex items-center gap-2 rounded-full bg-[#f0ece6] px-6 py-3 text-sm font-semibold text-[#0a0a0c] transition-shadow hover:shadow-[0_0_30px_rgba(240,236,230,0.4)]"
              >
                View Our Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[#f0ece6] backdrop-blur-md transition-colors hover:border-[#00d4ff] hover:text-[#00d4ff]"
              >
                Get a Quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Z-5: UI chrome — socials bottom-left */}
      <div className="absolute bottom-6 left-4 md:left-8 z-20 flex items-center gap-2">
        {[
          { icon: Twitter, href: "https://twitter.com/n2klabs", label: "Twitter / X" },
          { icon: Instagram, href: "https://instagram.com/n2klabs", label: "Instagram" },
          { icon: Globe, href: "https://n2klabs.com", label: "Website" },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-cursor="hover"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#8a8a93] backdrop-blur-md transition-all hover:border-[#00d4ff]/60 hover:text-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      {/* Z-6: Our Story button bottom-left-center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-[calc(50%-80px)] z-20 hidden sm:block">
        <a
          href="#about"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-sm font-medium text-[#f0ece6] backdrop-blur-md transition-colors hover:border-[#f0ece6]"
        >
          Our Story
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Z-7: For Winners badge bottom-right */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="absolute bottom-6 right-4 md:right-8 z-20"
      >
        <div className="rounded-2xl relative border border-white/10 bg-[#0a0a0c]/80 p-4 backdrop-blur-xl w-56 hud-corners">
          <div className="mono-label text-[#8a8a93] mb-2">For Winners</div>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[#00d4ff] text-[#00d4ff]"
              />
            ))}
          </div>
          <div className="font-mono text-xs text-[#f0ece6] leading-relaxed">
            Trusted by 64+ brands across the South Pacific & beyond.
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === 0 ? "w-6 bg-[#00d4ff]" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-1">
          <span className="mono-label text-[#5a5a63]">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[#00d4ff]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function BlueprintContent() {
  return (
    <>
      <svg viewBox="0 0 200 120" className="w-full h-24 text-[#00d4ff]/70">
        <g fill="none" stroke="currentColor" strokeWidth="0.5">
          <rect x="10" y="10" width="180" height="100" />
          <line x1="10" y1="50" x2="190" y2="50" />
          <line x1="100" y1="10" x2="100" y2="110" />
          <circle cx="100" cy="50" r="20" />
          <circle cx="100" cy="50" r="34" strokeDasharray="2 3" />
          <line x1="10" y1="10" x2="50" y2="50" />
          <line x1="190" y1="10" x2="150" y2="50" />
          <line x1="10" y1="110" x2="50" y2="70" />
          <line x1="190" y1="110" x2="150" y2="70" />
        </g>
        <g fill="#00d4ff">
          <circle cx="100" cy="50" r="1.5" />
          <circle cx="10" cy="10" r="1" />
          <circle cx="190" cy="10" r="1" />
          <circle cx="10" cy="110" r="1" />
          <circle cx="190" cy="110" r="1" />
        </g>
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-[#8a8a93]">
        <span>LAT 18.1°S</span>
        <span>LNG 178.4°E</span>
      </div>
    </>
  );
}
