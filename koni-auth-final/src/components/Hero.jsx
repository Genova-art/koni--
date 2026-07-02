import { useState, useEffect, useRef } from "react";
import { COLORS } from "../data/constants";

const slides = [
  {
    tag: "Kebanggaan Bangsa",
    title: "Mengukir Prestasi",
    sub: "di Kancah Dunia",
    desc: "Membangun olahraga Indonesia yang berprestasi, berkarakter, dan bermartabat di tingkat nasional maupun internasional.",
    image: "/images/hero1.svg",
    fallbackGradient: "linear-gradient(135deg, #0A1628 0%, #1a0a0a 50%, #0d1a2e 100%)",
    bgGradient: "linear-gradient(135deg, #0d2137 0%, #1a0a1a 40%, #0a1628 70%, #12052a 100%)",
    glowColor: "#CC0000",
    accentColor: "#F4C300",
  },
  {
    tag: "SEA Games 2026",
    title: "Merah Putih",
    sub: "Berkibar Tinggi",
    desc: "Kontingen Indonesia siap berjuang membawa nama bangsa dengan penuh semangat dan dedikasi tanpa batas.",
    image: "/images/hero2.svg",
    fallbackGradient: "linear-gradient(135deg, #0d1c35 0%, #1a0505 50%, #0a1020 100%)",
    bgGradient: "linear-gradient(135deg, #1a0a0a 0%, #2d0808 35%, #0d1c35 70%, #0a1628 100%)",
    glowColor: "#E74C3C",
    accentColor: "#F4C300",
  },
  {
    tag: "Program Nasional",
    title: "Generasi Emas",
    sub: "Indonesia 2045",
    desc: "Pembinaan atlet sejak dini untuk melahirkan juara-juara yang akan membawa kejayaan Indonesia ke depan.",
    image: "/images/hero3.svg",
    fallbackGradient: "linear-gradient(135deg, #0a1628 0%, #2a1500 50%, #0d1c35 100%)",
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #1a2a00 35%, #0d2137 70%, #1a0a05 100%)",
    glowColor: "#F4C300",
    accentColor: "#CC0000",
  },
];

export default function Hero({ onOpenRegister }) {
  const [count, setCount]       = useState(0);
  const [scrollY, setScrollY]   = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const prevCount = useRef(0);

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCount(c => (c + 1) % slides.length);
        setTextVisible(true);
      }, 350);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Parallax scroll
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const slide = slides[count];
  const parallaxBg = scrollY * 0.4;   // background moves slower
  const parallaxText = scrollY * 0.18; // text moves even slower

  return (
    <section
      id="beranda"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 106, // navbar 72 + ticker 34
      }}
    >
      {/* Parallax background */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `translateY(${parallaxBg}px)`,
        willChange: "transform",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: slide.fallbackGradient }} />
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg,rgba(10,22,40,0.45) 0%,rgba(19,32,64,0.35) 40%,rgba(13,15,28,0.45) 70%,rgba(16,10,20,0.65) 100%)",
        }} />
      </div>

      {/* Decorative grid — moves at different speed */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(184,150,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        transform: `translateY(${scrollY * 0.1}px)`,
        willChange: "transform",
      }} />

      {/* Floating orbs — parallax at different rates */}
      <div style={{
        position: "absolute", right: "8%", top: "20%",
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(204,0,0,0.08) 0%, transparent 70%)",
        transform: `translateY(${scrollY * 0.22}px)`,
        willChange: "transform",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "5%", bottom: "25%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,150,12,0.07) 0%, transparent 70%)",
        transform: `translateY(${scrollY * 0.3}px)`,
        willChange: "transform",
        pointerEvents: "none",
      }} />

      {/* Content — slowest parallax */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
        width: "100%",
        position: "relative", zIndex: 2,
        transform: `translateY(${parallaxText}px)`,
        willChange: "transform",
      }}>
        <div style={{ maxWidth: 700 }}>
          {/* Tag */}
          <div style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${COLORS.gold}40`,
              borderRadius: 100,
              padding: "7px 16px",
              marginBottom: "1.5rem",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.merah, boxShadow: `0 0 8px ${COLORS.merah}` }} />
              <span style={{ fontSize: 10, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {slide.tag}
              </span>
            </div>
          </div>

          {/* Headline */}
          <div style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.45s ease 0.06s, transform 0.45s ease 0.06s",
          }}>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              margin: "0 0 0.25rem",
              letterSpacing: "-0.01em",
            }}>
              {slide.title}
            </h1>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 700,
              background: `linear-gradient(90deg, ${COLORS.gold}, #F59E0B)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              margin: "0 0 1.5rem",
            }}>
              {slide.sub}
            </h1>
          </div>

          {/* Desc */}
          <div style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.5s ease 0.12s, transform 0.5s ease 0.12s",
          }}>
            <p style={{
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              maxWidth: 540,
            }}>
              {slide.desc}
            </p>
          </div>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap",
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(26px)",
            transition: "opacity 0.55s ease 0.18s, transform 0.55s ease 0.18s",
          }}>
            <button onClick={onOpenRegister} style={{
              padding: "14px 32px",
              background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              color: "#fff",
              border: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: 6,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(204,0,0,0.45)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(204,0,0,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(204,0,0,0.45)"; }}
            >
              Daftar Anggota
            </button>
            <a href="#profil" style={{
              padding: "14px 32px",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 6,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
            >
              Tentang KONI
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators — no parallax */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 3,
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setTextVisible(false); setTimeout(() => { setCount(i); setTextVisible(true); }, 300); }} style={{
            width: i === count ? 28 : 8,
            height: 8, borderRadius: 4,
            background: i === count ? COLORS.gold : "rgba(255,255,255,0.3)",
            border: "none", cursor: "pointer", padding: 0,
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: 28, right: 32,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: scrollY > 50 ? 0 : 0.5,
        transition: "opacity 0.3s",
        zIndex: 3,
      }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }} />
      </div>
    </section>
  );
}
