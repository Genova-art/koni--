import { useEffect, useRef } from "react";

const COLORS_LIST = ["#CC0000","#B8960C","#D4AF37","#fff","#FFD700","#FF4444","#FFA500"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

export default function Konfeti({ active, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const pieces = Array.from({ length: 140 }, () => ({
      x: randomBetween(0, canvas.width),
      y: randomBetween(-canvas.height * 0.3, -10),
      w: randomBetween(6, 14),
      h: randomBetween(10, 20),
      color: COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)],
      vx: randomBetween(-2, 2),
      vy: randomBetween(2, 6),
      rot: randomBetween(0, Math.PI * 2),
      vrot: randomBetween(-0.08, 0.08),
      opacity: 1,
    }));

    let frame;
    let elapsed = 0;

    const draw = () => {
      elapsed++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.08; // gravity
        p.rot += p.vrot;
        if (elapsed > 90) p.opacity = Math.max(0, p.opacity - 0.008);
        if (p.y < canvas.height + 20 && p.opacity > 0) alive++;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive > 0) { frame = requestAnimationFrame(draw); }
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); onDone?.(); }
    };

    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  }, [active]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 9997,
      pointerEvents: "none",
      opacity: active ? 1 : 0,
    }} />
  );
}
