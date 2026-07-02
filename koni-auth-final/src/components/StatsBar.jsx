import { useState, useEffect, useRef } from "react";
import { COLORS, statsData } from "../data/constants";
import { Trophy, Users, MapPin, Medal } from "lucide-react";

// Map lucide icons to each stat
const STAT_ICONS = [
  <Trophy size={32} strokeWidth={1.5} />,
  <Users size={32} strokeWidth={1.5} />,
  <MapPin size={32} strokeWidth={1.5} />,
  <Medal size={32} strokeWidth={1.5} />,
];

const STAT_COLORS = [COLORS.gold, "#60A5FA", "#34D399", COLORS.merah];

function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const numTarget = parseInt(target.replace(/\D/g, "")) || 0;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target]);
  return count;
}

function StatItem({ stat, index, started }) {
  const num = useCountUp(stat.angka, 1800, started);
  const hasSuffix = stat.angka.includes("+");
  const display = started ? `${num.toLocaleString("id-ID")}${hasSuffix ? "+" : ""}` : "0";
  const color = STAT_COLORS[index];

  return (
    <div style={{
      textAlign: "center",
      opacity: started ? 1 : 0,
      transform: started ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.14}s`,
      padding: "1.5rem 1rem",
      borderRadius: 14,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}25`,
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = started ? "translateY(0)" : "translateY(24px)"; }}
    >
      {/* Glow top */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
        color,
        transition: "all 0.3s",
      }}>
        {STAT_ICONS[index]}
      </div>

      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: 8,
        letterSpacing: "-0.01em",
      }}>
        {display}
      </div>
      <div style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.45)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}>
        {stat.satuan}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 50%, ${COLORS.navyLight} 100%)`,
      padding: "4rem 2rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(184,150,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div className="stats-grid">
          {statsData.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
