import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Trophy, Medal, Star, Crown } from "lucide-react";

const BADGE_CONFIG = [
  { min: 130, label: "Juara Dunia", icon: "🏆", color: COLORS.gold },
  { min: 100, label: "Atlet Nasional", icon: "🥇", color: "#22C55E" },
  { min: 70,  label: "Atlet Daerah",  icon: "🥈", color: "#60A5FA" },
  { min: 0,   label: "Pemula",        icon: "🎽", color: "rgba(255,255,255,0.4)" },
];

function getBadge(skor) {
  return BADGE_CONFIG.find(b => skor >= b.min) || BADGE_CONFIG[BADGE_CONFIG.length - 1];
}

function getRankIcon(rank) {
  if (rank === 1) return <Crown size={16} color={COLORS.gold} />;
  if (rank === 2) return <Medal size={16} color="#94a3b8" />;
  if (rank === 3) return <Medal size={16} color="#CD7F32" />;
  return <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>{rank}</span>;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [myEntry, setMyEntry] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("koni-leaderboard") || "[]");
      const sorted = [...saved]
        .sort((a, b) => b.skor - a.skor)
        .slice(0, 10)
        .map((e, i) => ({ ...e, rank: i + 1 }));
      setEntries(sorted);
      if (saved.length > 0) setMyEntry(sorted.find(e => e.isMe));
    } catch { setEntries([]); }
  }, []);

  return (
    <section style={{
      background: `linear-gradient(160deg, #060D1A, ${COLORS.navy})`,
      padding: "6rem 2rem", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,150,12,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel label="Papan Peringkat" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Leaderboard Kuis
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8 }}>
            Top pemain kuis olahraga Indonesia. Mainkan kuis untuk masuk papan peringkat!
          </p>
        </FadeIn>

        {/* Top 3 podium */}
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
            {[entries[1], entries[0], entries[2]].filter(Boolean).map((e, i) => {
              const isFirst = i === 1;
              const podiumH = isFirst ? 90 : 65;
              const colors = ["#94a3b8", COLORS.gold, "#CD7F32"];
              const realColors = isFirst ? COLORS.gold : i === 0 ? "#94a3b8" : "#CD7F32";
              return (
                <div key={e.nama} style={{ textAlign: "center", flex: 1, maxWidth: 180 }}>
                  <div style={{ fontSize: isFirst ? 36 : 28, marginBottom: 6 }}>
                    {isFirst ? "👑" : i === 0 ? "🥈" : "🥉"}
                  </div>
                  <div style={{ fontSize: isFirst ? 14 : 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{e.nama.split(" ")[0]}</div>
                  <div style={{ fontSize: isFirst ? 20 : 16, fontWeight: 700, color: realColors, fontFamily: "Georgia, serif", marginBottom: 8 }}>{e.skor}</div>
                  <div style={{
                    height: podiumH, borderRadius: "8px 8px 0 0",
                    background: `linear-gradient(180deg, ${realColors}44, ${realColors}22)`,
                    border: `1px solid ${realColors}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isFirst ? 22 : 18,
                  }}>
                    {isFirst ? "1" : i === 0 ? "2" : "3"}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Full list */}
        <FadeIn delay={0.1}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden" }}>
            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Belum ada skor</div>
                Mainkan Kuis Olahraga untuk muncul di leaderboard!
              </div>
            ) : entries.map((e, i) => {
              const badge = getBadge(e.skor);
              const isTop3 = e.rank <= 3;
              return (
                <div key={e.nama} style={{
                  display: "grid", gridTemplateColumns: "44px 1fr auto",
                  gap: 0, padding: "13px 20px",
                  borderBottom: i < entries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: e.isMe ? `rgba(184,150,12,0.08)` : isTop3 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderLeft: e.isMe ? `3px solid ${COLORS.gold}` : "3px solid transparent",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={el => el.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={el => el.currentTarget.style.background = e.isMe ? "rgba(184,150,12,0.08)" : "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {getRankIcon(e.rank)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${badge.color}33, ${badge.color}66)`,
                      border: `1.5px solid ${badge.color}60`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {badge.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: e.isMe ? 700 : 500, color: "#fff" }}>
                        {e.nama} {e.isMe && <span style={{ fontSize: 9, background: COLORS.gold, color: "#000", borderRadius: 100, padding: "1px 6px", fontWeight: 700, marginLeft: 4 }}>KAMU</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                        {badge.label} · {e.benar}/8 benar · {e.waktu}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: badge.color, fontFamily: "Georgia, serif" }}>{e.skor}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
                      🔥 {e.streak} streak
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            Skor kamu tersimpan otomatis setelah selesai kuis
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
