import { useState } from "react";
import { COLORS, galeriData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

const KATEGORI = ["Semua", "SEA Games", "Kompetisi", "Training", "Prestasi", "Kejuaraan Dunia", "Atletik"];

export default function Galeri() {
  const [filter, setFilter] = useState("Semua");
  const [lightbox, setLightbox] = useState(null);

  const visible = filter === "Semua"
    ? galeriData
    : galeriData.filter(g => g.kategori === filter);

  return (
    <section style={{ background: COLORS.putih, padding: "6rem 2rem", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${COLORS.merah}, transparent)`,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Galeri Foto" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            color: COLORS.navy,
            margin: "0 0 0.5rem",
          }}>
            Momen Bersejarah
          </h2>
          <GoldDivider />
          <p style={{
            color: COLORS.textMuted,
            fontSize: 15,
            maxWidth: 520,
            marginBottom: "2rem",
            lineHeight: 1.8,
          }}>
            Abadikan setiap momen kejayaan atlet Indonesia di pentas nasional dan internasional.
          </p>

          {/* Filter chips */}
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}>
            {KATEGORI.map(k => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 100,
                  border: `1px solid ${filter === k ? COLORS.merah : "rgba(0,0,0,0.12)"}`,
                  background: filter === k ? COLORS.merah : "transparent",
                  color: filter === k ? "#fff" : COLORS.navy,
                  fontSize: 12,
                  fontWeight: filter === k ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.05em",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="galeri-grid">
          {visible.map((g, i) => (
            <FadeIn key={g.judul + i} delay={i * 0.07}>
              <div
                onClick={() => setLightbox(g)}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  aspectRatio: i % 3 === 0 ? "4/3" : "1/1",
                  background: g.bg,
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Emoji placeholder */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64,
                  opacity: 0.6,
                }}>
                  {g.emoji}
                </div>

                {/* Overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(5,10,20,0.92) 100%)",
                }} />

                {/* Content */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "1.25rem",
                }}>
                  <div style={{
                    display: "inline-block",
                    background: COLORS.merah,
                    borderRadius: 100,
                    padding: "2px 10px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}>
                    {g.kategori}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>
                    {g.judul}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                    📍 {g.lokasi}
                  </div>
                </div>

                {/* Expand icon */}
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  width: 32, height: 32,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff",
                }}>
                  ⤢
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(5,10,20,0.92)",
            backdropFilter: "blur(16px)",
            zIndex: 3000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: lightbox.bg,
              borderRadius: 20,
              maxWidth: 600,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              animation: "slideUpModal 0.3s ease",
            }}
          >
            {/* Image area */}
            <div style={{
              height: 280,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 96,
              position: "relative",
            }}>
              {lightbox.emoji}
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 8, color: "#fff", cursor: "pointer",
                  width: 36, height: 36, fontSize: 18,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "1.5rem 2rem 2rem", background: "rgba(0,0,0,0.4)" }}>
              <div style={{
                display: "inline-block",
                background: COLORS.merah,
                borderRadius: 100, padding: "3px 12px",
                fontSize: 10, fontWeight: 700, color: "#fff",
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: 10,
              }}>
                {lightbox.kategori}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: "Georgia, serif" }}>
                {lightbox.judul}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📍 {lightbox.lokasi}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
