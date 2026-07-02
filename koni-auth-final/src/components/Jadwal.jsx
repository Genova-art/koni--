import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

const jadwalData = [
  {
    id: 1,
    nama: "SEA Games 2026 – Upacara Pembukaan",
    lokasi: "Singapore National Stadium",
    tanggal: new Date("2026-07-15T19:00:00"),
    kategori: "SEA Games",
    warna: "#CC0000",
    cabor: ["Multi-Cabor"],
    status: "upcoming",
  },
  {
    id: 2,
    nama: "Kejuaraan Nasional Bulutangkis 2026",
    lokasi: "Istora Senayan, Jakarta",
    tanggal: new Date("2026-06-02T08:00:00"),
    kategori: "Kejurnas",
    warna: "#B8960C",
    cabor: ["Bulutangkis"],
    status: "upcoming",
  },
  {
    id: 3,
    nama: "Pekan Olahraga Nasional (PON) XXI",
    lokasi: "Aceh – Sumatra Utara",
    tanggal: new Date("2026-09-08T08:00:00"),
    kategori: "PON",
    warna: "#1E3A5F",
    cabor: ["Multi-Cabor"],
    status: "upcoming",
  },
  {
    id: 4,
    nama: "Asian Games 2026 – Seleksi Atlet",
    lokasi: "Pusat Pelatnas, Jakarta",
    tanggal: new Date("2026-05-28T07:00:00"),
    kategori: "Asian Games",
    warna: "#0D6B3F",
    cabor: ["Atletik", "Renang", "Angkat Besi"],
    status: "upcoming",
  },
  {
    id: 5,
    nama: "Turnamen Internasional Pencak Silat",
    lokasi: "Jakarta Convention Center",
    tanggal: new Date("2026-08-20T09:00:00"),
    kategori: "Internasional",
    warna: "#6B21A8",
    cabor: ["Pencak Silat"],
    status: "upcoming",
  },
  {
    id: 6,
    nama: "Olimpiade Paris – Kualifikasi Final",
    lokasi: "Paris, Prancis",
    tanggal: new Date("2026-12-01T10:00:00"),
    kategori: "Olimpiade",
    warna: "#B45309",
    cabor: ["Multi-Cabor"],
    status: "upcoming",
  },
];

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calcTime(targetDate));
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTime(targetDate)), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

function calcTime(target) {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, past: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    past: false,
  };
}

function CountdownBox({ value, label }) {
  return (
    <div style={{
      textAlign: "center",
      background: "rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: "8px 10px",
      minWidth: 44,
    }}>
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: 20,
        fontWeight: 700,
        color: COLORS.gold,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{
        fontSize: 8, color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3,
      }}>
        {label}
      </div>
    </div>
  );
}

function JadwalCard({ event, delay, featured = false }) {
  const countdown = useCountdown(event.tanggal);
  const dateStr = event.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = event.tanggal.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  return (
    <FadeIn delay={delay}>
      <div style={{
        background: featured
          ? `linear-gradient(135deg, ${event.warna}22, ${event.warna}11)`
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${featured ? event.warna + "50" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.3s",
        height: "100%",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 20px 50px ${event.warna}25`;
          e.currentTarget.style.borderColor = event.warna + "70";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = featured ? event.warna + "50" : "rgba(255,255,255,0.08)";
        }}
      >
        {/* Top bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${event.warna}, ${event.warna}66)`,
        }} />

        <div style={{ padding: "1.5rem" }}>
          {/* Badge */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{
              background: `${event.warna}22`,
              border: `1px solid ${event.warna}50`,
              borderRadius: 100, padding: "3px 12px",
              fontSize: 10, fontWeight: 700,
              color: event.warna === COLORS.gold ? COLORS.gold : "#fff",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {event.kategori}
            </span>
            {event.cabor.map(c => (
              <span key={c} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100, padding: "3px 10px",
                fontSize: 10, color: "rgba(255,255,255,0.5)",
              }}>
                {c}
              </span>
            ))}
          </div>

          {/* Event name */}
          <h3 style={{
            fontSize: featured ? 17 : 15,
            fontWeight: 700, color: "#fff",
            fontFamily: "Georgia, serif",
            margin: "0 0 10px",
            lineHeight: 1.35,
          }}>
            {event.nama}
          </h3>

          {/* Date & location */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: "1.25rem" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", display: "flex", gap: 8, alignItems: "center" }}>
              <span>📅</span> {dateStr} · {timeStr}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", display: "flex", gap: 8, alignItems: "center" }}>
              <span>📍</span> {event.lokasi}
            </div>
          </div>

          {/* Countdown */}
          {!countdown.past ? (
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                ⏳ Hitung Mundur
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <CountdownBox value={countdown.days} label="Hari" />
                <CountdownBox value={countdown.hours} label="Jam" />
                <CountdownBox value={countdown.mins} label="Menit" />
                <CountdownBox value={countdown.secs} label="Detik" />
              </div>
            </div>
          ) : (
            <div style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 8, padding: "8px 12px",
              fontSize: 12, color: "#4ADE80", fontWeight: 600,
            }}>
              ✓ Event sedang berlangsung
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

const ALL_FILTER = "Semua";
const kategoriList = [ALL_FILTER, ...Array.from(new Set(jadwalData.map(j => j.kategori)))];

export default function Jadwal() {
  const [filter, setFilter] = useState(ALL_FILTER);
  const visible = filter === ALL_FILTER ? jadwalData : jadwalData.filter(j => j.kategori === filter);

  return (
    <section id="jadwal" style={{
      background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 60%, #0F1E38 100%)`,
      padding: "6rem 2rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* BG decorations */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: "-5%", top: "10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(204,0,0,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Kalender Event" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            color: COLORS.putih, margin: "0 0 0.5rem",
          }}>
            Jadwal Pertandingan
          </h2>
          <GoldDivider />
          <p style={{
            color: "rgba(255,255,255,0.5)", fontSize: 15,
            maxWidth: 500, marginBottom: "2rem", lineHeight: 1.8,
          }}>
            Event dan kompetisi olahraga nasional dan internasional yang akan datang.
          </p>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "3rem" }}>
            {kategoriList.map(k => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "7px 18px", borderRadius: 100,
                border: `1px solid ${filter === k ? COLORS.gold : "rgba(255,255,255,0.15)"}`,
                background: filter === k ? `${COLORS.gold}20` : "transparent",
                color: filter === k ? COLORS.gold : "rgba(255,255,255,0.55)",
                fontSize: 12, fontWeight: filter === k ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.05em",
              }}>
                {k}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="jadwal-grid">
          {visible.map((event, i) => (
            <JadwalCard key={event.id} event={event} delay={i * 0.07} featured={i === 0 && filter === ALL_FILTER} />
          ))}
        </div>
      </div>
    </section>
  );
}
