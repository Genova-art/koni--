import { useState } from "react";
import { COLORS } from "../data/constants";
import { Sparkles, Copy, Check, RefreshCw, X } from "lucide-react";

const TEMPLATES = {
  berita: (judul, kategori) => [
    `🏆 ${judul}\n\nIndonesia terus berprestasi! Bangga dengan pencapaian luar biasa para atlet kita yang tak pernah berhenti berjuang untuk Merah Putih. 🇮🇩💪\n\n#KONI #OlahragaIndonesia #${kategori?.replace(/\s/g,"")} #MerahPutih #BanggaIndonesia`,
    `📰 ${judul}\n\nSetiap prestasi adalah bukti kerja keras tanpa henti. Mari dukung terus olahraga Indonesia menuju Generasi Emas 2045! 🌟\n\n#KONIPusat #${kategori?.replace(/\s/g,"")} #AtletIndonesia #IndonesiaBisa`,
    `🔥 Breaking: ${judul}\n\nKita semua bangga dengan pencapaian ini! Share dan dukung terus olahraga Indonesia 🏅\n\n#KONI #${kategori?.replace(/\s/g,"")} #OlahragaNasional #IndonesiaJuara`,
  ],
  atlet: (nama, cabor, prestasi) => [
    `👑 Kebanggaan Indonesia — ${nama}!\n\n${prestasi}. Dari latihan keras hingga podium juara, perjalanan ${nama} menginspirasi jutaan anak bangsa. 💪🇮🇩\n\n#${nama?.replace(/\s/g,"")} #${cabor?.replace(/\s/g,"")} #AtletIndonesia #KONIPusat`,
    `🏆 Profil Atlet: ${nama}\n\nCabor: ${cabor} | Prestasi: ${prestasi}\n\nMereka berjuang bukan hanya untuk medali, tapi untuk nama Indonesia di pentas dunia! 🌍\n\n#KONI #${cabor?.replace(/\s/g,"")} #AtletBerprestasi`,
    `⭐ Mengenal ${nama} — Sang Juara ${cabor} Indonesia\n\n${prestasi} adalah bukti bahwa mimpi besar bisa terwujud dengan kerja keras! 💫\n\n#${nama?.split(" ")[0]} #KONI #OlahragaIndonesia #GenerasiEmas`,
  ],
  jadwal: (event, tanggal, lokasi) => [
    `📅 Catat Tanggalnya!\n\n${event}\n📍 ${lokasi}\n🗓️ ${tanggal}\n\nDukung Indonesia dari rumah! 🇮🇩🏆\n\n#KONI #${event?.replace(/[^a-zA-Z]/g,"")} #OlahragaIndonesia`,
    `⏰ Countdown dimulai!\n\n${event} segera hadir! Bersiaplah menyaksikan atlet-atlet terbaik Indonesia berjuang di ${lokasi} pada ${tanggal}. 💪\n\n#KONI #AtletIndonesia #MerahPutih`,
  ],
};

export default function AICaptionGenerator({ type = "berita", data = {}, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied]       = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [customText, setCustomText]   = useState("");

  const captions = type === "berita"
    ? TEMPLATES.berita(data.judul, data.kategori)
    : type === "atlet"
    ? TEMPLATES.atlet(data.nama, data.cabor, data.prestasi)
    : TEMPLATES.jadwal(data.nama, data.tanggal, data.lokasi);

  const activeCaption = customizing ? customText : captions[activeIdx];

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Caption tersalin! Siap di-post 📱", type: "success" } }));
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 5500,
        background: "rgba(5,10,20,0.88)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <div style={{
        maxWidth: 520, width: "100%",
        background: "linear-gradient(160deg, #0A1628, #132040)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, #4F46E5, #7C3AED)`,
          padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={16} color="#fff" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>AI Caption Generator</span>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, padding: "2px 8px", fontSize: 9, color: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>
              BETA
            </span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Context chip */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Konteks</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px" }}>
              <Sparkles size={12} color="#A78BFA" />
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
                {type === "berita" ? `📰 ${data.judul?.slice(0, 40)}...` : type === "atlet" ? `🏆 ${data.nama}` : `📅 ${data.nama}`}
              </span>
            </div>
          </div>

          {/* Caption preview */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Caption</div>
              <button onClick={() => { setCustomizing(c => !c); if (!customizing) setCustomText(captions[activeIdx]); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 10, color: "#A78BFA", fontWeight: 600,
              }}>
                {customizing ? "← Kembali ke template" : "✏️ Edit manual"}
              </button>
            </div>
            {customizing ? (
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                style={{
                  width: "100%", height: 160, padding: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid rgba(167,139,250,0.4)`,
                  borderRadius: 10, color: "#fff", fontSize: 12,
                  lineHeight: 1.7, resize: "vertical", fontFamily: "inherit",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 10, padding: "14px",
                fontSize: 12, color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8, whiteSpace: "pre-line",
                minHeight: 140, maxHeight: 200, overflowY: "auto",
              }}>
                {captions[activeIdx]}
              </div>
            )}
          </div>

          {/* Template selector */}
          {!customizing && (
            <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
              {captions.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} style={{
                  flex: 1, padding: "7px",
                  background: activeIdx === i ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeIdx === i ? "#A78BFA" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 8, color: activeIdx === i ? "#A78BFA" : "rgba(255,255,255,0.4)",
                  fontSize: 11, fontWeight: activeIdx === i ? 700 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  Versi {i + 1}
                </button>
              ))}
              <button onClick={() => setActiveIdx(Math.floor(Math.random() * captions.length))} style={{
                padding: "7px 10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}>
                <RefreshCw size={12} />
              </button>
            </div>
          )}

          {/* Platform badges */}
          <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
            {[
              { name: "Instagram", color: "#E1306C", emoji: "📸" },
              { name: "Twitter/X", color: "#1DA1F2", emoji: "𝕏" },
              { name: "WhatsApp", color: "#25D366", emoji: "💬" },
              { name: "Facebook", color: "#1877F2", emoji: "f" },
            ].map(p => (
              <div key={p.name} style={{
                flex: 1, textAlign: "center", padding: "6px 4px",
                background: `${p.color}12`, border: `1px solid ${p.color}25`,
                borderRadius: 8, fontSize: 9, color: p.color, fontWeight: 600,
              }}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>{p.emoji}</div>
                {p.name.split("/")[0]}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <button onClick={handleCopy} style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: copied ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #4F46E5, #7C3AED)",
            border: `1px solid ${copied ? "#22C55E" : "transparent"}`,
            borderRadius: 10, padding: "13px",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: copied ? "none" : "0 4px 20px rgba(79,70,229,0.4)",
            transition: "all 0.2s",
          }}>
            {copied ? <><Check size={15} /> Caption Tersalin — Siap di-Post!</> : <><Copy size={15} /> Salin Caption</>}
          </button>
        </div>
      </div>
    </div>
  );
}
