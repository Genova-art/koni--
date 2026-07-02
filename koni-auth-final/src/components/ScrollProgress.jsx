import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: 3, zIndex: 9999,
      background: "rgba(0,0,0,0.15)",
      pointerEvents: "none",
    }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold}, ${COLORS.merah})`,
        backgroundSize: "200% 100%",
        animation: pct > 0 ? "shimmerProgress 2s linear infinite" : "none",
        transition: "width 0.1s ease",
        boxShadow: pct > 0 ? `0 0 8px ${COLORS.gold}80, 0 0 2px ${COLORS.gold}` : "none",
      }} />
      <style>{`
        @keyframes shimmerProgress {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
