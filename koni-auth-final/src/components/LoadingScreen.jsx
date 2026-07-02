import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";

const LOGO_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='98' fill='%23fff' stroke='%23CC0000' stroke-width='3'/%3E%3C!-- Api/Obor --%3E%3Cpath d='M100 18 C97 30 88 35 89 46 C90 57 100 63 100 63 C100 63 110 57 111 46 C112 35 103 30 100 18Z' fill='%23CC0000'/%3E%3Cpath d='M100 28 C98 37 93 40 94 47 C95 53 100 57 100 57 C100 57 105 53 106 47 C107 40 102 37 100 28Z' fill='%23F4C300'/%3E%3C!-- Sayap kiri --%3E%3Cpath d='M100 62 C91 58 79 54 69 47 C62 42 58 36 60 31 C63 37 70 42 79 47 C88 52 95 59 100 62Z' fill='%23CC0000'/%3E%3Cpath d='M100 62 C90 57 76 51 65 42 C58 36 56 28 59 23 C61 30 68 36 77 42 C86 48 94 57 100 62Z' fill='%238B0000' opacity='.55'/%3E%3Cpath d='M100 69 C90 67 77 64 67 57 C60 52 57 45 59 40 C63 46 71 50 80 54 C89 58 95 65 100 69Z' fill='%23CC0000' opacity='.8'/%3E%3C!-- Sayap kanan --%3E%3Cpath d='M100 62 C109 58 121 54 131 47 C138 42 142 36 140 31 C137 37 130 42 121 47 C112 52 105 59 100 62Z' fill='%23CC0000'/%3E%3Cpath d='M100 62 C110 57 124 51 135 42 C142 36 144 28 141 23 C139 30 132 36 123 42 C114 48 106 57 100 62Z' fill='%238B0000' opacity='.55'/%3E%3Cpath d='M100 69 C110 67 123 64 133 57 C140 52 143 45 141 40 C137 46 129 50 120 54 C111 58 105 65 100 69Z' fill='%23CC0000' opacity='.8'/%3E%3C!-- Teks INDONESIA --%3E%3Ctext x='100' y='95' text-anchor='middle' font-family='Arial,sans-serif' font-size='12' font-weight='bold' fill='%23CC0000' letter-spacing='2'%3EINDONESIA%3C/text%3E%3Cline x1='30' y1='101' x2='170' y2='101' stroke='%23CC0000' stroke-width='1' opacity='.35'/%3E%3C!-- Cincin Olimpik --%3E%3Ccircle cx='47' cy='133' r='16' fill='none' stroke='%230085C7' stroke-width='5'/%3E%3Ccircle cx='74' cy='133' r='16' fill='none' stroke='%23F4C300' stroke-width='5'/%3E%3Ccircle cx='101' cy='133' r='16' fill='none' stroke='%23333' stroke-width='5'/%3E%3Ccircle cx='128' cy='133' r='16' fill='none' stroke='%23009F3D' stroke-width='5'/%3E%3Ccircle cx='155' cy='133' r='16' fill='none' stroke='%23DF0024' stroke-width='5'/%3E%3C/svg%3E";

const TIPS = [
  "Purwokerto — Kota Satria yang melahirkan juara-juara olahraga",
  "KONI Cabang Purwokerto menaungi atlet berprestasi Kabupaten Banyumas",
  "Bersama membangun generasi emas olahraga Purwokerto",
  "Prestasi dimulai dari kedisiplinan dan semangat juang tanpa henti",
];

// Particle dots for cinematic effect
const Particles = () => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    opacity: Math.random() * 0.4 + 0.1,
  }));
  return (
    <>
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.id % 3 === 0 ? COLORS.gold : d.id % 3 === 1 ? COLORS.merah : "#fff",
            opacity: d.opacity,
            animation: `twinkle ${d.duration}s ${d.delay}s ease-in-out infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [fadeOut, setFadeOut] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [phase, setPhase] = useState(0); // 0=intro, 1=main, 2=done

  useEffect(() => {
    // Phase 0 → 1 : reveal after short delay
    const phaseTimer = setTimeout(() => setPhase(1), 200);

    const steps = [
      { target: 25, delay: 300, duration: 500 },
      { target: 55, delay: 850, duration: 600 },
      { target: 80, delay: 1500, duration: 450 },
      { target: 100, delay: 2000, duration: 350 },
    ];

    const timers = steps.map(({ target, delay, duration }) =>
      setTimeout(() => {
        const startVal = target - 25 < 0 ? 0 : target - 25;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const pct = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - pct, 3);
          setProgress(Math.floor(startVal + eased * (target - startVal)));
          if (pct < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay)
    );

    const doneTimer = setTimeout(() => {
      setPhase(2);
      setFadeOut(true);
      setTimeout(onDone, 700);
    }, 2800);

    return () => {
      clearTimeout(phaseTimer);
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: `linear-gradient(165deg, #04091A 0%, #0A1628 40%, #132040 70%, #0D1C35 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
    }}>

      {/* ── Background layers ── */}

      {/* Fine grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(184,150,12,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(184,150,12,0.035) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      {/* Large radial glows */}
      <div style={{
        position: "absolute", right: "-5%", top: "5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(204,0,0,0.09) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "-5%", bottom: "5%",
        width: 450, height: 450, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,150,12,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,58,95,0.4) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Particles */}
      <Particles />

      {/* Horizontal scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${COLORS.gold}30 30%, ${COLORS.gold}60 50%, ${COLORS.gold}30 70%, transparent 100%)`,
        animation: "scanLine 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* ── Main content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center", padding: "0 2rem",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>

        {/* === LOGO RING === */}
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 2.5rem" }}>

          {/* Outermost slow ring */}
          <div style={{
            position: "absolute", inset: -22,
            border: `1px solid rgba(184,150,12,0.18)`,
            borderRadius: "50%",
            animation: "spin 18s linear infinite",
          }} />

          {/* Dashed ring */}
          <div style={{
            position: "absolute", inset: -12,
            border: `2px dashed rgba(184,150,12,0.30)`,
            borderRadius: "50%",
            animation: "spin 10s linear infinite",
          }} />

          {/* Solid accent ring */}
          <div style={{
            position: "absolute", inset: -4,
            border: `1.5px solid rgba(204,0,0,0.35)`,
            borderRadius: "50%",
            animation: "spin 6s linear infinite reverse",
          }} />

          {/* Corner ticks on the ring */}
          {[0, 90, 180, 270].map((deg) => (
            <div key={deg} style={{
              position: "absolute", inset: -4,
              borderRadius: "50%",
              animation: `spin 6s linear infinite reverse`,
            }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 6, height: 6,
                background: COLORS.gold,
                borderRadius: "50%",
                transform: `rotate(${deg}deg) translateX(${84}px) translateY(-50%)`,
              }} />
            </div>
          ))}

          {/* Logo circle - transparent background, cropped round */}
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "50%",
            background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            animation: "floatAnim 3.5s ease-in-out infinite",
            boxShadow: `0 0 30px rgba(184,150,12,0.2), 0 0 60px rgba(0,0,0,0.3)`,
          }}>
            {!logoError ? (
              <img
                src={LOGO_URL}
                alt="Logo KONI"
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  opacity: logoLoaded ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6))",
                }}
              />
            ) : (
              /* Fallback emblem if logo fails */
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="45" cy="45" r="38" fill={`url(#embG)`} />
                <path d="M45 20 C43 25 39 27 40 32 C41 37 45 39 45 39 C45 39 49 37 50 32 C51 27 47 25 45 20Z" fill={COLORS.gold} opacity="0.95"/>
                <rect x="43" y="39" width="4" height="14" rx="2" fill={COLORS.gold} opacity="0.9"/>
                <path d="M27 44 C25 41 26 37 29 36 C28 39 30 42 32 43Z" fill={COLORS.gold} opacity="0.75"/>
                <path d="M26 50 C23 47 23 43 26 42 C26 45 28 47 31 48Z" fill={COLORS.gold} opacity="0.75"/>
                <path d="M28 56 C25 55 24 51 27 50 C27 53 30 55 33 55Z" fill={COLORS.gold} opacity="0.75"/>
                <path d="M63 44 C65 41 64 37 61 36 C62 39 60 42 58 43Z" fill={COLORS.gold} opacity="0.75"/>
                <path d="M64 50 C67 47 67 43 64 42 C64 45 62 47 59 48Z" fill={COLORS.gold} opacity="0.75"/>
                <path d="M62 56 C65 55 66 51 63 50 C63 53 60 55 57 55Z" fill={COLORS.gold} opacity="0.75"/>
                <circle cx="37" cy="61" r="2.2" fill={COLORS.merah} />
                <circle cx="45" cy="63" r="2.8" fill={COLORS.merah} />
                <circle cx="53" cy="61" r="2.2" fill={COLORS.merah} />
                <defs>
                  <radialGradient id="embG" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={COLORS.navyLight} />
                    <stop offset="100%" stopColor={COLORS.navy} />
                  </radialGradient>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* === HEADER TEXT === */}
        {/* Thin top label */}
        <div style={{
          fontSize: 9, color: COLORS.gold,
          letterSpacing: "0.45em", fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: 10,
          animation: "fadeUp 0.6s ease 0.1s both",
          opacity: 0.75,
        }}>
          Komite Olahraga Nasional Indonesia
        </div>

        {/* Main title */}
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 30, fontWeight: 700,
          color: COLORS.putih,
          letterSpacing: "0.18em",
          marginBottom: 4,
          animation: "fadeUp 0.7s ease 0.25s both",
          textShadow: `0 0 40px rgba(184,150,12,0.35)`,
        }}>
          KONI CABANG
        </div>

        {/* Sub city */}
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 22, fontWeight: 700,
          background: `linear-gradient(90deg, ${COLORS.gold}, #F0D060, ${COLORS.gold})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.25em",
          marginBottom: "1.8rem",
          animation: "fadeUp 0.7s ease 0.4s both",
        }}>
          PURWOKERTO
        </div>

        {/* Ornament separator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          justifyContent: "center", marginBottom: "2rem",
          animation: "fadeUp 0.6s ease 0.55s both",
        }}>
          <div style={{ flex: 1, maxWidth: 60, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold}80)` }} />
          <div style={{ width: 4, height: 4, background: COLORS.gold, borderRadius: "50%", opacity: 0.7 }} />
          <div style={{ width: 8, height: 8, background: COLORS.merah, transform: "rotate(45deg)", boxShadow: `0 0 8px ${COLORS.merah}80` }} />
          <div style={{ width: 4, height: 4, background: COLORS.gold, borderRadius: "50%", opacity: 0.7 }} />
          <div style={{ flex: 1, maxWidth: 60, height: 1, background: `linear-gradient(90deg, ${COLORS.gold}80, transparent)` }} />
        </div>

        {/* === PROGRESS === */}
        <div style={{ width: 300, margin: "0 auto 1.5rem", animation: "fadeUp 0.6s ease 0.65s both" }}>

          {/* Track */}
          <div style={{
            height: 4, background: "rgba(255,255,255,0.07)",
            borderRadius: 99, overflow: "hidden",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: `linear-gradient(90deg, ${COLORS.merah} 0%, #E84040 30%, ${COLORS.gold} 70%, #F0D060 100%)`,
              width: `${progress}%`,
              transition: "width 0.18s ease",
              boxShadow: `0 0 12px ${COLORS.gold}70, 0 0 4px ${COLORS.merah}60`,
            }} />
          </div>

          {/* Label row */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 10, alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Animated dots */}
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: COLORS.gold,
                  animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite`,
                  opacity: 0.6,
                }} />
              ))}
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginLeft: 4 }}>
                Memuat...
              </span>
            </div>
            <span style={{
              fontSize: 13, color: COLORS.gold,
              fontWeight: 700, fontFamily: "Georgia, serif",
              letterSpacing: "0.05em",
            }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* === TIP === */}
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.28)",
          maxWidth: 320, margin: "0 auto",
          lineHeight: 1.7,
          animation: "fadeUp 0.6s ease 0.8s both",
          fontStyle: "italic",
          letterSpacing: "0.02em",
        }}>
          <span style={{ color: COLORS.gold, opacity: 0.7, marginRight: 4 }}>💡</span>
          {TIPS[tipIdx]}
        </div>

        {/* Bottom badge */}
        <div style={{
          marginTop: "2rem",
          fontSize: 8,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          animation: "fadeUp 0.6s ease 1s both",
        }}>
          Kabupaten Banyumas · Jawa Tengah
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.5); }
        }
        @keyframes scanLine {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 0.9; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
