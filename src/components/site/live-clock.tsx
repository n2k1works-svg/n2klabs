"use client";

import { useEffect, useState } from "react";

/** Live clock in the nav, formatted for Fiji timezone. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Pacific/Fiji",
          }).format(new Date()) + " FJT"
        );
      } catch {
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        );
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className}>
      {time || "--:--:--"}
    </span>
  );
}
