import { useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { MapPin, Trophy, Users, Award } from "lucide-react";

const provinsiData = {
  "Aceh": { ibukota: "Banda Aceh", atlet: 312, medali: 28, cabor: 24, ketua: "KONI Aceh" },
  "Sumatera Utara": { ibukota: "Medan", atlet: 845, medali: 67, cabor: 38, ketua: "KONI Sumut" },
  "Sumatera Barat": { ibukota: "Padang", atlet: 423, medali: 41, cabor: 29, ketua: "KONI Sumbar" },
  "Riau": { ibukota: "Pekanbaru", atlet: 388, medali: 35, cabor: 27, ketua: "KONI Riau" },
  "Kepulauan Riau": { ibukota: "Tanjung Pinang", atlet: 198, medali: 18, cabor: 19, ketua: "KONI Kepri" },
  "Jambi": { ibukota: "Jambi", atlet: 267, medali: 22, cabor: 21, ketua: "KONI Jambi" },
  "Bengkulu": { ibukota: "Bengkulu", atlet: 189, medali: 15, cabor: 17, ketua: "KONI Bengkulu" },
  "Sumatera Selatan": { ibukota: "Palembang", atlet: 612, medali: 54, cabor: 33, ketua: "KONI Sumsel" },
  "Bangka Belitung": { ibukota: "Pangkal Pinang", atlet: 156, medali: 12, cabor: 15, ketua: "KONI Babel" },
  "Lampung": { ibukota: "Bandar Lampung", atlet: 498, medali: 43, cabor: 30, ketua: "KONI Lampung" },
  "Banten": { ibukota: "Serang", atlet: 534, medali: 48, cabor: 32, ketua: "KONI Banten" },
  "DKI Jakarta": { ibukota: "Jakarta", atlet: 1842, medali: 187, cabor: 62, ketua: "KONI DKI" },
  "Jawa Barat": { ibukota: "Bandung", atlet: 1654, medali: 156, cabor: 58, ketua: "KONI Jabar" },
  "Jawa Tengah": { ibukota: "Semarang", atlet: 1423, medali: 134, cabor: 55, ketua: "KONI Jateng" },
  "DI Yogyakarta": { ibukota: "Yogyakarta", atlet: 612, medali: 58, cabor: 39, ketua: "KONI DIY" },
  "Jawa Timur": { ibukota: "Surabaya", atlet: 1789, medali: 172, cabor: 60, ketua: "KONI Jatim" },
  "Bali": { ibukota: "Denpasar", atlet: 678, medali: 62, cabor: 41, ketua: "KONI Bali" },
  "Nusa Tenggara Barat": { ibukota: "Mataram", atlet: 312, medali: 27, cabor: 22, ketua: "KONI NTB" },
  "Nusa Tenggara Timur": { ibukota: "Kupang", atlet: 287, medali: 23, cabor: 20, ketua: "KONI NTT" },
  "Kalimantan Barat": { ibukota: "Pontianak", atlet: 398, medali: 34, cabor: 26, ketua: "KONI Kalbar" },
  "Kalimantan Tengah": { ibukota: "Palangkaraya", atlet: 278, medali: 21, cabor: 20, ketua: "KONI Kalteng" },
  "Kalimantan Selatan": { ibukota: "Banjarmasin", atlet: 367, medali: 31, cabor: 25, ketua: "KONI Kalsel" },
  "Kalimantan Timur": { ibukota: "Samarinda", atlet: 412, medali: 38, cabor: 28, ketua: "KONI Kaltim" },
  "Kalimantan Utara": { ibukota: "Tanjung Selor", atlet: 134, medali: 9, cabor: 13, ketua: "KONI Kaltara" },
  "Sulawesi Utara": { ibukota: "Manado", atlet: 389, medali: 36, cabor: 27, ketua: "KONI Sulut" },
  "Gorontalo": { ibukota: "Gorontalo", atlet: 178, medali: 14, cabor: 16, ketua: "KONI Gorontalo" },
  "Sulawesi Tengah": { ibukota: "Palu", atlet: 256, medali: 20, cabor: 19, ketua: "KONI Sulteng" },
  "Sulawesi Barat": { ibukota: "Mamuju", atlet: 167, medali: 11, cabor: 14, ketua: "KONI Sulbar" },
  "Sulawesi Selatan": { ibukota: "Makassar", atlet: 712, medali: 68, cabor: 43, ketua: "KONI Sulsel" },
  "Sulawesi Tenggara": { ibukota: "Kendari", atlet: 234, medali: 19, cabor: 18, ketua: "KONI Sultra" },
  "Maluku": { ibukota: "Ambon", atlet: 298, medali: 26, cabor: 21, ketua: "KONI Maluku" },
  "Maluku Utara": { ibukota: "Sofifi", atlet: 187, medali: 14, cabor: 15, ketua: "KONI Malut" },
  "Papua Barat": { ibukota: "Manokwari", atlet: 212, medali: 17, cabor: 16, ketua: "KONI Papua Barat" },
  "Papua": { ibukota: "Jayapura", atlet: 423, medali: 38, cabor: 28, ketua: "KONI Papua" },
};

// Simplified Indonesia SVG regions as clickable circles (representational map)
const REGION_POSITIONS = [
  // Sumatera
  { id: "Aceh", x: 85, y: 120, r: 10 },
  { id: "Sumatera Utara", x: 105, y: 148, r: 13 },
  { id: "Sumatera Barat", x: 100, y: 175, r: 11 },
  { id: "Riau", x: 128, y: 168, r: 11 },
  { id: "Kepulauan Riau", x: 148, y: 180, r: 8 },
  { id: "Jambi", x: 118, y: 192, r: 10 },
  { id: "Bengkulu", x: 100, y: 200, r: 9 },
  { id: "Sumatera Selatan", x: 122, y: 210, r: 12 },
  { id: "Bangka Belitung", x: 146, y: 208, r: 8 },
  { id: "Lampung", x: 118, y: 228, r: 10 },
  // Jawa
  { id: "Banten", x: 152, y: 242, r: 9 },
  { id: "DKI Jakarta", x: 163, y: 240, r: 10 },
  { id: "Jawa Barat", x: 175, y: 246, r: 14 },
  { id: "Jawa Tengah", x: 200, y: 248, r: 13 },
  { id: "DI Yogyakarta", x: 210, y: 256, r: 8 },
  { id: "Jawa Timur", x: 225, y: 248, r: 14 },
  // Bali & Nusa Tenggara
  { id: "Bali", x: 248, y: 252, r: 9 },
  { id: "Nusa Tenggara Barat", x: 265, y: 256, r: 9 },
  { id: "Nusa Tenggara Timur", x: 285, y: 262, r: 10 },
  // Kalimantan
  { id: "Kalimantan Barat", x: 185, y: 208, r: 12 },
  { id: "Kalimantan Tengah", x: 210, y: 210, r: 12 },
  { id: "Kalimantan Selatan", x: 222, y: 228, r: 10 },
  { id: "Kalimantan Timur", x: 238, y: 200, r: 12 },
  { id: "Kalimantan Utara", x: 238, y: 182, r: 8 },
  // Sulawesi
  { id: "Sulawesi Utara", x: 285, y: 178, r: 9 },
  { id: "Gorontalo", x: 278, y: 192, r: 8 },
  { id: "Sulawesi Tengah", x: 272, y: 204, r: 10 },
  { id: "Sulawesi Barat", x: 258, y: 214, r: 8 },
  { id: "Sulawesi Selatan", x: 265, y: 228, r: 11 },
  { id: "Sulawesi Tenggara", x: 278, y: 224, r: 9 },
  // Maluku & Papua
  { id: "Maluku", x: 318, y: 210, r: 10 },
  { id: "Maluku Utara", x: 312, y: 188, r: 9 },
  { id: "Papua Barat", x: 345, y: 210, r: 10 },
  { id: "Papua", x: 390, y: 215, r: 14 },
];

function getMedalColor(medali) {
  if (medali >= 150) return "#CC0000";
  if (medali >= 60) return "#B8960C";
  if (medali >= 30) return "#3B82F6";
  return "#22C55E";
}

export default function PetaIndonesia() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const totalAtlet = Object.values(provinsiData).reduce((a, b) => a + b.atlet, 0);
  const totalMedali = Object.values(provinsiData).reduce((a, b) => a + b.medali, 0);
  const topProvinsi = Object.entries(provinsiData).sort((a, b) => b[1].medali - a[1].medali).slice(0, 5);

  return (
    <section style={{
      background: COLORS.gray,
      padding: "6rem 2rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.merah}, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Peta KONI" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Peta Interaktif 34 Provinsi
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, maxWidth: 520, marginBottom: "2.5rem", lineHeight: 1.8 }}>
            Klik titik provinsi untuk melihat data KONI daerah, jumlah atlet, dan perolehan medali.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>
          {/* SVG Map */}
          <FadeIn>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16, overflow: "hidden",
              position: "relative",
            }}>
              {/* Legend */}
              <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid rgba(255,255,255,0.07)`, display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { color: "#CC0000", label: "150+ medali" },
                  { color: "#B8960C", label: "60–149 medali" },
                  { color: "#3B82F6", label: "30–59 medali" },
                  { color: "#22C55E", label: "< 30 medali" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{l.label}</span>
                  </div>
                ))}
              </div>

              <svg
                viewBox="60 110 370 175"
                style={{ width: "100%", display: "block", cursor: "crosshair" }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
              >
                {/* Ocean background */}
                <rect x="60" y="110" width="370" height="175" fill="rgba(14,27,55,0.8)" />

                {/* Grid lines */}
                {[130, 150, 170, 190, 210, 230, 250, 270].map(y => (
                  <line key={y} x1="60" y1={y} x2="430" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                ))}
                {[100, 140, 180, 220, 260, 300, 340, 380, 420].map(x => (
                  <line key={x} x1={x} y1="110" x2={x} y2="285" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                ))}

                {/* Province dots */}
                {REGION_POSITIONS.map(p => {
                  const data = provinsiData[p.id];
                  const color = getMedalColor(data?.medali || 0);
                  const isHov = hovered === p.id;
                  const isSel = selected?.name === p.id;

                  return (
                    <g key={p.id}
                      onMouseEnter={() => setHovered(p.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected({ name: p.id, ...data })}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Pulse ring for selected */}
                      {isSel && (
                        <circle cx={p.x} cy={p.y} r={p.r + 6} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
                      )}
                      {/* Glow */}
                      <circle cx={p.x} cy={p.y} r={p.r + 3} fill={color} opacity={isHov || isSel ? 0.25 : 0} />
                      {/* Main dot */}
                      <circle
                        cx={p.x} cy={p.y} r={isHov || isSel ? p.r + 2 : p.r}
                        fill={color}
                        fillOpacity={isHov || isSel ? 1 : 0.75}
                        stroke={isSel ? "#fff" : isHov ? color : "rgba(255,255,255,0.2)"}
                        strokeWidth={isSel ? 2 : 1}
                        style={{ transition: "all 0.2s" }}
                      />
                      {/* Dot center */}
                      <circle cx={p.x} cy={p.y} r={2} fill="rgba(255,255,255,0.8)" />
                    </g>
                  );
                })}

                {/* Hover label */}
                {hovered && !selected && (() => {
                  const pos = REGION_POSITIONS.find(p => p.id === hovered);
                  if (!pos) return null;
                  return (
                    <g>
                      <rect x={pos.x - 40} y={pos.y - pos.r - 20} width="80" height="16" rx="4" fill="rgba(10,22,40,0.95)" stroke={COLORS.gold} strokeWidth="0.8" />
                      <text x={pos.x} y={pos.y - pos.r - 8} textAnchor="middle" fill={COLORS.gold} fontSize="7" fontWeight="bold">
                        {hovered}
                      </text>
                    </g>
                  );
                })()}
              </svg>

              <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid rgba(255,255,255,0.07)`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>34 Provinsi · Klik untuk detail</span>
                <span style={{ fontSize: 11, color: COLORS.gold }}>Total: {totalAtlet.toLocaleString("id-ID")} atlet</span>
              </div>
            </div>
          </FadeIn>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Selected province detail */}
            {selected ? (
              <FadeIn>
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
                  border: `1px solid ${COLORS.gold}40`,
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${COLORS.merah}22, ${COLORS.merah}44)`,
                    borderBottom: `1px solid rgba(255,255,255,0.08)`,
                    padding: "1.25rem",
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 3 }}>{selected.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.gold, display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={10} /> {selected.ibukota}
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, fontSize: 16 }}>×</button>
                  </div>
                  <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                      { icon: <Users size={14} />, label: "Atlet", val: selected.atlet.toLocaleString("id-ID"), color: "#60A5FA" },
                      { icon: <Trophy size={14} />, label: "Medali", val: selected.medali, color: COLORS.gold },
                      { icon: <Award size={14} />, label: "Cabor", val: selected.cabor, color: "#34D399" },
                      { icon: <MapPin size={14} />, label: "Provinsi", val: "Aktif", color: COLORS.merah },
                    ].map(s => (
                      <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                        <div style={{ color: s.color, marginBottom: 4, display: "flex", justifyContent: "center" }}>{s.icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.val}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ) : (
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 14, padding: "1.5rem", textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🗺️</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  Klik titik pada peta untuk melihat detail KONI provinsi
                </div>
              </div>
            )}

            {/* Top 5 */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 14, padding: "1.25rem",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                🏆 Top 5 Provinsi
              </div>
              {topProvinsi.map(([name, data], i) => (
                <div key={name}
                  onClick={() => setSelected({ name, ...data })}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? COLORS.gold : i === 1 ? "#94a3b8" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: i < 3 ? "#000" : "#fff",
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{name}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold }}>{data.medali} 🏅</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
