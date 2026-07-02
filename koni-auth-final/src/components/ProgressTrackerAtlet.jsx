import { COLORS, atletData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel, useScrollAnimation } from "./UI";

const MILESTONES = {
  "Kevin Sanjaya Sukamuljo": [
    { tahun: "2010", label: "Mulai bulutangkis", level: 5 },
    { tahun: "2013", label: "Masuk pelatnas junior", level: 20 },
    { tahun: "2016", label: "Debut internasional", level: 40 },
    { tahun: "2017", label: "Juara Dunia pertama", level: 65 },
    { tahun: "2019", label: "Ranking #1 Dunia", level: 85 },
    { tahun: "2023", label: "All England Champion", level: 95 },
    { tahun: "2026", label: "Legenda Bulutangkis", level: 100 },
  ],
  "Eko Yuli Irawan": [
    { tahun: "2004", label: "Mulai angkat besi", level: 8 },
    { tahun: "2007", label: "Debut SEA Games", level: 25 },
    { tahun: "2008", label: "Emas Olimpiade Beijing", level: 50 },
    { tahun: "2012", label: "Medali Olimpiade London", level: 65 },
    { tahun: "2018", label: "Emas Asian Games", level: 80 },
    { tahun: "2020", label: "Emas Olimpiade Tokyo", level: 92 },
    { tahun: "2026", label: "Icon Angkat Besi Asia", level: 100 },
  ],
};

function AtletProgressCard({ atlet }) {
  const [ref, visible] = useScrollAnimation();
  const milestones = MILESTONES[atlet.nama] || [];

  return (
    <div ref={ref} style={{
      background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
      border: `1px solid ${atlet.warna}30`,
      borderRadius: 16, padding: "1.75rem",
      transition: "all 0.3s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${atlet.warna}60`; e.currentTarget.style.boxShadow = `0 12px 40px ${atlet.warna}15`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${atlet.warna}30`; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${atlet.warna}44, ${atlet.warna}88)`,
          border: `2px solid ${atlet.warna}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, boxShadow: `0 0 20px ${atlet.warna}30`,
        }}>
          {atlet.icon}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>{atlet.nama}</div>
          <div style={{ fontSize: 10, color: atlet.warna, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{atlet.cabor}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.gold, fontFamily: "Georgia, serif" }}>{atlet.medali}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Medali</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Level Karir</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: atlet.warna }}>100%</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${atlet.warna}, ${COLORS.gold})`,
            width: visible ? "100%" : "0%",
            transition: "width 1.5s cubic-bezier(0.16,1,0.3,1) 0.2s",
            boxShadow: `0 0 10px ${atlet.warna}60`,
          }} />
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div style={{ position: "relative" }}>
          {/* Track line */}
          <div style={{
            position: "absolute", top: 8, left: 8, right: 8, height: 2,
            background: "rgba(255,255,255,0.06)", borderRadius: 99,
          }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: `linear-gradient(90deg, ${atlet.warna}, ${COLORS.gold})`,
              width: visible ? "100%" : "0%",
              transition: "width 1.8s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {milestones.map((m, i) => (
              <div
                key={i}
                title={`${m.tahun}: ${m.label}`}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: "help",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.4s ${0.3 + i * 0.1}s, transform 0.4s ${0.3 + i * 0.1}s`,
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: i === milestones.length - 1 ? COLORS.gold : `${atlet.warna}cc`,
                  border: `2px solid ${i === milestones.length - 1 ? COLORS.gold : atlet.warna}`,
                  boxShadow: i === milestones.length - 1 ? `0 0 12px ${COLORS.gold}` : `0 0 6px ${atlet.warna}60`,
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.5)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 6, textAlign: "center", width: 36, lineHeight: 1.3 }}>
                  {m.tahun}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "1rem", fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>
        {atlet.ranking} · {atlet.asal}
      </div>
    </div>
  );
}

export default function ProgressTrackerAtlet() {
  const featured = atletData.filter(a => MILESTONES[a.nama]);

  return (
    <section style={{ background: COLORS.putih, padding: "6rem 2rem", position: "relative" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Progress Karir" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Perjalanan Karir Atlet
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, maxWidth: 520, marginBottom: "2.5rem", lineHeight: 1.8 }}>
            Lihat tonggak pencapaian perjalanan para atlet terbaik Indonesia dari awal hingga puncak prestasi.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
          {featured.map((atlet, i) => (
            <FadeIn key={atlet.nama} delay={i * 0.15}>
              <AtletProgressCard atlet={atlet} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
