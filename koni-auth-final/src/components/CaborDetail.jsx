import { useEffect } from "react";
import { COLORS } from "../data/constants";
import { X, Trophy, Users, Globe, Star, TrendingUp } from "lucide-react";

const CABOR_DETAIL = {
  "Bulutangkis": {
    deskripsi: "Bulutangkis adalah olahraga andalan Indonesia di kancah internasional. Sejak 1958, Indonesia telah mendominasi turnamen dunia termasuk All England, Thomas Cup, Uber Cup, dan Olimpiade.",
    federasi: "BWF (Badminton World Federation)",
    tahunBerdiri: "1953",
    prestasiTerbaik: "Juara Olimpiade 1992, 1996, 2000, 2004, 2020",
    atletLegenda: ["Rudy Hartono", "Susi Susanti", "Alan Budi Kusuma", "Taufik Hidayat", "Kevin Sanjaya"],
    warna: "#2563EB",
    rekorDunia: "19x Juara Thomas Cup",
  },
  "Angkat Besi": {
    deskripsi: "Angkat besi Indonesia telah menjadi penghasil medali Olimpiade yang konsisten. Lifter Indonesia dikenal tangguh di kelas bawah dan menengah di tingkat dunia.",
    federasi: "IWF (International Weightlifting Federation)",
    tahunBerdiri: "1946",
    prestasiTerbaik: "4x Medali Olimpiade (Eko Yuli Irawan)",
    atletLegenda: ["Eko Yuli Irawan", "Triyatno", "Nurul Akmal", "Deni"],
    warna: "#7C3AED",
    rekorDunia: "Emas Asian Games 2023",
  },
  "Pencak Silat": {
    deskripsi: "Seni bela diri asli Indonesia yang kini diakui dunia. Pencak Silat resmi masuk SEA Games sejak 1987 dan Asia Games 2018 di Jakarta.",
    federasi: "PERSILAT (Persekutuan Pencak Silat Antara Bangsa)",
    tahunBerdiri: "1948",
    prestasiTerbaik: "14x Emas SEA Games 2023",
    atletLegenda: ["Cecep Arif Rahman", "Sriyati", "Hanifan Yudani"],
    warna: "#DC2626",
    rekorDunia: "Juara Umum Kejuaraan Dunia 2022",
  },
  "Atletik": {
    deskripsi: "Cabang olahraga dasar yang mencakup lari, lompat, lempar, dan jalan. Indonesia terus mengembangkan atlet atletik untuk bersaing di level Asian Games dan Olimpiade.",
    federasi: "World Athletics",
    tahunBerdiri: "1950",
    prestasiTerbaik: "Emas SEA Games 100m & Lompat Jauh",
    atletLegenda: ["Maria Londa", "Rifda Irfanaluthfi", "Emilia Nova"],
    warna: "#059669",
    rekorDunia: "Rekor Nasional Lompat Jauh Rifda 6.61m",
  },
  "Renang": {
    deskripsi: "Renang Indonesia terus berkembang dengan lahirnya atlet-atlet muda berbakat. Fokus pada gaya bebas, gaya punggung, dan gaya kupu-kupu di level SEA Games.",
    federasi: "FINA (World Aquatics)",
    tahunBerdiri: "1951",
    prestasiTerbaik: "7x Emas SEA Games 2023",
    atletLegenda: ["I Gede Siman Sudartawa", "Azzahra Permatahani"],
    warna: "#0284C7",
    rekorDunia: "Rekor SEA Games 50m Gaya Punggung",
  },
  "Panahan": {
    deskripsi: "Panahan Indonesia telah mengukir sejarah emas di Asian Games. Atlet panahan Indonesia dikenal konsisten di level Asia dan dunia sejak 1988.",
    federasi: "World Archery",
    tahunBerdiri: "1959",
    prestasiTerbaik: "Emas Asian Games 1988, 2022",
    atletLegenda: ["Nurfitriyana", "Diananda Choirunisa", "Aflah Fadlan"],
    warna: "#B45309",
    rekorDunia: "Top 5 Dunia Recurve Putri",
  },
  "Sepak Bola": {
    deskripsi: "Sepak bola adalah olahraga paling populer di Indonesia. Timnas Indonesia terus berkembang di bawah pembinaan PSSI dan dukungan penuh KONI.",
    federasi: "FIFA / AFC",
    tahunBerdiri: "1930",
    prestasiTerbaik: "Runner-up SEA Games 2023",
    atletLegenda: ["Bambang Pamungkas", "Egy Maulana Vikri", "Marselino Ferdinan"],
    warna: "#15803D",
    rekorDunia: "Ranking FIFA ke-127 (2025)",
  },
  "Voli": {
    deskripsi: "Bola voli Indonesia memiliki sejarah panjang di SEA Games. Timnas putri Indonesia pernah menjadi dominan di Asia Tenggara pada era 1990-2000an.",
    federasi: "FIVB (Fédération Internationale de Volleyball)",
    tahunBerdiri: "1955",
    prestasiTerbaik: "4x Emas SEA Games Voli Putri",
    atletLegenda: ["Aprilia Manganang", "Megawati Hangestri"],
    warna: "#9333EA",
    rekorDunia: "Juara Putri SEA Games 2007",
  },
};

export default function CaborDetail({ cabor, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const detail = CABOR_DETAIL[cabor.nama] || {};
  const warna = detail.warna || COLORS.merah;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 4000,
        background: "rgba(5,10,20,0.88)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <div style={{
        background: `linear-gradient(160deg, #0A1628, #132040)`,
        border: `1px solid ${warna}40`,
        borderRadius: 20,
        maxWidth: 640, width: "100%",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px ${warna}20`,
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${warna}22, ${warna}44)`,
          borderBottom: `1px solid ${warna}30`,
          padding: "2rem",
          display: "flex", gap: 20, alignItems: "center",
          position: "relative",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${warna}44, ${warna}88)`,
            border: `2px solid ${warna}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38,
            boxShadow: `0 0 24px ${warna}44`,
          }}>
            {cabor.icon}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 4 }}>{cabor.nama}</div>
            <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              {detail.federasi || "Federasi Nasional"}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: `${warna}22`, border: `1px solid ${warna}40`, borderRadius: 100, padding: "3px 12px", fontSize: 11, color: "#fff" }}>
                🏅 {cabor.medali} Medali
              </span>
              <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "3px 12px", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                👥 {cabor.atlet} Atlet
              </span>
              <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "3px 12px", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                📅 Est. {detail.tahunBerdiri || "—"}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, color: "#fff", cursor: "pointer",
            width: 34, height: 34, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "2rem" }}>
          {/* Deskripsi */}
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.9, marginBottom: "1.75rem" }}>
            {detail.deskripsi || "Cabang olahraga unggulan Indonesia yang terus berkembang dan mengukir prestasi di kancah internasional."}
          </p>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }}>
            {[
              { icon: <Trophy size={16} />, label: "Prestasi Terbaik", val: detail.prestasiTerbaik, color: COLORS.gold },
              { icon: <Star size={16} />, label: "Rekor / Catatan", val: detail.rekorDunia, color: "#22C55E" },
              { icon: <Globe size={16} />, label: "Federasi Internasional", val: detail.federasi, color: "#60A5FA" },
              { icon: <TrendingUp size={16} />, label: "Total Atlet Aktif", val: `${cabor.atlet} atlet nasional`, color: warna },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${s.color}25`,
                borderRadius: 10, padding: "1rem",
              }}>
                <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{s.val || "—"}</div>
              </div>
            ))}
          </div>

          {/* Atlet Legenda */}
          {detail.atletLegenda && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={12} /> Atlet Legendaris
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {detail.atletLegenda.map((a, i) => (
                  <div key={i} style={{
                    background: `${warna}15`,
                    border: `1px solid ${warna}30`,
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 12, fontWeight: 600, color: "#fff",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 10 }}>⭐</span> {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bar: medali vs atlet visual */}
          <div style={{
            background: `${warna}10`,
            border: `1px solid ${warna}25`,
            borderRadius: 12, padding: "1.25rem",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              Kontribusi terhadap Total Medali Nasional
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((cabor.medali / 24) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${warna}, ${COLORS.gold})`,
                borderRadius: 99,
                transition: "width 1s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>0</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: warna }}>{cabor.medali} medali</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
