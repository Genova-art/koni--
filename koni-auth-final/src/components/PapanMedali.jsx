import { useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Trophy, Medal, TrendingUp, TrendingDown, Minus } from "lucide-react";

const EVENTS = ["PON XXI 2024", "SEA Games 2025", "Asian Games 2023", "Olimpiade 2024"];

const papanData = {
  "PON XXI 2024": [
    { rank: 1, provinsi: "DKI Jakarta", emas: 123, perak: 98, perunggu: 87, total: 308, trend: "up" },
    { rank: 2, provinsi: "Jawa Barat", emas: 98, perak: 87, perunggu: 76, total: 261, trend: "up" },
    { rank: 3, provinsi: "Jawa Timur", emas: 87, perak: 92, perunggu: 83, total: 262, trend: "same" },
    { rank: 4, provinsi: "Jawa Tengah", emas: 72, perak: 65, perunggu: 71, total: 208, trend: "down" },
    { rank: 5, provinsi: "Sulawesi Selatan", emas: 48, perak: 42, perunggu: 38, total: 128, trend: "up" },
    { rank: 6, provinsi: "Sumatera Utara", emas: 44, perak: 38, perunggu: 41, total: 123, trend: "up" },
    { rank: 7, provinsi: "Bali", emas: 38, perak: 42, perunggu: 35, total: 115, trend: "same" },
    { rank: 8, provinsi: "DI Yogyakarta", emas: 34, perak: 29, perunggu: 32, total: 95, trend: "up" },
    { rank: 9, provinsi: "Kalimantan Timur", emas: 28, perak: 31, perunggu: 27, total: 86, trend: "up" },
    { rank: 10, provinsi: "Sumatera Selatan", emas: 26, perak: 28, perunggu: 34, total: 88, trend: "down" },
  ],
  "SEA Games 2025": [
    { rank: 1, provinsi: "Indonesia 🇮🇩", emas: 94, perak: 88, perunggu: 109, total: 291, trend: "up" },
    { rank: 2, provinsi: "Vietnam 🇻🇳", emas: 78, perak: 82, perunggu: 93, total: 253, trend: "down" },
    { rank: 3, provinsi: "Thailand 🇹🇭", emas: 72, perak: 75, perunggu: 88, total: 235, trend: "same" },
    { rank: 4, provinsi: "Filipina 🇵🇭", emas: 58, perak: 61, perunggu: 74, total: 193, trend: "up" },
    { rank: 5, provinsi: "Malaysia 🇲🇾", emas: 52, perak: 57, perunggu: 68, total: 177, trend: "down" },
    { rank: 6, provinsi: "Singapura 🇸🇬", emas: 48, perak: 52, perunggu: 61, total: 161, trend: "up" },
    { rank: 7, provinsi: "Myanmar 🇲🇲", emas: 24, perak: 28, perunggu: 35, total: 87, trend: "same" },
    { rank: 8, provinsi: "Kamboja 🇰🇭", emas: 18, perak: 22, perunggu: 29, total: 69, trend: "up" },
    { rank: 9, provinsi: "Timor Leste 🇹🇱", emas: 4, perak: 6, perunggu: 9, total: 19, trend: "up" },
    { rank: 10, provinsi: "Brunei 🇧🇳", emas: 2, perak: 3, perunggu: 5, total: 10, trend: "same" },
  ],
  "Asian Games 2023": [
    { rank: 1, provinsi: "Tiongkok 🇨🇳", emas: 201, perak: 111, perunggu: 71, total: 383, trend: "same" },
    { rank: 2, provinsi: "Jepang 🇯🇵", emas: 52, perak: 67, perunggu: 69, total: 188, trend: "up" },
    { rank: 3, provinsi: "Korea Selatan 🇰🇷", emas: 42, perak: 59, perunggu: 89, total: 190, trend: "down" },
    { rank: 4, provinsi: "India 🇮🇳", emas: 28, perak: 38, perunggu: 41, total: 107, trend: "up" },
    { rank: 5, provinsi: "Uzbekistan 🇺🇿", emas: 22, perak: 18, perunggu: 31, total: 71, trend: "up" },
    { rank: 6, provinsi: "Thailand 🇹🇭", emas: 12, perak: 14, perunggu: 22, total: 48, trend: "same" },
    { rank: 7, provinsi: "Indonesia 🇮🇩", emas: 7, perak: 11, perunggu: 18, total: 36, trend: "up" },
    { rank: 8, provinsi: "Kazakhstan 🇰🇿", emas: 11, perak: 22, perunggu: 18, total: 51, trend: "down" },
    { rank: 9, provinsi: "Iran 🇮🇷", emas: 13, perak: 21, perunggu: 20, total: 54, trend: "down" },
    { rank: 10, provinsi: "Filipina 🇵🇭", emas: 6, perak: 10, perunggu: 11, total: 27, trend: "up" },
  ],
  "Olimpiade 2024": [
    { rank: 1, provinsi: "Amerika Serikat 🇺🇸", emas: 40, perak: 44, perunggu: 38, total: 122, trend: "up" },
    { rank: 2, provinsi: "Tiongkok 🇨🇳", emas: 40, perak: 27, perunggu: 24, total: 91, trend: "same" },
    { rank: 3, provinsi: "Inggris 🏴󠁧󠁢󠁥󠁮󠁧󠁿", emas: 20, perak: 12, perunggu: 13, total: 45, trend: "up" },
    { rank: 4, provinsi: "Australia 🇦🇺", emas: 18, perak: 19, perunggu: 16, total: 53, trend: "up" },
    { rank: 5, provinsi: "Jepang 🇯🇵", emas: 20, perak: 12, perunggu: 13, total: 45, trend: "down" },
    { rank: 6, provinsi: "Prancis 🇫🇷", emas: 16, perak: 26, perunggu: 22, total: 64, trend: "up" },
    { rank: 7, provinsi: "Korea Selatan 🇰🇷", emas: 13, perak: 9, perunggu: 10, total: 32, trend: "same" },
    { rank: 8, provinsi: "Belanda 🇳🇱", emas: 15, perak: 7, perunggu: 12, total: 34, trend: "up" },
    { rank: 9, provinsi: "Indonesia 🇮🇩", emas: 2, perak: 0, perunggu: 1, total: 3, trend: "up" },
    { rank: 10, provinsi: "Italia 🇮🇹", emas: 12, perak: 13, perunggu: 15, total: 40, trend: "down" },
  ],
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp size={12} color="#22C55E" />;
  if (trend === "down") return <TrendingDown size={12} color="#EF4444" />;
  return <Minus size={12} color="#6B7280" />;
};

const RankBadge = ({ rank }) => {
  const colors = { 1: { bg: COLORS.gold, text: "#000" }, 2: { bg: "#94a3b8", text: "#000" }, 3: { bg: "#CD7F32", text: "#fff" } };
  const c = colors[rank] || { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.6)" };
  return (
    <div style={{
      width: 30, height: 30, borderRadius: "50%",
      background: c.bg, color: c.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, flexShrink: 0,
      boxShadow: rank <= 3 ? `0 0 12px ${c.bg}80` : "none",
    }}>
      {rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : rank}
    </div>
  );
};

export default function PapanMedali() {
  const [activeEvent, setActiveEvent] = useState(EVENTS[0]);
  const [sortBy, setSortBy] = useState("emas");
  const rows = [...(papanData[activeEvent] || [])].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <section style={{ background: `linear-gradient(160deg, ${COLORS.navy}, ${COLORS.navyMid})`, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "-5%", top: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,150,12,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Papan Medali" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Klasemen Perolehan Medali
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 500, marginBottom: "2rem", lineHeight: 1.8 }}>
            Pantau posisi Indonesia di berbagai ajang olahraga internasional dan nasional.
          </p>

          {/* Event tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
            {EVENTS.map(e => (
              <button key={e} onClick={() => setActiveEvent(e)} style={{
                padding: "8px 18px", borderRadius: 100, border: `1px solid ${activeEvent === e ? COLORS.gold : "rgba(255,255,255,0.15)"}`,
                background: activeEvent === e ? `${COLORS.gold}20` : "transparent",
                color: activeEvent === e ? COLORS.gold : "rgba(255,255,255,0.5)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>{e}</button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(184,150,12,0.15)`, borderRadius: 16, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 90px 90px 90px 90px 50px", gap: 0, background: "rgba(255,255,255,0.04)", borderBottom: `1px solid rgba(255,255,255,0.08)`, padding: "0 1.5rem" }}>
              {[
                { label: "#", key: null },
                { label: "Nama", key: null },
                { label: "🥇 Emas", key: "emas" },
                { label: "🥈 Perak", key: "perak" },
                { label: "🥉 Perunggu", key: "perunggu" },
                { label: "Total", key: "total" },
                { label: "Tren", key: null },
              ].map((col, i) => (
                <div key={i} onClick={() => col.key && setSortBy(col.key)} style={{
                  padding: "14px 6px", fontSize: 10, fontWeight: 700,
                  color: sortBy === col.key ? COLORS.gold : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: col.key ? "pointer" : "default",
                  textAlign: i > 1 ? "center" : "left",
                  borderBottom: sortBy === col.key ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}>
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, i) => {
              const isIndo = row.provinsi.includes("Indonesia");
              return (
                <div key={row.provinsi} style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 90px 90px 90px 90px 50px",
                  gap: 0,
                  padding: "0 1.5rem",
                  background: isIndo ? `linear-gradient(90deg, rgba(204,0,0,0.12), transparent)` : i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  borderLeft: isIndo ? `3px solid ${COLORS.merah}` : "3px solid transparent",
                  transition: "background 0.2s",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                  onMouseEnter={e => { if (!isIndo) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { if (!isIndo) e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", padding: "14px 6px" }}>
                    <RankBadge rank={row.rank} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", padding: "14px 6px", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: isIndo ? 700 : 500, color: isIndo ? "#fff" : "rgba(255,255,255,0.75)" }}>
                      {row.provinsi}
                    </span>
                    {isIndo && <span style={{ fontSize: 9, background: COLORS.merah, borderRadius: 100, padding: "2px 6px", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>KITA</span>}
                  </div>
                  {[row.emas, row.perak, row.perunggu, row.total].map((val, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 6px" }}>
                      <span style={{
                        fontSize: j === 3 ? 13 : 13, fontWeight: j === 3 ? 700 : 500,
                        color: j === 0 ? COLORS.gold : j === 1 ? "#94a3b8" : j === 2 ? "#CD7F32" : "#fff",
                      }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 6px" }}>
                    <TrendIcon trend={row.trend} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
            Klik header kolom untuk mengurutkan · 🇮🇩 = Indonesia
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
