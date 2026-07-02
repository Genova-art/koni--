import { useEffect, useRef, useState } from "react";
import { COLORS } from "../data/constants";
import { ArrowUp } from "lucide-react";

export function useScrollAnimation() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function FadeIn({ children, delay = 0, style = {}, direction = "up" }) {
  const [ref, visible] = useScrollAnimation();
  const transforms = {
    up: "translateY(36px)",
    down: "translateY(-36px)",
    left: "translateX(-36px)",
    right: "translateX(36px)",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0)" : transforms[direction],
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1rem 0 2rem" }}>
      <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${COLORS.gold}, transparent)` }} />
      <div style={{ width: 8, height: 8, background: COLORS.gold, transform: "rotate(45deg)", boxShadow: `0 0 8px ${COLORS.gold}` }} />
      <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold})` }} />
    </div>
  );
}

export function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{
        width: 3, height: 18,
        background: `linear-gradient(180deg, ${COLORS.merah}, #FF4444)`,
        borderRadius: 2,
        boxShadow: "0 0 8px rgba(204,0,0,0.5)",
      }} />
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
        color: COLORS.gold, textTransform: "uppercase", fontFamily: "serif",
      }}>
        {label}
      </span>
    </div>
  );
}

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 400);
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Kembali ke atas"
      style={{
        position: "fixed", bottom: 32, right: 32, zIndex: 999,
        width: 52, height: 52, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`,
        border: "none",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        transition: "transform 0.2s, box-shadow 0.2s",
        padding: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.06)"; e.currentTarget.style.boxShadow = `0 12px 40px rgba(204,0,0,0.35)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"; }}
    >
      {/* Progress ring */}
      <svg width="52" height="52" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
        <circle cx="26" cy="26" r={r} fill="none"
          stroke={`url(#ringGrad)`} strokeWidth="3"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.1s" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="1" y1="0" x2="0" y2="1">
            <stop stopColor={COLORS.merah} />
            <stop offset="1" stopColor={COLORS.gold} />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp size={18} color="#fff" strokeWidth={2.5} />
    </button>
  );
}

export function GlowCard({ children, style = {}, hoverGlow = "rgba(184,150,12,0.15)" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: hovered ? `0 16px 48px ${hoverGlow}, 0 0 0 1px rgba(184,150,12,0.2)` : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
