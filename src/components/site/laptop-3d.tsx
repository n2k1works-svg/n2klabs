"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Laptop3D — a hovering 3D laptop built with pure CSS 3D transforms.
 *
 * Two modes:
 *  - AUTO (default): laptop floats up/down and slowly oscillates on the Y axis.
 *  - MANUAL: spin animation pauses; laptop tilts toward the cursor and a
 *            cyberpunk HUD crosshair reticle follows the mouse.
 *
 * A floating toggle in the top-right of the stage switches modes.
 * Performance: high-frequency mousemove updates are written directly to the DOM
 * via refs (no React re-render per frame).
 */
export function Laptop3D({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [interactive, setInteractive] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  /** Default rotation used when entering manual mode or when cursor leaves. */
  const DEFAULT_ROT = "rotateX(14deg) rotateY(-20deg)";

  /** Map cursor position over the stage to laptop rotation; writes straight to DOM. */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const stage = stageRef.current;
      const spin = spinRef.current;
      const reticle = reticleRef.current;
      if (!stage || !spin || !reticle) return;

      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1

      // Cursor X → rotateY (-38°..+38°), Cursor Y → rotateX (-6°..+34°)
      const rotY = (px - 0.5) * 76;
      const rotX = 14 - (py - 0.5) * 36;

      spin.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      // Position reticle via CSS vars (no React re-render).
      reticle.style.setProperty("--rx", `${(px * 100).toFixed(2)}%`);
      reticle.style.setProperty("--ry", `${(py * 100).toFixed(2)}%`);
      reticle.style.opacity = "1";

      // Live readout text.
      const xSpan = reticle.querySelector<HTMLElement>('[data-readout="rotx"]');
      const ySpan = reticle.querySelector<HTMLElement>('[data-readout="roty"]');
      if (xSpan) xSpan.textContent = rotX.toFixed(1);
      if (ySpan) ySpan.textContent = rotY.toFixed(1);
    },
    [interactive]
  );

  /** Smoothly return to default tilt when the cursor leaves the stage. */
  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    const spin = spinRef.current;
    const reticle = reticleRef.current;
    if (spin) spin.style.transform = DEFAULT_ROT;
    if (reticle) reticle.style.opacity = "0";
  }, [interactive]);

  /** Apply / clear inline transform when mode changes. */
  useEffect(() => {
    if (interactive) {
      // Entering manual mode — set a sensible default tilt.
      if (spinRef.current) spinRef.current.style.transform = DEFAULT_ROT;
    } else {
      // Leaving manual mode — clear inline transform so CSS keyframe resumes.
      if (spinRef.current) spinRef.current.style.transform = "";
      if (reticleRef.current) reticleRef.current.style.opacity = "0";
    }
  }, [interactive]);

  return (
    <div
      ref={stageRef}
      className={`laptop-3d-stage ${interactive ? "is-interactive" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* === Mode toggle === */}
      <button
        type="button"
        className="laptop-3d-toggle"
        onClick={(e) => {
          // Stop propagation so we never accidentally trigger a parent click
          // handler (e.g. opening a case-study modal that wraps the laptop).
          e.stopPropagation();
          setInteractive((v) => !v);
        }}
        data-cursor="hover"
        aria-pressed={interactive}
        aria-label={
          interactive
            ? "Switch laptop to auto-rotate mode"
            : "Switch laptop to manual mouse-control mode"
        }
      >
        <span className="laptop-3d-toggle-dot" aria-hidden="true" />
        <span className="laptop-3d-toggle-label">
          {interactive ? "MANUAL" : "AUTO"}
        </span>
        <svg
          className="laptop-3d-toggle-icon"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* === HUD crosshair reticle (interactive mode only) === */}
      {interactive && (
        <div className="laptop-3d-reticle" ref={reticleRef} aria-hidden="true">
          {/* guide lines */}
          <div className="laptop-3d-reticle-h" />
          <div className="laptop-3d-reticle-v" />
          {/* targeting brackets + center dot */}
          <div className="laptop-3d-reticle-target">
            <span className="reticle-bracket reticle-tl" />
            <span className="reticle-bracket reticle-tr" />
            <span className="reticle-bracket reticle-bl" />
            <span className="reticle-bracket reticle-br" />
            <span className="reticle-dot" />
            <span className="laptop-3d-reticle-readout">
              ROT_X <span data-readout="rotx">--</span>°
              <br />
              ROT_Y <span data-readout="roty">--</span>°
            </span>
          </div>
        </div>
      )}

      {/* === Mode hint badge === */}
      <div className="laptop-3d-hint" aria-hidden="true">
        <span className="laptop-3d-hint-dot" />
        {interactive ? "MOVE CURSOR TO TILT" : "AUTO ROTATE"}
      </div>

      {/* === The 3D laptop === */}
      <div className="laptop-3d-float">
        <div ref={spinRef} className="laptop-3d-spin">
          <div
            className="laptop-3d"
            role="img"
            aria-label={`${alt} — website preview on a 3D laptop`}
          >
            {/* ===== LID (screen side) ===== */}
            <div className="laptop-screen-panel">
              <div className="laptop-lid-back" aria-hidden="true" />
              <div className="laptop-lid-top" aria-hidden="true" />
              <div className="laptop-lid-left" aria-hidden="true" />
              <div className="laptop-lid-right" aria-hidden="true" />

              <div className="laptop-bezel">
                <div className="laptop-camera-dot" aria-hidden="true" />
                <div className="laptop-screen">
                  {src ? (
                    <img src={src} alt={alt} loading="lazy" />
                  ) : (
                    <div className="laptop-no-preview">NO PREVIEW</div>
                  )}
                  <div className="laptop-glare" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* ===== BASE (keyboard deck) ===== */}
            <div className="laptop-base-panel">
              <div className="laptop-base">
                <div className="laptop-hinge" aria-hidden="true" />
                <div className="laptop-keys" aria-hidden="true">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className="laptop-trackpad" aria-hidden="true" />
              </div>
              <div className="laptop-base-front" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
