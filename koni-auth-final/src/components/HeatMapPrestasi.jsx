import { useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// Generate mock heatmap data for 2025
function genData() {
  const data = {};
  const hotMonths = [1, 2, 6, 7, 8, 9]; // Feb, Mar, Jul, Agu, Sep, Okt (peak event season)
  for (let m = 0; m < 12; m++) {
    const days = new Date(2025, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const key = `2025-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const isHot = hotMonths.includes(m);
      const base = isHot ? 2 : 0;
      const rand = Math.random();
      data[key] = rand < 0.35 ? 0 : rand < 0.6 ? base + 1 : rand < 0.8 ? base + 2 : rand < 0.93 ? base + 3 : 4;
    }
  }
  // Spike on known event dates
  ["2025-07-15","2025-07-16","2025-07-17","2025-08-20","2025-09-08","2025-09-09","2025-02-10"].forEach(d => { data[d] = 4; });
  return data;
}

const DATA = genData();

function getCellColor(val, isDark) {
  if (val === 0) return isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  if (val === 1) return `${COLORS.merah}40`;
  if (val === 2) return `${COLORS.merah}70`;
  if (val === 3) return `${COLORS.merah}99`;
  return COLORS.merah;
}

export default function HeatMapPrestasi() {
  const [tooltip, setTooltip] = useState(null);
  const isDark = true; // always dark section

  // Build calendar weeks
  const weeks = [];
  let week = [];
  const firstDay = new Date("2025-01-01").getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let m = 0; m < 12; m++) {
    const days = new Date(2025, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const key = `2025-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      week.push({ key, day: d, month: m, val: DATA[key] || 0 });
      if (week.length === 7) { weeks.push(week); week = []; }
    }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }

  const totalMedali = Object.values(DATA).reduce((a, b) => a + b, 0);
  const activeDays  = Object.values(DATA).filter(v => v > 0).length;
  const peakDay     = Object.entries(DATA).sort((a,b) => b[1]-a[1])[0];

  return (
    <section style={{ background: `linear-gradient(160deg, #060D1A, ${COLORS.navy})`, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Kalender Prestasi" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Heat Map Prestasi 2025
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 520, marginBottom: "2rem", lineHeight: 1.8 }}>
            Distribusi perolehan medali dan event olahraga Indonesia sepanjang tahun 2025.
          </p>
        </FadeIn>

        {/* Summary */}
        <FadeIn delay={0.05}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {[
              { label: "Total Medali", val: totalMedali, color: COLORS.gold },
              { label: "Hari Aktif", val: activeDays, color: COLORS.merah },
              { label: "Hari Terbaik", val: peakDay[0].slice(5), color: "#22C55E" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}30`, borderRadius: 10, padding: "10px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "Georgia, serif" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "1.5rem", overflowX: "auto" }}>
            {/* Month labels */}
            <div style={{ display: "flex", gap: 2, marginBottom: 6, paddingLeft: 28 }}>
              {MONTHS.map((m, i) => (
                <div key={m} style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: `${(new Date(2025, i+1, 0).getDate() / 7) * 14}px`, flexShrink: 0, fontWeight: 600 }}>
                  {m}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 4 }}>
              {/* Day labels */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4 }}>
                {DAYS.map(d => (
                  <div key={d} style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", height: 12, lineHeight: "12px", width: 22, textAlign: "right" }}>{d}</div>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: "flex", gap: 2 }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {week.map((cell, di) => (
                      <div
                        key={di}
                        onMouseEnter={e => {
                          if (!cell) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ cell, x: rect.left, y: rect.top });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          width: 12, height: 12, borderRadius: 2,
                          background: cell ? getCellColor(cell.val, isDark) : "transparent",
                          cursor: cell ? "pointer" : "default",
                          transition: "transform 0.1s",
                          border: cell?.val >= 4 ? `1px solid ${COLORS.gold}60` : "1px solid transparent",
                        }}
                        onMouseOver={e => { if (cell) e.currentTarget.style.transform = "scale(1.4)"; }}
                        onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Sedikit</span>
              {[0, 1, 2, 3, 4].map(v => (
                <div key={v} style={{ width: 12, height: 12, borderRadius: 2, background: getCellColor(v, isDark), border: v === 4 ? `1px solid ${COLORS.gold}60` : "none" }} />
              ))}
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Banyak</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.cell && (
        <div style={{
          position: "fixed", left: tooltip.x - 60, top: tooltip.y - 60,
          background: "rgba(10,22,40,0.97)", border: `1px solid ${COLORS.border}`,
          borderRadius: 8, padding: "8px 12px", zIndex: 9990, pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {new Date(tooltip.cell.key).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
          </div>
          <div style={{ fontSize: 10, color: COLORS.gold, marginTop: 2 }}>
            {tooltip.cell.val === 0 ? "Tidak ada event" : `${tooltip.cell.val * 3} medali diraih`}
          </div>
        </div>
      )}
    </section>
  );
}
