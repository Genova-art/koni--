import { useState } from "react";
import { COLORS, caborData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import CaborDetail from "./CaborDetail";

export default function Cabor() {
  const [active, setActive]     = useState(null);
  const [detail, setDetail]     = useState(null);

  return (
    <section id="cabor" style={{ background: COLORS.putih, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Cabang Olahraga" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Unggulan Nasional
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, maxWidth: 560, marginBottom: "3rem", lineHeight: 1.8 }}>
            KONI menaungi 67 cabang olahraga dengan ribuan atlet berdedikasi tinggi yang siap mengharumkan nama bangsa.
          </p>
        </FadeIn>

        <div className="cabor-grid">
          {caborData.map((cabor, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <div
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  background: active === i ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : COLORS.gray,
                  border: `1px solid ${active === i ? COLORS.gold : "rgba(0,0,0,0.06)"}`,
                  borderRadius: 12, padding: "1.75rem 1.5rem",
                  cursor: "pointer", transition: "all 0.3s",
                  transform: active === i ? "translateY(-2px)" : "none",
                  boxShadow: active === i ? `0 12px 32px rgba(10,22,40,0.2)` : "none",
                }}
                onMouseEnter={e => { if (active !== i) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { if (active !== i) e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>{cabor.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: active === i ? "#fff" : COLORS.navy, marginBottom: 6, fontFamily: "Georgia, serif" }}>
                  {cabor.nama}
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: active === i ? "1rem" : 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gold }}>{cabor.medali}</div>
                    <div style={{ fontSize: 9, color: active === i ? "rgba(255,255,255,0.4)" : COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Medali</div>
                  </div>
                  <div style={{ width: 1, background: active === i ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: active === i ? "#fff" : COLORS.navy }}>{cabor.atlet}</div>
                    <div style={{ fontSize: 9, color: active === i ? "rgba(255,255,255,0.4)" : COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Atlet</div>
                  </div>
                </div>

                {active === i && (
                  <button
                    onClick={e => { e.stopPropagation(); setDetail(cabor); }}
                    style={{
                      width: "100%", padding: "9px",
                      background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                      border: `1px solid ${COLORS.gold}40`,
                      borderRadius: 8, color: "#fff",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                      cursor: "pointer", textTransform: "uppercase",
                      boxShadow: "0 4px 16px rgba(204,0,0,0.3)",
                    }}
                  >
                    Lihat Detail →
                  </button>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {detail && <CaborDetail cabor={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}
