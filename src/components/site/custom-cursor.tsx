"use client";

import { useEffect, useState } from "react";

/**
 * Custom cursor — a small dot + outer ring that follows the mouse.
 * Ring scales up & changes color on hover over interactive elements.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

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

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setPos({ x: mx, y: my });
      const t = e.target as HTMLElement;
      setHovering(
        !!t.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor='hover']"
        )
      );
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      setRingPos({ x: rx, y: ry });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move);
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
        className="fixed top-0 left-0 rounded-full transition-[width,height,background-color] duration-150"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
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
        className="fixed top-0 left-0 rounded-full border transition-[width,height,border-color,opacity] duration-200"
        style={{
          transform: `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`,
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
