import { useEffect, useState } from "react";
import { COLORS } from "../data/constants";
import { FadeIn } from "./UI";

const slides = [
  {
    label: "Prestasi Nasional",
    title: "Indonesia Menuju Emas",
    subtitle: "Program pembinaan atlet berkelas dunia",
    desc: "KONI mendukung setiap atlet dengan fasilitas modern, pelatih profesional, dan strategi latihan terdepan.",
    bgGradient: "linear-gradient(135deg, #1a3a6b 0%, #0d1c35 50%, #1a0a0a 100%)",
    glowColor: "#CC0000",
  },
  {
    label: "Generasi Emas",
    title: "Pelatihan Elite",
    subtitle: "Dari cabang hingga internasional",
    desc: "Para atlet binaan KONI dipersiapkan matang untuk kompetisi nasional dan kancah dunia.",
    bgGradient: "linear-gradient(135deg, #2d0808 0%, #0d1c35 50%, #0a2040 100%)",
    glowColor: "#E74C3C",
  },
  {
    label: "Kebanggaan Bangsa",
    title: "Semangat Juara",
    subtitle: "Bangkit bersama Merah Putih",
    desc: "Semangat nasionalisme dan karakter kuat menjadi pondasi prestasi atlet Indonesia.",
    bgGradient: "linear-gradient(135deg, #1a2a00 0%, #0a1628 50%, #1a0a0a 100%)",
    glowColor: "#F4C300",
  },
];

export default function Banner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((current) => (current + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "5rem 2rem",
        minHeight: "620px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.label}
          style={{
            position: "absolute", inset: 0,
            opacity: index === active ? 1 : 0,
            transition: "opacity 1.2s ease",
            zIndex: 0, overflow: "hidden",
            background: slide.bgGradient,
          }}
        >
          {/* Glow effect */}
          <div style={{
            position: "absolute", right: "-5%", top: "-20%",
            width: 700, height: 700, borderRadius: "50%",
            background: `radial-gradient(circle, ${slide.glowColor}40 0%, ${slide.glowColor}15 40%, transparent 70%)`,
            pointerEvents: "none",
          }}/>
          {/* Olympic rings */}
          <svg style={{ position:"absolute", right:"3%", bottom:"10%", opacity:0.18, width:280, height:105 }} xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="52" r="30" fill="none" stroke="#0085C7" strokeWidth="6"/>
            <circle cx="88" cy="52" r="30" fill="none" stroke="#F4C300" strokeWidth="6"/>
            <circle cx="141" cy="52" r="30" fill="none" stroke="#EEEEEE" strokeWidth="6"/>
            <circle cx="194" cy="52" r="30" fill="none" stroke="#009F3D" strokeWidth="6"/>
            <circle cx="247" cy="52" r="30" fill="none" stroke="#EE334E" strokeWidth="6"/>
          </svg>
          {/* Dot grid */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.05 }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="bdots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="1.2" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#bdots)"/>
          </svg>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,22,40,0.2), rgba(10,22,40,0.82) 55%, rgba(10,22,40,0.96) 100%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          zIndex: 1,
        }}
      />

      <FadeIn>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          <div style={{ color: COLORS.putih }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: `1px solid rgba(255,255,255,0.16)`,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.gold }} />
              {slides[active].label}
            </div>

            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)",
                lineHeight: 1.02,
                margin: 0,
                color: COLORS.putih,
              }}
            >
              {slides[active].title}
              <span style={{ display: "block", color: COLORS.merah, marginTop: 8 }}>
                {slides[active].subtitle}
              </span>
            </h2>

            <p
              style={{
                maxWidth: 520,
                marginTop: "1.6rem",
                color: "rgba(255,255,255,0.78)",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {slides[active].desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: "2.5rem" }}>
              <a
                href="#profil"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                  color: COLORS.putih,
                  padding: "14px 30px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
                }}
              >
                Lihat Program
              </a>
              <a
                href="#kontak"
                style={{
                  color: COLORS.putih,
                  padding: "14px 30px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  border: `1px solid rgba(255,255,255,0.28)`,
                }}
              >
                Hubungi Tim Kami
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "2rem" }}>
              <button
                onClick={() => setActive((active - 1 + slides.length) % slides.length)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                  color: COLORS.putih,
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                �
              </button>
              <button
                onClick={() => setActive((active + 1) % slides.length)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                  color: COLORS.putih,
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                �
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              padding: "2rem",
              borderRadius: 24,
              background: "rgba(255,255,255,0.08)",
              border: `1px solid rgba(255,255,255,0.14)`,
              boxShadow: "0 40px 80px rgba(0,0,0,0.28)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: COLORS.gold, textTransform: "uppercase" }}>
                Sorotan KPI
              </div>
              <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.putih }}>
                  <span>Cabang Olahraga Aktif</span>
                  <span style={{ fontWeight: 700 }}>67+</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.putih }}>
                  <span>Atlet Nasional</span>
                  <span style={{ fontWeight: 700 }}>4.200+</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.putih }}>
                  <span>Medali Internasional</span>
                  <span style={{ fontWeight: 700 }}>500+</span>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: 12, color: COLORS.gold, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.16em" }}>
                Highlight Program
              </div>
              <p style={{ margin: "1rem 0 0", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: 14 }}>
                Program talent scouting, pelatihan intensif, dan asuhan nutrisi eksklusif.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            style={{
              width: index === active ? 24 : 10,
              height: 10,
              borderRadius: 999,
              border: "none",
              background: index === active ? COLORS.gold : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
