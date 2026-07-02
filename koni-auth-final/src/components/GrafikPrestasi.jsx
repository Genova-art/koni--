import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Trophy, TrendingUp, Award, Target } from "lucide-react";
import { MedalGoldIcon } from "./Icons";

// Data perolehan medali Indonesia di berbagai event
const medalData = [
  { tahun: "1992", emas: 2, perak: 2, perunggu: 1, total: 5, event: "Olimpiade Barcelona" },
  { tahun: "1996", emas: 1, perak: 1, perunggu: 2, total: 4, event: "Olimpiade Atlanta" },
  { tahun: "2000", emas: 1, perak: 3, perunggu: 2, total: 6, event: "Olimpiade Sydney" },
  { tahun: "2004", emas: 1, perak: 1, perunggu: 2, total: 4, event: "Olimpiade Athena" },
  { tahun: "2008", emas: 1, perak: 1, perunggu: 3, total: 5, event: "Olimpiade Beijing" },
  { tahun: "2012", emas: 0, perak: 1, perunggu: 1, total: 2, event: "Olimpiade London" },
  { tahun: "2016", emas: 1, perak: 2, perunggu: 1, total: 4, event: "Olimpiade Rio" },
  { tahun: "2020", emas: 1, perak: 1, perunggu: 3, total: 5, event: "Olimpiade Tokyo" },
  { tahun: "2024", emas: 2, perak: 0, perunggu: 1, total: 3, event: "Olimpiade Paris" },
];

const seaGamesData = [
  { tahun: "2011", emas: 182, perak: 151, perunggu: 143, total: 476 },
  { tahun: "2013", emas: 65,  perak: 86,  perunggu: 103, total: 254 },
  { tahun: "2015", emas: 47,  perak: 61,  perunggu: 74,  total: 182 },
  { tahun: "2017", emas: 38,  perak: 63,  perunggu: 90,  total: 191 },
  { tahun: "2019", emas: 72,  perak: 84,  perunggu: 111, total: 267 },
  { tahun: "2021", emas: 69,  perak: 91,  perunggu: 122, total: 282 },
  { tahun: "2023", emas: 87,  perak: 80,  perunggu: 116, total: 283 },
  { tahun: "2025", emas: 94,  perak: 88,  perunggu: 109, total: 291 },
];

const caborMedaliData = [
  { cabor: "Bulutangkis", medali: 24, icon: "🏸" },
  { cabor: "Renang", medali: 18, icon: "🏊" },
  { cabor: "P. Silat", medali: 15, icon: "🥋" },
  { cabor: "Atletik", medali: 12, icon: "🏃" },
  { cabor: "Angkat Besi", medali: 9, icon: "🏋️" },
  { cabor: "Panahan", medali: 7, icon: "🏹" },
  { cabor: "Voli", medali: 4, icon: "🏐" },
  { cabor: "Sepak Bola", medali: 2, icon: "⚽" },
];

const TABS = [
  { id: "olimpiade", label: "Olimpiade", icon: <Trophy size={14} /> },
  { id: "seagames", label: "SEA Games", icon: <Award size={14} /> },
  { id: "cabor", label: "Per Cabor", icon: <Target size={14} /> },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,22,40,0.97)",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: "12px 16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.fill || p.stroke }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function SummaryCard({ icon, label, value, color, delay }) {
  return (
    <FadeIn delay={delay}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}30`,
        borderRadius: 12, padding: "1.25rem",
        display: "flex", alignItems: "center", gap: 14,
        transition: "all 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `${color}20`, border: `1px solid ${color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function GrafikPrestasi() {
  const [activeTab, setActiveTab] = useState("olimpiade");

  const totalEmas = medalData.reduce((a, b) => a + b.emas, 0);
  const totalMedali = medalData.reduce((a, b) => a + b.total, 0);
  const bestYear = medalData.reduce((a, b) => b.total > a.total ? b : a);
  const seaTotal = seaGamesData.reduce((a, b) => a + b.total, 0);

  return (
    <section style={{
      background: `linear-gradient(160deg, #060D1A 0%, ${COLORS.navy} 40%, ${COLORS.navyMid} 100%)`,
      padding: "6rem 2rem", position: "relative", overflow: "hidden",
    }}>
      {/* BG */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "-5%", top: "20%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,150,12,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Grafik Prestasi" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            color: COLORS.putih, margin: "0 0 0.5rem",
          }}>
            Rekam Jejak Kejayaan
          </h2>
          <GoldDivider />
          <p style={{
            color: "rgba(255,255,255,0.5)", fontSize: 15,
            maxWidth: 520, marginBottom: "2.5rem", lineHeight: 1.8,
          }}>
            Data historis perolehan medali Indonesia di pentas olahraga internasional dari dekade ke dekade.
          </p>
        </FadeIn>

        {/* Summary cards */}
        <div className="grafik-summary">
          <SummaryCard icon={<MedalGoldIcon size={22} />} label="Emas Olimpiade" value={totalEmas} color={COLORS.gold} delay={0.05} />
          <SummaryCard icon={<Trophy size={20} />} label="Total Medali Olimpiade" value={totalMedali} color={COLORS.merah} delay={0.12} />
          <SummaryCard icon={<TrendingUp size={20} />} label="Tahun Terbaik" value={bestYear.tahun} color="#22C55E" delay={0.19} />
          <SummaryCard icon={<Award size={20} />} label="Medali SEA Games" value={`${seaTotal}+`} color="#6B21A8" delay={0.26} />
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: 6, margin: "2.5rem 0 2rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: 5, width: "fit-content",
        }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 20px", borderRadius: 7, border: "none", cursor: "pointer",
              background: activeTab === tab.id
                ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`
                : "transparent",
              color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.45)",
              fontSize: 12, fontWeight: 600,
              transition: "all 0.2s",
              boxShadow: activeTab === tab.id ? "0 4px 16px rgba(204,0,0,0.3)" : "none",
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <FadeIn>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid rgba(184,150,12,0.15)`,
            borderRadius: 16, padding: "2rem",
          }}>
            {activeTab === "olimpiade" && (
              <>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
                  Perolehan medali Indonesia di Olimpiade (1992–2024)
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={medalData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.gold} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={COLORS.gold} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.merah} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={COLORS.merah} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <XAxis dataKey="tahun" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Area type="monotone" dataKey="emas" name="Emas" stroke={COLORS.gold} fill="url(#goldGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.gold }} activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="perak" name="Perak" stroke="#94a3b8" fill="url(#silverGrad)" strokeWidth={2} dot={{ r: 3, fill: "#94a3b8" }} />
                    <Area type="monotone" dataKey="perunggu" name="Perunggu" stroke="#CD7F32" fill="url(#redGrad)" strokeWidth={2} dot={{ r: 3, fill: "#CD7F32" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}

            {activeTab === "seagames" && (
              <>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
                  Perolehan medali Indonesia di SEA Games (2011–2025)
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={seaGamesData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <XAxis dataKey="tahun" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                    <Bar dataKey="emas" name="Emas" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="perak" name="Perak" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="perunggu" name="Perunggu" fill="#CD7F32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {activeTab === "cabor" && (
              <>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
                  Distribusi medali per cabang olahraga unggulan
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={caborMedaliData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="cabor" type="category" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="medali" name="Total Medali" radius={[0, 6, 6, 0]}
                      fill="url(#barGradH)"
                    />
                    <defs>
                      <linearGradient id="barGradH" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={COLORS.merah} />
                        <stop offset="100%" stopColor={COLORS.gold} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
