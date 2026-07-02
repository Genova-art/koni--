import { useState } from "react";
import { COLORS, atletData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel, GlowCard } from "./UI";

export default function Atlet() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="atlet" style={{ background: COLORS.navy, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      {/* Background decorations */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `radial-gradient(ellipse 60% 40% at 80% 20%, rgba(184,150,12,0.06) 0%, transparent 60%),
                          radial-gradient(ellipse 40% 30% at 20% 80%, rgba(204,0,0,0.06) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Atlet Berprestasi" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            color: COLORS.putih,
            margin: "0 0 0.5rem",
          }}>
            Pahlawan Olahraga Nasional
          </h2>
          <GoldDivider />
          <p style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 15,
            maxWidth: 520,
            marginBottom: "3rem",
            lineHeight: 1.8,
          }}>
            Para atlet terbaik Indonesia yang telah mengharumkan nama bangsa di pentas olahraga internasional.
          </p>
        </FadeIn>

        <div className="atlet-grid">
          {atletData.map((atlet, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <GlowCard
                hoverGlow={`${atlet.warna}30`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => setSelected(atlet)}
                  style={{ padding: "1.75rem" }}
                >
                  {/* Header */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: "1.25rem",
                  }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${atlet.warna}33, ${atlet.warna}66)`,
                      border: `2px solid ${atlet.warna}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      flexShrink: 0,
                    }}>
                      {atlet.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: COLORS.putih,
                        lineHeight: 1.3,
                        marginBottom: 3,
                      }}>
                        {atlet.nama}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: COLORS.gold,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        {atlet.cabor}
                      </div>
                    </div>
                  </div>

                  {/* Prestasi */}
                  <div style={{
                    background: `${atlet.warna}15`,
                    border: `1px solid ${atlet.warna}30`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginBottom: "1rem",
                  }}>
                    <div style={{ fontSize: 12, color: COLORS.putih, fontWeight: 600, lineHeight: 1.4 }}>
                      🏆 {atlet.prestasi}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.gold }}>{atlet.medali}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Medali</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.putih }}>{atlet.ranking}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ranking</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{atlet.asal}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Asal</div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: "1rem",
                    fontSize: 11,
                    color: atlet.warna,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                    Lihat Profil →
                  </div>
                </div>
              </GlowCard>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,10,20,0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div style={{
            background: "linear-gradient(160deg, #0A1628, #132040)",
            border: `1px solid ${selected.warna}40`,
            borderRadius: 20,
            maxWidth: 520,
            width: "100%",
            overflow: "hidden",
            boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px ${selected.warna}20`,
            animation: "slideUpModal 0.3s ease",
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${selected.warna}22, ${selected.warna}44)`,
              borderBottom: `1px solid ${selected.warna}30`,
              padding: "2rem",
              display: "flex",
              gap: 20,
              alignItems: "center",
              position: "relative",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg, ${selected.warna}44, ${selected.warna}88)`,
                border: `3px solid ${selected.warna}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, flexShrink: 0,
                boxShadow: `0 0 30px ${selected.warna}44`,
              }}>
                {selected.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{selected.nama}</div>
                <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{selected.cabor}</div>
                <div style={{
                  display: "inline-block",
                  background: `${selected.warna}22`,
                  border: `1px solid ${selected.warna}40`,
                  borderRadius: 100,
                  padding: "3px 12px",
                  fontSize: 11,
                  color: "#fff",
                }}>
                  {selected.tahun}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, color: "#fff", cursor: "pointer",
                  width: 32, height: 32, fontSize: 16,
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.75rem" }}>
              <div style={{
                background: `${selected.warna}15`,
                border: `1px solid ${selected.warna}30`,
                borderRadius: 10, padding: "1rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Prestasi Terbesar</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>🏆 {selected.prestasi}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Total Medali", val: selected.medali },
                  { label: "Ranking", val: selected.ranking },
                  { label: "Asal Daerah", val: selected.asal },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "1rem",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.gold, marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
