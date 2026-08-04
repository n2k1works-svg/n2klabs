"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";

/** Button that subtly follows the cursor on hover (magnetic effect). */
export function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  as = "button",
  href,
  onClick,
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  onClick?: (e: MouseEvent) => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setT({ x: x * strength, y: y * strength });
  };

  const reset = () => setT({ x: 0, y: 0 });

  const common = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: reset,
    className,
    "data-cursor": "hover",
    style: { transform: `translate(${t.x}px, ${t.y}px)` },
  };

  if (as === "a" && href) {
    return (
      <a href={href} onClick={onClick} aria-label={ariaLabel} {...common}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} {...common}>
      {children}
    </button>
  );
}
