import { useEffect, useState } from "react";
import { COLORS } from "../data/constants";
import { getStoredNews } from "../services/localData";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import BeritaDetail from "./BeritaDetail";
import ReactionButton from "./ReactionButton";
import AICaptionGenerator from "./AICaptionGenerator";
import { Sparkles } from "lucide-react";

export default function Berita() {
  const [news, setNews]       = useState(() => getStoredNews());
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const [captionFor, setCaptionFor] = useState(null);
  const visibleNews = showAll ? news : news.slice(0, 3);

  useEffect(() => {
    const syncNews = () => setNews(getStoredNews());
    window.addEventListener("koni-news-updated", syncNews);
    return () => window.removeEventListener("koni-news-updated", syncNews);
  }, []);

  return (
    <section id="berita" style={{ background: COLORS.gray, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="berita-header">
          <FadeIn>
            <div>
              <SectionLabel label="Berita & Informasi" />
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.navy, margin: "0 0 0.5rem" }}>
                Berita Terkini
              </h2>
              <GoldDivider />
            </div>
          </FadeIn>
          <FadeIn>
            <button type="button" onClick={() => setShowAll(!showAll)} style={{
              background: "transparent", border: "none",
              borderBottom: `2px solid ${COLORS.merah}`, color: COLORS.merah,
              cursor: "pointer", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.1em", padding: "0 0 2px",
              textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              {showAll ? "Tampilkan Sedikit" : "Lihat Semua"}
            </button>
          </FadeIn>
        </div>

        <div className="berita-grid">
          {visibleNews.map((berita, i) => (
            <FadeIn key={berita.judul} delay={i * 0.12}>
              <div style={{
                background: COLORS.putih,
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 12, overflow: "hidden",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                {/* Thumbnail */}
                <div
                  onClick={() => setSelected(berita)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
                    height: 160, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 56, cursor: "pointer", position: "relative",
                  }}
                >
                  {berita.img}
                  <div style={{ position: "absolute", top: 12, left: 12, background: COLORS.merah, borderRadius: 100, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {berita.kategori}
                  </div>
                  <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.5)", borderRadius: 100, color: "rgba(255,255,255,0.8)", fontSize: 9, padding: "3px 8px" }}>
                    📖 3 menit
                  </div>
                </div>

                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    📅 {berita.tanggal}
                  </div>
                  <h3
                    onClick={() => setSelected(berita)}
                    style={{ color: COLORS.navy, fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: "0 0 0.75rem", cursor: "pointer" }}
                  >
                    {berita.judul}
                  </h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: "0 0 1rem" }}>
                    {berita.deskripsi}
                  </p>

                  {/* Bottom row: reactions + AI caption */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <ReactionButton itemId={`berita-${i}`} />
                    <button
                      onClick={() => setCaptionFor(berita)}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "rgba(79,70,229,0.08)",
                        border: "1px solid rgba(79,70,229,0.2)",
                        borderRadius: 100, padding: "4px 10px",
                        color: "#7C3AED", fontSize: 10, fontWeight: 700,
                        cursor: "pointer", transition: "all 0.15s",
                        letterSpacing: "0.05em",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
                    >
                      <Sparkles size={10} /> Caption AI
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {selected && <BeritaDetail berita={selected} onClose={() => setSelected(null)} />}
      {captionFor && (
        <AICaptionGenerator
          type="berita"
          data={{ judul: captionFor.judul, kategori: captionFor.kategori }}
          onClose={() => setCaptionFor(null)}
        />
      )}
    </section>
  );
}
