import { useState, useEffect, useRef } from "react";
import { COLORS } from "../data/constants";
import { getStoredNews } from "../services/localData";

const DEFAULT_TICKERS = [
  "🏅 Indonesia raih 94 emas di SEA Games 2025 — rekor terbaru!",
  "🏸 Kevin Sanjaya pertahankan gelar juara dunia ganda putra All England 2026",
  "🏋️ Eko Yuli Irawan lolos kualifikasi Olimpiade 2028 Los Angeles",
  "📅 PON XXI Aceh–Sumatera Utara tinggal 113 hari lagi — persiapan final",
  "🎯 KONI luncurkan program beasiswa atlet muda 2026–2030 senilai Rp 120 miliar",
  "🏆 Indonesia juara umum SEA Games 2025 untuk pertama kalinya sejak 2011",
  "🥋 Tim Pencak Silat Indonesia raih 5 emas di Kejuaraan Dunia Jakarta",
  "🏹 Atlet panahan Indonesia pecahkan rekor dunia di Olimpiade Paris",
];

export default function NewsTicker({ scrolled }) {
  const [items, setItems] = useState(DEFAULT_TICKERS);
  const trackRef = useRef(null);

  useEffect(() => {
    const news = getStoredNews();
    if (news.length > 0) {
      const headlines = news.map(n => `📰 ${n.judul}`);
      setItems([...headlines, ...DEFAULT_TICKERS]);
    }
  }, []);

  // Build duplicated list for seamless loop
  const doubled = [...items, ...items];

  return (
    <div style={{
      position: "fixed",
      top: 72,
      left: 0,
      right: 0,
      zIndex: 990,
      height: 34,
      background: `linear-gradient(90deg, ${COLORS.merah} 0%, #8B0000 100%)`,
      borderBottom: `1px solid rgba(184,150,12,0.4)`,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      opacity: scrolled ? 1 : 0.92,
      transition: "opacity 0.3s",
      boxShadow: "0 2px 12px rgba(204,0,0,0.3)",
    }}>
      {/* BREAKING label */}
      <div style={{
        flexShrink: 0,
        background: COLORS.gold,
        color: "#000",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.18em",
        padding: "0 14px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        textTransform: "uppercase",
        zIndex: 2,
        boxShadow: "4px 0 12px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
      }}>
        ⚡ BERITA
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)" }}>
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "3rem",
            whiteSpace: "nowrap",
            animation: "tickerScroll 60s linear infinite",
            willChange: "transform",
          }}
        >
          {doubled.map((item, i) => (
            <span key={i} style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.92)",
              fontWeight: 500,
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.92)"}
            >
              {item}
              <span style={{ marginLeft: "3rem", color: "rgba(255,255,255,0.25)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Date */}
      <div style={{
        flexShrink: 0,
        fontSize: 9,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.08em",
        padding: "0 12px",
        borderLeft: "1px solid rgba(255,255,255,0.15)",
        whiteSpace: "nowrap",
      }}>
        {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .ticker-date { display: none; }
        }
      `}</style>
    </div>
  );
}
