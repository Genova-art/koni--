import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";

const MATCHES = [
  { home: "🇮🇩 Indonesia", away: "🇻🇳 Vietnam", cabor: "Bulutangkis", event: "SEA Games 2026", homeScore: 2, awayScore: 1, set: "Set 3", status: "live" },
  { home: "🇮🇩 Indonesia", away: "🇲🇾 Malaysia", cabor: "Sepak Bola", event: "AFF Cup 2026", homeScore: 1, awayScore: 0, menit: 67, status: "live" },
  { home: "🇮🇩 Indonesia", away: "🇹🇭 Thailand", cabor: "Voli Putra", event: "SEA Games 2026", homeScore: 0, awayScore: 0, set: "Belum mulai", status: "upcoming" },
  { home: "Jawa Barat", away: "DKI Jakarta", cabor: "Pencak Silat", event: "PON XXI", homeScore: 3, awayScore: 2, status: "finished" },
];

function PulseDot() {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10 }}>
      <span style={{
        position: "absolute", width: 10, height: 10, borderRadius: "50%",
        background: "#22C55E", opacity: 0.4,
        animation: "livePulse 1.5s ease-out infinite",
      }} />
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", position: "relative" }} />
      <style>{`@keyframes livePulse { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.5);opacity:0} }`}</style>
    </span>
  );
}

export default function LiveScore() {
  const [scores, setScores] = useState(MATCHES);
  const [visible, setVisible] = useState(true);

  // Simulate live score updates
  useEffect(() => {
    const t = setInterval(() => {
      setScores(prev => prev.map(m => {
        if (m.status !== "live") return m;
        const rand = Math.random();
        if (rand < 0.15 && m.cabor === "Sepak Bola") {
          const scorer = Math.random() > 0.6 ? "home" : "away";
          return scorer === "home"
            ? { ...m, homeScore: m.homeScore + 1, menit: Math.min((m.menit || 60) + Math.floor(Math.random() * 5 + 1), 90) }
            : { ...m, awayScore: m.awayScore + 1, menit: Math.min((m.menit || 60) + Math.floor(Math.random() * 5 + 1), 90) };
        }
        if (rand < 0.1 && m.cabor === "Bulutangkis") {
          return { ...m, homeScore: m.homeScore + (Math.random() > 0.5 ? 1 : 0) };
        }
        return m;
      }));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  const liveMatches = scores.filter(m => m.status === "live");

  return (
    <div style={{
      position: "fixed", bottom: 210, right: 32, zIndex: 995,
      width: 300,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #064E3B, #065F46)`,
        border: `1px solid rgba(34,197,94,0.3)`,
        borderRadius: "12px 12px 0 0",
        padding: "8px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PulseDot />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.12em" }}>LIVE SCORE</span>
          <span style={{ background: "#22C55E", borderRadius: 100, padding: "1px 7px", fontSize: 9, color: "#000", fontWeight: 800 }}>
            {liveMatches.length} LIVE
          </span>
        </div>
        <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
      </div>

      {/* Matches */}
      <div style={{
        background: "linear-gradient(160deg, #0A1628, #132040)",
        border: `1px solid rgba(34,197,94,0.15)`,
        borderTop: "none",
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
      }}>
        {scores.map((m, i) => (
          <div key={i} style={{
            padding: "10px 14px",
            borderBottom: i < scores.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            background: m.status === "live" ? "rgba(34,197,94,0.05)" : "transparent",
            borderLeft: m.status === "live" ? "3px solid #22C55E" : m.status === "finished" ? "3px solid rgba(255,255,255,0.1)" : "3px solid transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: m.status === "live" ? "#4ADE80" : m.status === "finished" ? "rgba(255,255,255,0.3)" : COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {m.status === "live" ? "● LIVE" : m.status === "finished" ? "SELESAI" : "SEGERA"} · {m.cabor}
              </span>
              {m.menit && m.status === "live" && (
                <span style={{ fontSize: 9, color: "#4ADE80", fontWeight: 700 }}>{m.menit}'</span>
              )}
              {m.set && m.status === "live" && (
                <span style={{ fontSize: 9, color: "#4ADE80" }}>{m.set}</span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "left" }}>{m.home}</span>
              <span style={{
                fontSize: 15, fontWeight: 800, color: m.status === "live" ? "#fff" : "rgba(255,255,255,0.5)",
                fontFamily: "Georgia, serif",
                background: m.status === "live" ? "rgba(255,255,255,0.08)" : "transparent",
                padding: "2px 8px", borderRadius: 4, minWidth: 40, textAlign: "center",
              }}>
                {m.homeScore} – {m.awayScore}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "right" }}>{m.away}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
