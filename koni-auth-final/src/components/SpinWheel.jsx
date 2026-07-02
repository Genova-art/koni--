import { useState, useRef } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import Konfeti from "./Konfeti";

const PRIZES = [
  { label: "Badge Spesial! 🏅", color: COLORS.gold,   msg: "Kamu mendapat Badge Spesial KONI! Cek koleksi badge kamu.", emoji: "🏅" },
  { label: "Fakta Unik 💡",     color: "#3B82F6",      msg: "Indonesia pernah menjadi tuan rumah Asian Games dua kali: 1962 dan 2018!", emoji: "💡" },
  { label: "Coba Lagi 🔄",      color: "#6B7280",      msg: "Belum beruntung! Coba putar lagi besok.", emoji: "🔄" },
  { label: "Cabor Spotlight ⭐", color: COLORS.merah,   msg: "Cabor Pilihan: Pencak Silat! Seni bela diri asli Indonesia yang sudah mendunia.", emoji: "⭐" },
  { label: "Fun Fact 🧠",       color: "#8B5CF6",      msg: "Bulutangkis Indonesia telah meraih 22 medali emas Olimpiade! Terbanyak untuk Indonesia.", emoji: "🧠" },
  { label: "Quote Atlet 💪",    color: "#059669",      msg: '"Latihan keras hari ini adalah kemenangan esok hari." — Atlet Indonesia', emoji: "💪" },
  { label: "Diskon Kuis 🎯",    color: "#F59E0B",      msg: "Bonus! Kamu mendapat 10 poin bonus di kuis berikutnya. Mainkan sekarang!", emoji: "🎯" },
  { label: "Emas Indonesia 🥇", color: COLORS.gold,    msg: "Indonesia meraih emas Olimpiade pertama di Barcelona 1992 lewat Susi Susanti!", emoji: "🥇" },
];

export default function SpinWheel() {
  const [spinning, setSpinning]   = useState(false);
  const [rotation, setRotation]   = useState(0);
  const [result, setResult]       = useState(null);
  const [konfeti, setKonfeti]     = useState(false);
  const [canSpin, setCanSpin]     = useState(() => {
    try {
      const last = localStorage.getItem("koni-last-spin");
      if (!last) return true;
      return Date.now() - parseInt(last) > 86400000; // 24h
    } catch { return true; }
  });
  const lastDeg = useRef(0);

  const spin = () => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);

    const extraSpins  = 5 + Math.floor(Math.random() * 5);
    const prizeIdx    = Math.floor(Math.random() * PRIZES.length);
    const sliceDeg    = 360 / PRIZES.length;
    const targetDeg   = 360 - (prizeIdx * sliceDeg + sliceDeg / 2);
    const totalDeg    = lastDeg.current + (extraSpins * 360) + targetDeg;

    lastDeg.current = totalDeg % 360;
    setRotation(totalDeg);

    setTimeout(() => {
      setSpinning(false);
      setResult(PRIZES[prizeIdx]);
      if (prizeIdx !== 2) setKonfeti(true);
      try { localStorage.setItem("koni-last-spin", Date.now().toString()); } catch {}
      setCanSpin(false);
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: `${PRIZES[prizeIdx].emoji} ${PRIZES[prizeIdx].label}`, type: "success" } }));
    }, 4200);
  };

  const sliceDeg = 360 / PRIZES.length;

  return (
    <section style={{ background: COLORS.gray, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.merah}, transparent)` }} />
      <Konfeti active={konfeti} onDone={() => setKonfeti(false)} />

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel label="Spin & Win" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Roda Keberuntungan
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.8 }}>
            Putar roda sekali sehari untuk mendapat hadiah, fakta unik, dan quote inspiratif! 🎡
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            {/* Pointer */}
            <div style={{ position: "relative", width: 280, height: 280 }}>
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                <div style={{ width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `28px solid ${COLORS.merah}`, filter: `drop-shadow(0 2px 8px ${COLORS.merah}80)` }} />
              </div>

              {/* Wheel SVG */}
              <svg
                width="280" height="280"
                viewBox="-1 -1 2 2"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? `transform 4.2s cubic-bezier(0.17,0.67,0.12,0.99)` : "none",
                  filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.2))",
                }}
              >
                {PRIZES.map((p, i) => {
                  const startAngle = (i * sliceDeg - 90) * (Math.PI / 180);
                  const endAngle   = ((i + 1) * sliceDeg - 90) * (Math.PI / 180);
                  const x1 = Math.cos(startAngle), y1 = Math.sin(startAngle);
                  const x2 = Math.cos(endAngle),   y2 = Math.sin(endAngle);
                  const midAngle = ((i + 0.5) * sliceDeg - 90) * (Math.PI / 180);
                  const tx = Math.cos(midAngle) * 0.65, ty = Math.sin(midAngle) * 0.65;
                  return (
                    <g key={i}>
                      <path d={`M 0 0 L ${x1} ${y1} A 1 1 0 0 1 ${x2} ${y2} Z`} fill={p.color} stroke="#fff" strokeWidth="0.02" />
                      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="0.1" fill="#fff" fontWeight="bold" transform={`rotate(${(i + 0.5) * sliceDeg}, ${tx}, ${ty})`}>
                        {p.emoji}
                      </text>
                    </g>
                  );
                })}
                <circle cx="0" cy="0" r="0.12" fill={COLORS.navy} stroke={COLORS.gold} strokeWidth="0.03" />
              </svg>
            </div>

            {/* Spin button */}
            <button
              onClick={spin}
              disabled={spinning || !canSpin}
              style={{
                padding: "16px 48px", borderRadius: 100,
                background: spinning || !canSpin ? "rgba(0,0,0,0.1)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                color: spinning || !canSpin ? COLORS.textMuted : "#fff",
                border: `2px solid ${spinning || !canSpin ? "rgba(0,0,0,0.1)" : COLORS.gold}`,
                fontSize: 15, fontWeight: 800, cursor: spinning || !canSpin ? "not-allowed" : "pointer",
                letterSpacing: "0.1em",
                boxShadow: spinning || !canSpin ? "none" : `0 8px 32px rgba(204,0,0,0.35)`,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!spinning && canSpin) e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              {spinning ? "🌀 Berputar..." : !canSpin ? "⏰ Kembali Besok" : "🎡 PUTAR!"}
            </button>

            {/* Result */}
            {result && (
              <div style={{
                background: `linear-gradient(135deg, ${result.color}15, ${result.color}08)`,
                border: `2px solid ${result.color}50`,
                borderRadius: 16, padding: "1.5rem 2rem",
                textAlign: "center", maxWidth: 420,
                animation: "slideUpModal 0.4s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: `0 12px 40px ${result.color}20`,
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{result.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "Georgia, serif" }}>{result.label}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{result.msg}</div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
