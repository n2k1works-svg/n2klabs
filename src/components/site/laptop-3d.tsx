"use client";

/**
 * Laptop3D — a hovering, slowly rotating 3D laptop built with pure CSS 3D transforms.
 * The screenshot renders inside the laptop screen; the whole device floats up/down
 * and oscillates on the Y axis so visitors can see the screen at angles.
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
  return (
    <div className={`laptop-3d-stage ${className}`}>
      <div className="laptop-3d-float">
        <div className="laptop-3d-spin">
          <div className="laptop-3d" role="img" aria-label={`${alt} — website preview on a 3D laptop`}>
            {/* ===== LID (screen side) ===== */}
            <div className="laptop-screen-panel">
              {/* back of the lid (visible when rotated past 90°) */}
              <div className="laptop-lid-back" aria-hidden="true" />
              {/* edge thickness strips */}
              <div className="laptop-lid-top" aria-hidden="true" />
              <div className="laptop-lid-left" aria-hidden="true" />
              <div className="laptop-lid-right" aria-hidden="true" />

              {/* bezel + screen (front face) */}
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
              {/* front edge of the base (visible at the front-bottom) */}
              <div className="laptop-base-front" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
