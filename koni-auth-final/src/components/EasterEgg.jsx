import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import Konfeti from "./Konfeti";

const TARGET = "KONI";

export default function EasterEgg() {
  const [typed, setTyped]       = useState("");
  const [triggered, setTriggered] = useState(false);
  const [konfeti, setKonfeti]   = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (triggered) return;
      const key = e.key.toUpperCase();
      if (!"KONI".includes(key)) { setTyped(""); return; }
      const next = (typed + key);
      setTyped(next.length > TARGET.length ? key : next);
      if ((typed + key).endsWith(TARGET)) {
        setTriggered(true);
        setKonfeti(true);
        setVisible(true);
        setTimeout(() => setVisible(false), 5000);
        setTimeout(() => setTriggered(false), 8000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typed, triggered]);

  return (
    <>
      <Konfeti active={konfeti} onDone={() => setKonfeti(false)} />

      {visible && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9990,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
          animation: "fadeInOverlay 0.4s ease",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 24, padding: "3rem 4rem",
            textAlign: "center",
            boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 60px ${COLORS.gold}30`,
            animation: "slideUpModal 0.4s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "all",
          }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "floatAnim 2s ease-in-out infinite" }}>🏆</div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 28, fontWeight: 700,
              color: "#fff", marginBottom: 8,
            }}>
              Selamat! Kamu menemukan
            </div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 40, fontWeight: 700,
              background: `linear-gradient(90deg, ${COLORS.gold}, #F59E0B, ${COLORS.gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
              animation: "shimmerProgress 2s linear infinite",
              marginBottom: "1.5rem",
            }}>
              Easter Egg KONI! 🇮🇩
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 340, margin: "0 auto 1.5rem" }}>
              Kamu mengetik <strong style={{ color: COLORS.gold }}>K-O-N-I</strong> di keyboard!<br />
              Terima kasih telah mendukung olahraga Indonesia. 💪
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `${COLORS.merah}20`,
              border: `1px solid ${COLORS.merah}40`,
              borderRadius: 100, padding: "8px 20px",
              fontSize: 12, color: COLORS.gold,
              fontWeight: 600, letterSpacing: "0.1em",
            }}>
              🎖️ Merah Putih Berprestasi Bermartabat
            </div>
          </div>
        </div>
      )}
    </>
  );
}
