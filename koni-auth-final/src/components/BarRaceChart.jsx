import { useState, useEffect, useRef } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Play, Pause, RotateCcw } from "lucide-react";

const COUNTRIES = [
  { name: "Indonesia 🇮🇩", color: COLORS.merah, highlight: true },
  { name: "Vietnam 🇻🇳",   color: "#EF4444" },
  { name: "Thailand 🇹🇭",  color: "#3B82F6" },
  { name: "Filipina 🇵🇭",  color: "#F59E0B" },
  { name: "Malaysia 🇲🇾",  color: "#10B981" },
  { name: "Singapura 🇸🇬", color: "#8B5CF6" },
  { name: "Myanmar 🇲🇲",   color: "#EC4899" },
];

const SEA_GAMES_DATA = {
  2011: [182, 96, 109, 73, 62, 42, 16],
  2013: [65,  94, 107, 78, 80, 57, 14],
  2015: [47,  73, 95,  64, 60, 44, 12],
  2017: [38,  58, 72,  59, 57, 39, 10],
  2019: [72,  98, 92,  68, 56, 52, 13],
  2021: [69,  98, 92,  52, 67, 47, 12],
  2023: [87,  73, 108, 56, 59, 44, 15],
  2025: [94,  78, 72,  58, 52, 48, 24],
};

const YEARS = Object.keys(SEA_GAMES_DATA).map(Number);

export default function BarRaceChart() {
  const [yearIdx, setYearIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYearIdx(i => {
          if (i >= YEARS.length - 1) { setPlaying(false); return i; }
          return i + 1;
        });
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const year = YEARS[yearIdx];
  const vals = SEA_GAMES_DATA[year];
  const maxVal = Math.max(...vals);
  const sorted = COUNTRIES.map((c, i) => ({ ...c, val: vals[i] })).sort((a, b) => b.val - a.val);

  return (
    <section style={{ background: `linear-gradient(160deg, ${COLORS.navy}, ${COLORS.navyMid})`, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Indonesia vs Dunia" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Bar Race Chart SEA Games
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 500, marginBottom: "2rem", lineHeight: 1.8 }}>
            Animasi perbandingan perolehan medali negara-negara SEA Games dari tahun ke tahun.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
            <button onClick={() => setPlaying(p => !p)} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: playing ? `${COLORS.merah}20` : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              border: `1px solid ${playing ? COLORS.merah : "transparent"}`,
              borderRadius: 8, padding: "9px 18px",
              color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              boxShadow: playing ? "none" : "0 4px 16px rgba(204,0,0,0.3)",
            }}>
              {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play Animasi</>}
            </button>
            <button onClick={() => { setYearIdx(0); setPlaying(false); }} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "9px 14px",
              color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer",
            }}>
              <RotateCcw size={13} /> Reset
            </button>

            {/* Year scrubber */}
            <div style={{ flex: 1, display: "flex", gap: 4 }}>
              {YEARS.map((y, i) => (
                <button key={y} onClick={() => { setYearIdx(i); setPlaying(false); }} style={{
                  flex: 1, padding: "6px 2px", borderRadius: 6,
                  background: yearIdx === i ? `${COLORS.gold}25` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${yearIdx === i ? COLORS.gold : "rgba(255,255,255,0.08)"}`,
                  color: yearIdx === i ? COLORS.gold : "rgba(255,255,255,0.35)",
                  fontSize: 10, fontWeight: yearIdx === i ? 700 : 400,
                  cursor: "pointer", transition: "all 0.2s",
                }}>{y}</button>
              ))}
            </div>
          </div>

          {/* Year display */}
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <span style={{
              fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 700,
              color: "rgba(255,255,255,0.08)", letterSpacing: "-0.02em",
              transition: "color 0.3s",
            }}>
              {year}
            </span>
          </div>

          {/* Bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sorted.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 110, fontSize: 12, fontWeight: c.highlight ? 700 : 500, color: c.highlight ? "#fff" : "rgba(255,255,255,0.65)", textAlign: "right", flexShrink: 0 }}>
                  {c.name}
                </div>
                <div style={{ flex: 1, position: "relative", height: 32 }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${(c.val / maxVal) * 100}%`,
                    background: c.highlight
                      ? `linear-gradient(90deg, ${c.color}, ${COLORS.gold})`
                      : c.color,
                    transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: c.highlight ? `0 0 16px ${c.color}50` : "none",
                    display: "flex", alignItems: "center", justifyContent: "flex-end",
                    paddingRight: 8, minWidth: 40,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.highlight ? "#000" : "#fff" }}>
                      {c.val}
                    </span>
                  </div>
                </div>
                {i === 0 && <span style={{ fontSize: 14, flexShrink: 0 }}>👑</span>}
                {c.highlight && i > 0 && <span style={{ fontSize: 11, color: COLORS.gold, flexShrink: 0, fontWeight: 700 }}>#{i + 1}</span>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Data perolehan medali emas SEA Games · Sumber: KONI Pusat
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
