/**
 * Root loading UI — shown while server components fetch data (e.g., the
 * homepage awaits getProjects/getServices/etc. from Turso on cold starts).
 * Replaces the blank white screen with a branded minimal loader.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#0a0a0c]">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.1),transparent_60%)]" />

      <div className="relative font-mono text-xs tracking-[0.4em] text-[var(--accent)] uppercase mb-6 animate-pulse">
        N2K / Labs
      </div>

      <div className="relative font-sans font-black text-5xl text-[#f0ece6] tracking-tight">
        N2K<span className="text-[var(--accent)]">.</span>
      </div>

      <div className="relative mt-8 h-px w-48 overflow-hidden bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          style={{
            animation: "n2k-shimmer 1.1s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes n2k-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
