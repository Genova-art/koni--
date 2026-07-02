import { useState } from "react";
import { COLORS, timelineData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section style={{ background: COLORS.gray, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "4rem" }}>
          <SectionLabel label="Perjalanan Sejarah" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            color: COLORS.navy,
            margin: "0 0 0.5rem",
          }}>
            80 Tahun Mengabdi untuk Bangsa
          </h2>
          <GoldDivider />
          <p style={{
            color: COLORS.textMuted,
            fontSize: 15,
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Jejak panjang KONI dalam membangun olahraga Indonesia menuju kejayaan nasional dan internasional.
          </p>
        </FadeIn>

        {/* Desktop timeline */}
        <div className="timeline-desktop" style={{ position: "relative" }}>
          <div className="timeline-center-line" style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            background: `linear-gradient(180deg, ${COLORS.gold}40, ${COLORS.gold}, ${COLORS.gold}40)`,
            transform: "translateX(-50%)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {timelineData.map((item, i) => {
              const isLeft = i % 2 === 0;
              const isActive = activeIdx === i;
              return (
                <FadeIn key={i} delay={i * 0.1} direction={isLeft ? "left" : "right"}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 1fr",
                    alignItems: "center",
                  }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 32 }}>
                      {isLeft && (
                        <TimelineCard item={item} isActive={isActive} onClick={() => setActiveIdx(isActive ? null : i)} />
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                      <div
                        onClick={() => setActiveIdx(isActive ? null : i)}
                        style={{
                          width: isActive ? 52 : 44,
                          height: isActive ? 52 : 44,
                          borderRadius: "50%",
                          background: isActive
                            ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`
                            : `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
                          border: `3px solid ${isActive ? COLORS.merah : COLORS.gold}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: isActive ? 22 : 18,
                          cursor: "pointer",
                          transition: "all 0.3s",
                          boxShadow: isActive ? "0 0 24px rgba(204,0,0,0.5)" : "0 0 16px rgba(184,150,12,0.3)",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <div style={{ paddingLeft: 32 }}>
                      {!isLeft && (
                        <TimelineCard item={item} isActive={isActive} onClick={() => setActiveIdx(isActive ? null : i)} />
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="timeline-mobile" style={{ display: "none", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
          <div style={{
            position: "absolute", left: 20, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(180deg, ${COLORS.gold}40, ${COLORS.gold}, ${COLORS.gold}40)`,
          }} />
          {timelineData.map((item, i) => {
            const isActive = activeIdx === i;
            return (
              <FadeIn key={i} delay={i * 0.07}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
                    border: `2px solid ${isActive ? COLORS.merah : COLORS.gold}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, cursor: "pointer", zIndex: 2, position: "relative",
                    boxShadow: isActive ? "0 0 20px rgba(204,0,0,0.4)" : "0 0 10px rgba(184,150,12,0.2)",
                    transition: "all 0.25s",
                  }}
                    onClick={() => setActiveIdx(isActive ? null : i)}
                  >
                    {item.icon}
                  </div>
                  <TimelineCard item={item} isActive={isActive} onClick={() => setActiveIdx(isActive ? null : i)} mobile />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item, isActive, onClick, mobile = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : COLORS.putih,
        border: `1px solid ${isActive ? COLORS.gold : "rgba(0,0,0,0.06)"}`,
        borderRadius: 12,
        padding: mobile ? "1rem 1.25rem" : "1.25rem 1.5rem",
        cursor: "pointer",
        transition: "all 0.3s",
        maxWidth: mobile ? "100%" : 400,
        flex: mobile ? 1 : undefined,
        boxShadow: isActive ? "0 12px 40px rgba(10,22,40,0.25)" : "0 2px 12px rgba(0,0,0,0.04)",
        transform: isActive ? "scale(1.02)" : "none",
      }}
    >
      <div style={{
        display: "inline-block",
        background: `rgba(184,150,12,0.12)`,
        border: `1px solid rgba(184,150,12,0.3)`,
        borderRadius: 100,
        padding: "3px 14px",
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.gold,
        letterSpacing: "0.1em",
        marginBottom: 8,
      }}>
        {item.tahun}
      </div>
      <div style={{
        fontSize: mobile ? 14 : 15,
        fontWeight: 700,
        color: isActive ? COLORS.putih : COLORS.navy,
        marginBottom: 6,
        fontFamily: "Georgia, serif",
      }}>
        {item.judul}
      </div>
      {isActive ? (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
          {item.desc}
        </div>
      ) : (
        <div style={{ fontSize: 11, color: COLORS.merah, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Klik untuk detail
        </div>
      )}
    </div>
  );
}
