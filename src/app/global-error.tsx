"use client";

/**
 * Global error boundary — catches errors that error.tsx CANNOT, including
 * errors thrown in the root layout itself. Must include its own <html> and
 * <body> tags because the root layout is not rendered when this fires.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0c",
          color: "#f0ece6",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.4em",
              color: "#00d4ff",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Fatal / Error
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              margin: "0 0 24px",
              letterSpacing: "-0.02em",
            }}
          >
            Application error.
          </h1>
          <p style={{ color: "#8a8a93", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            A critical error occurred and the page could not be rendered.
            Please refresh or contact us at{" "}
            <a href="mailto:hello@n2klabs.com" style={{ color: "#00d4ff" }}>
              hello@n2klabs.com
            </a>
            .
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              background: "#00d4ff",
              color: "#0a0a0c",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: 32,
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                color: "#5a5a63",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
