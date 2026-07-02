import { useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import Konfeti from "./Konfeti";

const EVENTS_3D = [
  {
    event: "SEA Games 2025",
    podium: [
      { negara: "Indonesia 🇮🇩", medali: 94, warna: COLORS.gold },
      { negara: "Vietnam 🇻🇳",   medali: 78, warna: "#94a3b8" },
      { negara: "Thailand 🇹🇭",  medali: 72, warna: "#CD7F32" },
    ],
  },
  {
    event: "Asian Games 2023",
    podium: [
      { negara: "Tiongkok 🇨🇳",   medali: 201, warna: COLORS.gold },
      { negara: "Jepang 🇯🇵",     medali: 52,  warna: "#94a3b8" },
      { negara: "Korea 🇰🇷",      medali: 42,  warna: "#CD7F32" },
    ],
  },
  {
    event: "Olimpiade 2024",
    podium: [
      { negara: "Amerika 🇺🇸",  medali: 40, warna: COLORS.gold },
      { negara: "Tiongkok 🇨🇳", medali: 40, warna: "#94a3b8" },
      { negara: "Inggris 🏴󠁧󠁢󠁥󠁮󠁧󠁿",   medali: 20, warna: "#CD7F32" },
    ],
  },
];

const RANK_CONFIG = [
  { rank: 2, height: 120, offset: 0,  label: "🥈", glow: "#94a3b8" },
  { rank: 1, height: 160, offset: -20, label: "🥇", glow: COLORS.gold },
  { rank: 3, height: 90,  offset: 0,  label: "🥉", glow: "#CD7F32" },
];

export default function MedalPodium3D() {
  const [activeEvent, setActiveEvent] = useState(0);
  const [hovered, setHovered]         = useState(null);
  const [konfeti, setKonfeti]          = useState(false);
  const ev = EVENTS_3D[activeEvent];

  // Order: 2nd, 1st, 3rd
  const orderedPodium = [ev.podium[1], ev.podium[0], ev.podium[2]];

  return (
    <section style={{ background: COLORS.gray, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
      <Konfeti active={konfeti} onDone={() => setKonfeti(false)} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel label="Podium Medali" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Podium 3D Kejuaraan
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.8, maxWidth: 460, margin: "0 auto 1.5rem" }}>
            Visualisasi podium medali 3D dari berbagai ajang olahraga internasional.
          </p>

          {/* Event tabs */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {EVENTS_3D.map((e, i) => (
              <button key={i} onClick={() => setActiveEvent(i)} style={{
                padding: "8px 18px", borderRadius: 100,
                border: `1px solid ${activeEvent === i ? COLORS.merah : "rgba(0,0,0,0.12)"}`,
                background: activeEvent === i ? COLORS.merah : "transparent",
                color: activeEvent === i ? "#fff" : COLORS.navy,
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>{e.event}</button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2rem", perspective: "800px" }}>
            {RANK_CONFIG.map((cfg, i) => {
              const athlete = orderedPodium[i];
              const isHov = hovered === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { if (cfg.rank === 1) { setKonfeti(true); window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: `🏆 ${athlete.negara} — ${athlete.medali} medali emas!`, type: "success" } })); } }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    cursor: cfg.rank === 1 ? "pointer" : "default",
                    transform: `translateY(${cfg.offset}px) ${isHov ? "scale(1.05) translateY(-8px)" : ""}`,
                    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {/* Athlete info */}
                  <div style={{ textAlign: "center", marginBottom: 12, opacity: isHov ? 1 : 0.85, transition: "opacity 0.2s" }}>
                    <div style={{ fontSize: cfg.rank === 1 ? 40 : 32, marginBottom: 4 }}>{cfg.label}</div>
                    <div style={{ fontSize: cfg.rank === 1 ? 14 : 12, fontWeight: 700, color: COLORS.navy, marginBottom: 2 }}>
                      {athlete.negara}
                    </div>
                    <div style={{
                      fontSize: cfg.rank === 1 ? 22 : 18, fontWeight: 700,
                      color: athlete.warna, fontFamily: "Georgia, serif",
                    }}>
                      {athlete.medali}
                    </div>
                    <div style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>medali</div>
                  </div>

                  {/* 3D Podium block */}
                  <div style={{ position: "relative" }}>
                    {/* Top face */}
                    <div style={{
                      width: cfg.rank === 1 ? 120 : 100,
                      height: cfg.rank === 1 ? 24 : 20,
                      background: `linear-gradient(135deg, ${athlete.warna}, ${athlete.warna}cc)`,
                      borderRadius: "6px 6px 0 0",
                      boxShadow: isHov ? `0 0 30px ${athlete.warna}60` : `0 0 15px ${athlete.warna}30`,
                      transition: "box-shadow 0.3s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800,
                      color: cfg.rank === 1 ? "#000" : "#fff",
                      letterSpacing: "0.12em",
                    }}>
                      #{cfg.rank}
                    </div>

                    {/* Front face */}
                    <div style={{
                      width: cfg.rank === 1 ? 120 : 100,
                      height: cfg.height,
                      background: `linear-gradient(180deg, ${athlete.warna}ee, ${athlete.warna}88)`,
                      borderRadius: "0 0 4px 4px",
                      position: "relative", overflow: "hidden",
                    }}>
                      {/* Shine effect */}
                      <div style={{
                        position: "absolute", top: 0, left: "-30%", width: "40%", height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                        transform: isHov ? "translateX(400%)" : "translateX(0)",
                        transition: "transform 0.6s ease",
                      }} />
                      {/* Rank number */}
                      <div style={{
                        position: "absolute", bottom: 16, left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: cfg.rank === 1 ? 48 : 36, fontWeight: 700,
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "Georgia, serif", lineHeight: 1,
                        userSelect: "none",
                      }}>
                        {cfg.rank}
                      </div>
                    </div>

                    {/* Side face (3D illusion) */}
                    <div style={{
                      position: "absolute", right: -12, top: 0,
                      width: 12, height: cfg.height + (cfg.rank === 1 ? 24 : 20),
                      background: `linear-gradient(90deg, ${athlete.warna}66, ${athlete.warna}33)`,
                      transform: "skewY(-45deg)",
                      transformOrigin: "left top",
                      borderRadius: "0 4px 0 0",
                    }} />
                    {/* Bottom side face */}
                    <div style={{
                      position: "absolute", bottom: -8, left: 0,
                      width: cfg.rank === 1 ? 120 : 100, height: 8,
                      background: `linear-gradient(180deg, ${athlete.warna}44, transparent)`,
                      transform: "skewX(-45deg)",
                      transformOrigin: "left top",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Base platform */}
          <div style={{
            width: "80%", maxWidth: 500, margin: "0 auto",
            height: 16,
            background: `linear-gradient(90deg, ${COLORS.navy}88, ${COLORS.navyLight}, ${COLORS.navy}88)`,
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }} />

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: COLORS.textMuted }}>
            {ev.event} · Klik podium emas untuk kejutan! 🎉
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
