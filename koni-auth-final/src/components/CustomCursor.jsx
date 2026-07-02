import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";

export default function CustomCursor() {
  const [pos, setPos]         = useState({ x: -100, y: -100 });
  const [trail, setTrail]     = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.documentElement.style.cursor = "none";

    let animFrame;
    let trailX = -100, trailY = -100;
    let curX = -100, curY = -100;

    const onMove = (e) => {
      curX = e.clientX;
      curY = e.clientY;
      setPos({ x: curX, y: curY });
      setVisible(true);
    };

    const animate = () => {
      trailX += (curX - trailX) * 0.12;
      trailY += (curY - trailY) * 0.12;
      setTrail({ x: trailX, y: trailY });
      animFrame = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const role = e.target.getAttribute("role");
      const isInteractive = ["a","button","input","textarea","select","label"].includes(tag)
        || role === "button"
        || e.target.style.cursor === "pointer"
        || e.target.closest("button, a, [role=button]");
      setHovering(!!isInteractive);
    };

    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnterDoc = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnterDoc);
    animFrame = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnterDoc);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Hide on mobile / touch
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  if (isMobile) return null;

  const opacity = visible ? 1 : 0;

  return (
    <>
      {/* Trailing ring */}
      <div style={{
        position: "fixed",
        left: trail.x,
        top: trail.y,
        width: hovering ? 44 : 36,
        height: hovering ? 44 : 36,
        borderRadius: "50%",
        border: `1.5px solid ${hovering ? COLORS.gold : COLORS.merah}`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99998,
        opacity: opacity * (hovering ? 0.9 : 0.5),
        transition: "width 0.2s, height 0.2s, border-color 0.2s, opacity 0.15s",
        mixBlendMode: "difference",
      }} />

      {/* Dot cursor */}
      <div style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: clicking ? 6 : hovering ? 10 : 8,
        height: clicking ? 6 : hovering ? 10 : 8,
        borderRadius: "50%",
        background: hovering ? COLORS.gold : "#fff",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
        opacity,
        transition: "width 0.15s, height 0.15s, background 0.2s, opacity 0.1s",
        boxShadow: hovering ? `0 0 12px ${COLORS.gold}` : "none",
      }} />
    </>
  );
}
