import { useEffect, useState } from "react";
import { COLORS } from "../data/constants";
import AISummary from "./AISummary";

export default function BeritaDetail({ berita, onClose }) {
  const [showAISummary, setShowAISummary] = useState(false);
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!berita) return null;

  const pageUrl = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(berita.judul);

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: "💬",
      color: "#25D366",
      url: `https://wa.me/?text=${title}%20${pageUrl}`,
    },
    {
      label: "Twitter / X",
      icon: "𝕏",
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?text=${title}&url=${pageUrl}`,
    },
    {
      label: "Salin Link",
      icon: "🔗",
      color: COLORS.gold,
      action: () => {
        navigator.clipboard?.writeText(window.location.href);
        window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Link berhasil disalin! 🔗", type: "success" } }));
      },
    },
    {
      label: "Facebook",
      icon: "f",
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    },
  ];

  // Full body text — expand from deskripsi
  const fullText = `${berita.deskripsi}

KONI terus berkomitmen mendukung setiap atlet dan cabang olahraga agar prestasi Indonesia semakin gemilang di kancah internasional. Program pembinaan yang komprehensif, didukung infrastruktur modern dan pelatih berpengalaman, menjadi fondasi kuat bagi setiap pencapaian yang diraih.

Melalui sinergi antara KONI Pusat, KONI Provinsi, dan seluruh cabang olahraga, Indonesia terus melangkah maju menuju target Generasi Emas 2045. Setiap medali yang diraih adalah bukti nyata dedikasi tanpa batas para atlet kebanggaan bangsa.

Informasi lebih lanjut dan perkembangan terkini dapat dipantau melalui kanal resmi KONI Pusat.`;

  return (
    <>
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 4000,
        background: "rgba(5,10,20,0.85)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <article style={{
        background: "#fff",
        borderRadius: 16,
        maxWidth: 720, width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
      }}>
        {/* Hero image area */}
        <div style={{
          minHeight: 240,
          background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 86, position: "relative",
        }}>
          {berita.img}

          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 10, color: "#fff", cursor: "pointer",
            width: 38, height: 38, fontSize: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            ×
          </button>

          {/* Category badge */}
          <div style={{
            position: "absolute", bottom: 16, left: 20,
            background: COLORS.merah, borderRadius: 100,
            padding: "5px 14px", fontSize: 11, fontWeight: 700,
            color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {berita.kategori}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "2rem 2.5rem 2.5rem" }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.25rem" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, border: `2px solid ${COLORS.gold}`,
              color: "#fff",
            }}>🏆</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy }}>Tim Redaksi KONI</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{berita.tanggal}</div>
            </div>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: COLORS.navy, lineHeight: 1.25,
            margin: "0 0 1.5rem",
          }}>
            {berita.judul}
          </h2>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem",
          }}>
            <div style={{ width: 40, height: 2, background: COLORS.gold }} />
            <div style={{ width: 8, height: 8, background: COLORS.gold, transform: "rotate(45deg)" }} />
            <div style={{ width: 40, height: 2, background: COLORS.gold }} />
          </div>

          {/* Body text */}
          {fullText.split("\n\n").map((para, i) => (
            <p key={i} style={{
              color: "#374151", fontSize: 15, lineHeight: 1.9,
              margin: "0 0 1.25rem",
            }}>
              {para}
            </p>
          ))}

          {/* Tags */}
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            margin: "1.5rem 0",
          }}>
            {["KONI", "Olahraga", berita.kategori, "Indonesia"].map(tag => (
              <span key={tag} style={{
                background: "rgba(10,22,40,0.06)", borderRadius: 100,
                padding: "4px 12px", fontSize: 11,
                color: COLORS.navy, fontWeight: 500,
                border: "1px solid rgba(10,22,40,0.1)",
              }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* AI Summary button */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              onClick={() => setShowAISummary(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: 10, padding: "10px 16px",
                color: "#A78BFA", fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))"}
            >
              ✨ Ringkas dengan Claude AI
            </button>
          </div>

          {/* Share section */}
          <div style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            paddingTop: "1.5rem", marginTop: "0.5rem",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLORS.navy,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "1rem",
            }}>
              Bagikan Artikel
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {shareLinks.map(s => (
                <button
                  key={s.label}
                  onClick={() => {
                    if (s.action) s.action();
                    else window.open(s.url, "_blank", "noopener,noreferrer");
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: 8,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}30`,
                    color: s.color, cursor: "pointer",
                    fontSize: 13, fontWeight: 700,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${s.color}22`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${s.color}12`;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
    {showAISummary && (
      <AISummary
        judul={berita.judul}
        deskripsi={berita.deskripsi}
        onClose={() => setShowAISummary(false)}
      />
    )}
  </>
  );
}
