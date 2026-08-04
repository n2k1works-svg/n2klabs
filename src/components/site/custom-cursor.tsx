"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — a small dot + outer ring that follows the mouse.
 *
 * PERFORMANCE: All per-frame movement is written directly to the DOM via refs
 * (transform/translate3d). This avoids ~60 React re-renders per second that the
 * previous setState-per-rAF implementation caused, which competed with scroll
 * rendering and was a major source of scroll jank.
 *
 * React state is used only for *discrete* changes (enabled, hovering, down),
 * which change rarely and are cheap to re-render.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    let raf = 0;
    let mx = -100,
      my = -100;
    let rx = -100,
      ry = -100;
    let dirty = false;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Dot tracks instantly — write straight to the DOM.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
      // Mark the ring as needing an easing tick.
      dirty = true;

      const t = e.target as HTMLElement;
      const isHover = !!t.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']"
      );
      setHovering((prev) => (prev === isHover ? prev : isHover));
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    const loop = () => {
      // Only ease the ring when there's pending movement. When the mouse is
      // still, this is a no-op so we don't burn CPU competing with scroll.
      if (dirty) {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
        }
        // Stop easing once the ring is within 0.1px of the target — avoids
        // an infinite micro-easing loop after the mouse stops.
        if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) {
          dirty = false;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", downFn);
    window.addEventListener("mouseup", upFn);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", downFn);
      window.removeEventListener("mouseup", upFn);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor-none pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full transition-[width,height,background-color] duration-150"
        style={{
          width: down ? 14 : 8,
          height: down ? 14 : 8,
          backgroundColor: hovering ? "var(--accent)" : "#f0ece6",
          boxShadow: hovering
            ? "0 0 16px rgba(var(--accent-rgb),0.8)"
            : "0 0 8px rgba(240,236,230,0.4)",
        }}
      />
      {/* ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border transition-[width,height,border-color,opacity] duration-200"
        style={{
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          borderColor: hovering ? "rgba(var(--accent-rgb),0.7)" : "rgba(240,236,230,0.4)",
          borderWidth: 1,
          opacity: 0.9,
        }}
      />
    </div>
  );
}
