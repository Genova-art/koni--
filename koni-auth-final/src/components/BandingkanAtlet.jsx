import { useState } from "react";
import { COLORS, atletData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { X, BarChart2 } from "lucide-react";

function toRadarData(atlet) {
  return [
    { subject: "Medali", val: Math.min(atlet.medali * 4, 100) },
    { subject: "Pengalaman", val: atlet.tahun.includes("Sekarang") ? 80 : 60 },
    { subject: "Ranking", val: atlet.ranking.includes("#1") ? 100 : atlet.ranking.includes("#3") ? 75 : atlet.ranking.includes("Top") ? 65 : 50 },
    { subject: "Prestasi", val: atlet.prestasi.toLowerCase().includes("olimpiade") ? 100 : atlet.prestasi.toLowerCase().includes("dunia") ? 85 : 70 },
    { subject: "Nasional", val: 85 + Math.floor(Math.random() * 15) },
  ];
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(10,22,40,0.97)", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px" }}>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: <span style={{ color: "#fff" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function BandingkanAtlet() {
  const [atlet1, setAtlet1] = useState(null);
  const [atlet2, setAtlet2] = useState(null);

  const radarData = atlet1 && atlet2
    ? toRadarData(atlet1).map((d, i) => ({ ...d, [atlet1.nama.split(" ")[0]]: d.val, [atlet2.nama.split(" ")[0]]: toRadarData(atlet2)[i].val }))
    : null;

  return (
    <section style={{ background: COLORS.gray, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Komparasi Atlet" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
            Bandingkan Atlet
          </h2>
          <GoldDivider />
          <p style={{ color: COLORS.textMuted, fontSize: 15, maxWidth: 500, marginBottom: "2.5rem", lineHeight: 1.8 }}>
            Pilih dua atlet untuk membandingkan statistik dan prestasi secara side-by-side.
          </p>
        </FadeIn>

        {/* Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1.5rem", alignItems: "start", marginBottom: "2rem" }}>
          <AtletSelector label="Atlet 1" selected={atlet1} onSelect={setAtlet1} color={COLORS.merah} exclude={atlet2?.nama} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "2.5rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
              border: `2px solid ${COLORS.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BarChart2 size={18} color={COLORS.gold} />
            </div>
          </div>
          <AtletSelector label="Atlet 2" selected={atlet2} onSelect={setAtlet2} color={COLORS.gold} exclude={atlet1?.nama} />
        </div>

        {/* Comparison */}
        {atlet1 && atlet2 && (
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
              {/* Radar Chart */}
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16, padding: "1.5rem",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Radar Statistik
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                    <Radar name={atlet1.nama.split(" ")[0]} dataKey={atlet1.nama.split(" ")[0]} stroke={COLORS.merah} fill={COLORS.merah} fillOpacity={0.25} strokeWidth={2} />
                    <Radar name={atlet2.nama.split(" ")[0]} dataKey={atlet2.nama.split(" ")[0]} stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                  {[{ name: atlet1.nama.split(" ")[0], color: COLORS.merah }, { name: atlet2.nama.split(" ")[0], color: COLORS.gold }].map(l => (
                    <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { label: "Cabor", v1: atlet1.cabor, v2: atlet2.cabor },
                  { label: "Ranking", v1: atlet1.ranking, v2: atlet2.ranking },
                  { label: "Total Medali", v1: atlet1.medali, v2: atlet2.medali, numeric: true },
                  { label: "Asal Daerah", v1: atlet1.asal, v2: atlet2.asal },
                  { label: "Prestasi", v1: atlet1.prestasi, v2: atlet2.prestasi },
                  { label: "Periode Aktif", v1: atlet1.tahun, v2: atlet2.tahun },
                ].map((row, i) => {
                  const win1 = row.numeric && Number(row.v1) > Number(row.v2);
                  const win2 = row.numeric && Number(row.v2) > Number(row.v1);
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
                      <div style={{
                        background: win1 ? `rgba(204,0,0,0.12)` : "rgba(0,0,0,0.04)",
                        border: `1px solid ${win1 ? COLORS.merah + "40" : "rgba(0,0,0,0.06)"}`,
                        borderRadius: 8, padding: "9px 12px",
                        textAlign: "right",
                        fontSize: 12, fontWeight: win1 ? 700 : 500, color: win1 ? COLORS.merah : COLORS.navy,
                      }}>{row.v1}</div>
                      <div style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", whiteSpace: "nowrap", padding: "0 4px" }}>{row.label}</div>
                      <div style={{
                        background: win2 ? `rgba(184,150,12,0.12)` : "rgba(0,0,0,0.04)",
                        border: `1px solid ${win2 ? COLORS.gold + "40" : "rgba(0,0,0,0.06)"}`,
                        borderRadius: 8, padding: "9px 12px",
                        fontSize: 12, fontWeight: win2 ? 700 : 500, color: win2 ? COLORS.gold : COLORS.navy,
                      }}>{row.v2}</div>
                    </div>
                  );
                })}

                <button onClick={() => { setAtlet1(null); setAtlet2(null); }} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 8, padding: "9px", fontSize: 11, color: COLORS.textMuted,
                  cursor: "pointer", marginTop: 4,
                }}>
                  <X size={12} /> Reset Perbandingan
                </button>
              </div>
            </div>
          </FadeIn>
        )}

        {(!atlet1 || !atlet2) && (
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
            border: `1px solid ${COLORS.border}`, borderRadius: 14,
            padding: "2.5rem", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚔️</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
              {!atlet1 && !atlet2 ? "Pilih dua atlet dari dropdown di atas untuk membandingkan statistik mereka" : "Pilih satu atlet lagi untuk mulai perbandingan"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AtletSelector({ label, selected, onSelect, color, exclude }) {
  const [open, setOpen] = useState(false);
  const opts = atletData.filter(a => a.nama !== exclude);

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <button onClick={() => setOpen(p => !p)} style={{
        width: "100%", padding: "12px 16px",
        background: selected ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : COLORS.putih,
        border: `1px solid ${selected ? color + "50" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 10, textAlign: "left", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s",
      }}>
        {selected ? (
          <>
            <span style={{ fontSize: 24 }}>{selected.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{selected.nama}</div>
              <div style={{ fontSize: 10, color: color }}>{selected.cabor}</div>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>▼</span>
          </>
        ) : (
          <>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}15`, border: `1px dashed ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color }}>+</div>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>Pilih Atlet...</span>
          </>
        )}
      </button>

      {open && (
        <div style={{
          background: `linear-gradient(160deg, #0F1E38, #162A50)`,
          border: `1px solid ${COLORS.border}`, borderRadius: 10,
          marginTop: 6, overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          zIndex: 100, position: "relative",
        }}>
          {opts.map(a => (
            <button key={a.nama} onClick={() => { onSelect(a); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 14px",
              background: "none", border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{a.nama}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{a.cabor} · {a.ranking}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
