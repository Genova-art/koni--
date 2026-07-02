import { useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Play, X, ExternalLink } from "lucide-react";

const VIDEOS = [
  { id: "7Nl0Rnwo9JU", judul: "Indonesia Juara Umum Bulutangkis SEA Games 2025", durasi: "4:32", views: "2.1 juta", kategori: "SEA Games", featured: true },
  { id: "ep0ZIB8tb8U", judul: "Eko Yuli Irawan – Legenda Angkat Besi 4 Kali Olimpiade", durasi: "8:14", views: "1.8 juta", kategori: "Olimpiade", featured: false },
  { id: "Mh7wmiLLYd4", judul: "Asian Games 2018 Jakarta – Upacara Pembukaan Spektakuler", durasi: "12:40", views: "5.2 juta", kategori: "Asian Games", featured: false },
  { id: "lkp32ms6hO0", judul: "Tim Pencak Silat Indonesia – Latihan Pelatnas", durasi: "6:22", views: "980 ribu", kategori: "Training", featured: false },
  { id: "_085y8TbwIo", judul: "Program PPLP – Pembinaan Atlet Muda Generasi Emas", durasi: "9:05", views: "1.3 juta", kategori: "Profil", featured: false },
  { id: "u9L7FNVC62g", judul: "Profil Atlet Panahan Indonesia di Asian Games", durasi: "3:48", views: "760 ribu", kategori: "Asian Games", featured: false },
];

const KATEGORI = ["Semua", "SEA Games", "Olimpiade", "Asian Games", "Training", "Profil"];
const THUMB = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function VideoCard({ video, onPlay, featured }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, overflow: "hidden",
        border: `1px solid ${featured ? COLORS.gold + "40" : "rgba(255,255,255,0.08)"}`,
        background: "rgba(255,255,255,0.03)",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.4)` : "none",
        gridColumn: featured ? "span 2" : "span 1",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        aspectRatio: featured ? "16/7" : "16/9",
        background: `url(${THUMB(video.id)}) center/cover`,
        cursor: "pointer",
        overflow: "hidden",
      }} onClick={() => onPlay(video)}>
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "rgba(0,0,0,0.35)"
            : "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
          transition: "background 0.3s",
        }} />

        {/* Play button */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: hovered ? 64 : 52,
            height: hovered ? 64 : 52,
            borderRadius: "50%",
            background: hovered
              ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`
              : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
            border: `2px solid ${hovered ? COLORS.gold : "rgba(255,255,255,0.4)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s",
            boxShadow: hovered ? `0 0 30px rgba(204,0,0,0.5)` : "none",
          }}>
            <Play size={hovered ? 24 : 20} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
          </div>
        </div>

        {/* Duration badge */}
        <div style={{
          position: "absolute", bottom: 10, right: 10,
          background: "rgba(0,0,0,0.75)", borderRadius: 4,
          padding: "2px 7px", fontSize: 10, color: "#fff", fontWeight: 600,
        }}>
          {video.durasi}
        </div>

        {/* Category badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: COLORS.merah, borderRadius: 100,
          padding: "3px 10px", fontSize: 9, color: "#fff",
          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          {video.kategori}
        </div>

        {featured && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: COLORS.gold, borderRadius: 100,
            padding: "3px 10px", fontSize: 9, color: "#000",
            fontWeight: 800, letterSpacing: "0.1em",
          }}>
            ★ UNGGULAN
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "1rem 1.25rem" }}>
        <div style={{
          fontSize: featured ? 15 : 13,
          fontWeight: 700, color: "#fff",
          lineHeight: 1.4, marginBottom: 6,
          fontFamily: "Georgia, serif",
        }}>
          {video.judul}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>👁 {video.views} tayangan</span>
          <button
            onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, "_blank")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, color: COLORS.gold, fontWeight: 600,
            }}
          >
            <ExternalLink size={11} /> YouTube
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoHighlight() {
  const [filter, setFilter] = useState("Semua");
  const [playing, setPlaying] = useState(null);

  const visible = filter === "Semua" ? VIDEOS : VIDEOS.filter(v => v.kategori === filter);

  return (
    <section style={{
      background: `linear-gradient(160deg, ${COLORS.navyMid}, #0A1628)`,
      padding: "6rem 2rem", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <FadeIn>
          <SectionLabel label="Video Highlight" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Momen Bersejarah
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 500, marginBottom: "2rem", lineHeight: 1.8 }}>
            Saksikan kembali momen-momen kejayaan atlet Indonesia yang menginspirasi dunia.
          </p>

          {/* Filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {KATEGORI.map(k => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "7px 18px", borderRadius: 100,
                border: `1px solid ${filter === k ? COLORS.gold : "rgba(255,255,255,0.15)"}`,
                background: filter === k ? `${COLORS.gold}20` : "transparent",
                color: filter === k ? COLORS.gold : "rgba(255,255,255,0.5)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>{k}</button>
            ))}
          </div>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
        }}>
          {visible.map((v, i) => (
            <FadeIn key={v.id} delay={i * 0.07}>
              <VideoCard video={v} onPlay={setPlaying} featured={v.featured && filter === "Semua" && i === 0} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Lightbox player */}
      {playing && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setPlaying(null); }}
          style={{
            position: "fixed", inset: 0, zIndex: 5000,
            background: "rgba(0,0,0,0.95)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
            animation: "fadeInOverlay 0.2s ease",
          }}
        >
          <div style={{ width: "100%", maxWidth: 900, position: "relative" }}>
            <button
              onClick={() => setPlaying(null)}
              style={{
                position: "absolute", top: -44, right: 0,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8, color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", fontSize: 12, fontWeight: 600,
              }}
            >
              <X size={14} /> Tutup
            </button>
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: `0 0 0 2px ${COLORS.gold}40` }}>
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&rel=0`}
                title={playing.judul}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: "block" }}
              />
            </div>
            <div style={{ marginTop: 14, fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>
              {playing.judul}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
