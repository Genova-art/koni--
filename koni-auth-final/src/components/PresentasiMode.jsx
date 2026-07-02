import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../data/constants";
import { Play, Pause, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

const SECTIONS = [
  { id: "beranda",  label: "Beranda",            narasi: "Selamat datang di website resmi KONI Pusat — Komite Olahraga Nasional Indonesia." },
  { id: "profil",   label: "Profil KONI",         narasi: "KONI berdiri sejak 1946, menaungi 67 cabang olahraga dan 34 KONI Provinsi di seluruh Indonesia." },
  { id: "cabor",    label: "Cabang Olahraga",     narasi: "Bulutangkis, Angkat Besi, Pencak Silat, dan cabang unggulan lainnya telah mengharumkan nama Indonesia di dunia." },
  { id: "atlet",    label: "Atlet Berprestasi",   narasi: "Para pahlawan olahraga Indonesia yang telah berjuang membawa nama bangsa di berbagai ajang internasional." },
  { id: "berita",   label: "Berita Terkini",      narasi: "Update terbaru seputar prestasi, program pembinaan, dan kegiatan KONI Pusat." },
  { id: "jadwal",   label: "Jadwal Kompetisi",    narasi: "Pantau jadwal SEA Games, PON, Asian Games, dan berbagai event olahraga mendatang." },
  { id: "kontak",   label: "Hubungi Kami",        narasi: "KONI Pusat siap melayani. Kunjungi kantor kami di Gedung KONI, Jl. Pintu I Senayan, Jakarta." },
];

export default function PresentasiMode() {
  const [active, setActive]   = useState(false);
  const [idx, setIdx]         = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollTo = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goTo = useCallback((i) => {
    setIdx(i);
    setProgress(0);
    scrollTo(SECTIONS[i].id);
  }, [scrollTo]);

  const next = useCallback(() => {
    if (idx < SECTIONS.length - 1) goTo(idx + 1);
    else { setPlaying(false); setProgress(0); }
  }, [idx, goTo]);

  const prev = useCallback(() => { if (idx > 0) goTo(idx - 1); }, [idx, goTo]);

  // Auto-advance every 6s when playing
  useEffect(() => {
    if (!playing || !active) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { next(); return 0; }
        return p + (100 / 60);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, active, next]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prev();
      if (e.key === "Escape") { setActive(false); setPlaying(false); }
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, next, prev]);

  const section = SECTIONS[idx];

  return (
    <>
      {/* Trigger button — shown in Profil section area */}
      <button
        onClick={() => { setActive(true); setIdx(0); scrollTo(SECTIONS[0].id); }}
        style={{
          position: "fixed", bottom: 32, left: 80,
          zIndex: 996,
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(10,22,40,0.9)",
          border: `1px solid ${COLORS.gold}40`,
          borderRadius: 100, padding: "8px 16px",
          color: COLORS.gold, fontSize: 11, fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.08em",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}15`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,22,40,0.9)"; e.currentTarget.style.transform = "none"; }}
      >
        <Maximize2 size={13} /> Mode Presentasi
      </button>

      {/* Presentation overlay */}
      {active && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9993,
          pointerEvents: "none",
        }}>
          {/* Top narrator bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            background: "rgba(10,22,40,0.97)",
            borderBottom: `1px solid ${COLORS.gold}30`,
            padding: "0 20px",
            height: 50,
            display: "flex", alignItems: "center", gap: 16,
            pointerEvents: "all",
          }}>
            {/* Progress */}
            <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})`, borderRadius: 99, transition: "width 0.1s" }} />
            </div>

            {/* Narasi */}
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.7)",
              maxWidth: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              flex: 2, textAlign: "center",
            }}>
              💬 {section.narasi}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button onClick={prev} disabled={idx === 0} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: idx === 0 ? "rgba(255,255,255,0.2)" : "#fff", cursor: idx === 0 ? "default" : "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPlaying(p => !p)} style={{ background: playing ? `${COLORS.merah}30` : "rgba(255,255,255,0.08)", border: `1px solid ${playing ? COLORS.merah + "60" : "rgba(255,255,255,0.15)"}`, borderRadius: 6, color: playing ? COLORS.merah : "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {playing ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button onClick={next} disabled={idx === SECTIONS.length - 1} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: idx === SECTIONS.length - 1 ? "rgba(255,255,255,0.2)" : "#fff", cursor: idx === SECTIONS.length - 1 ? "default" : "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={14} />
              </button>
              <button onClick={() => { setActive(false); setPlaying(false); setProgress(0); }} style={{ background: "rgba(204,0,0,0.2)", border: `1px solid ${COLORS.merah}40`, borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Bottom section nav */}
          <div style={{
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6,
            background: "rgba(10,22,40,0.9)", border: `1px solid ${COLORS.border}`,
            borderRadius: 100, padding: "8px 14px",
            pointerEvents: "all",
          }}>
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)} style={{
                padding: "4px 10px", borderRadius: 100,
                background: i === idx ? COLORS.merah : "transparent",
                border: "none", color: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 10, fontWeight: i === idx ? 700 : 400,
                cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}>{s.label}</button>
            ))}
          </div>

          {/* Slide counter */}
          <div style={{
            position: "absolute", top: 64, right: 20,
            background: "rgba(10,22,40,0.9)", border: `1px solid ${COLORS.border}`,
            borderRadius: 100, padding: "5px 12px",
            fontSize: 11, color: COLORS.gold, fontWeight: 700,
            pointerEvents: "all",
          }}>
            {idx + 1} / {SECTIONS.length}
          </div>
        </div>
      )}
    </>
  );
}
