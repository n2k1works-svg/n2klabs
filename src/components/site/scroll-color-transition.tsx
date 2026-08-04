"use client";

/**
 * ScrollColorTransition — drives a site-wide accent colour transition as the
 * visitor scrolls down the page.
 *
 *   Heaven  (top / hero)         → angelic blue   #00d4ff
 *   Earth   (middle / portfolio)  → brownish gold  #c9a253
 *   Hell    (bottom / footer)     → deep red       #dc2626
 *
 * The black background stays; only the accent shifts. Interpolation is linear
 * RGB between 4 stops so the colour moves smoothly and continuously.
 *
 * Implementation: Framer Motion's useScroll gives a 0..1 progress value; we
 * subscribe via useMotionValueEvent and write the computed colour straight to
 * the :root CSS custom properties (--accent, --accent-rgb, --accent-deep,
 * --accent-deep-rgb). Every cyan reference on the site reads from those vars
 * (see globals.css), so the entire UI retints in lockstep with zero per-frame
 * React re-renders.
 *
 * SSR-safe: the CSS vars have blue defaults defined in :root, so before
 * hydration (and if JS is disabled) the site stays blue — the heaven state.
 */
import { useScroll, useMotionValueEvent } from "framer-motion";

type RGB = [number, number, number];

/** Scroll-progress colour stops (Heaven → Earth → Hell). */
const STOPS: { p: number; c: RGB }[] = [
  { p: 0.0, c: [0, 212, 255] }, // Heaven — angelic blue
  { p: 0.42, c: [201, 162, 83] }, // Earth — brownish golden
  { p: 0.78, c: [217, 90, 50] }, // Ember — fiery transition toward hell
  { p: 1.0, c: [220, 38, 38] }, // Hell — deep red
];

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

/** Interpolate the accent RGB triplet at a given scroll progress (0..1). */
function accentAt(p: number): RGB {
  p = clamp(p);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      return [lerp(a.c[0], b.c[0], t), lerp(a.c[1], b.c[1], t), lerp(a.c[2], b.c[2], t)];
    }
  }
  return STOPS[STOPS.length - 1].c;
}

/** A darker shade of the accent (≈60% luminance) used for gradient ends. */
function deepOf([r, g, b]: RGB): RGB {
  return [Math.round(r * 0.6), Math.round(g * 0.6), Math.round(b * 0.6)];
}

export function ScrollColorTransition() {
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const accent = accentAt(latest);
    const deep = deepOf(accent);
    const root = document.documentElement;
    root.style.setProperty("--accent", `rgb(${accent[0]}, ${accent[1]}, ${accent[2]})`);
    root.style.setProperty("--accent-rgb", `${accent[0]}, ${accent[1]}, ${accent[2]}`);
    root.style.setProperty("--accent-deep", `rgb(${deep[0]}, ${deep[1]}, ${deep[2]})`);
    root.style.setProperty("--accent-deep-rgb", `${deep[0]}, ${deep[1]}, ${deep[2]}`);
  });

  // Renders nothing — it's a pure side-effect driver.
  return null;
}
