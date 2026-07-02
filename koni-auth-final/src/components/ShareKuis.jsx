import { useRef, useState } from "react";
import { COLORS } from "../data/constants";
import { X, Share2, Copy, Check } from "lucide-react";

export default function ShareKuis({ skor, benar, total, maxStreak, rating, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = 600;
    canvas.height = 380;
    const ctx = canvas.getContext("2d");

    // BG gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 380);
    grad.addColorStop(0, "#0A1628");
    grad.addColorStop(0.5, "#132040");
    grad.addColorStop(1, "#0A1628");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 600, 380, 20);
    ctx.fill();

    // Gold border
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 592, 372, 18);
    ctx.stroke();

    // Red accent top
    const topGrad = ctx.createLinearGradient(0, 0, 600, 0);
    topGrad.addColorStop(0, COLORS.merah);
    topGrad.addColorStop(1, "#8B0000");
    ctx.fillStyle = topGrad;
    ctx.roundRect(4, 4, 592, 56, [18, 18, 0, 0]);
    ctx.fill();

    // KONI header text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Georgia, serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("KONI PUSAT", 24, 36);
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.letterSpacing = "1px";
    ctx.fillText("Kuis Olahraga Indonesia", 24, 52);

    // Trophy emoji
    ctx.font = "40px serif";
    ctx.fillText("🏆", 520, 50);

    // Score
    ctx.font = "bold 72px Georgia, serif";
    const scoreGrad = ctx.createLinearGradient(0, 90, 0, 175);
    scoreGrad.addColorStop(0, COLORS.gold);
    scoreGrad.addColorStop(1, "#F59E0B");
    ctx.fillStyle = scoreGrad;
    ctx.fillText(skor, 40, 175);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("POIN", 40, 200);

    // Divider
    ctx.strokeStyle = `${COLORS.gold}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 216);
    ctx.lineTo(560, 216);
    ctx.stroke();

    // Stats row
    const stats = [
      { label: "Jawaban Benar", val: `${benar}/${total}` },
      { label: "Streak Terbaik", val: `${maxStreak}🔥` },
      { label: "Rating", val: rating },
    ];
    stats.forEach((s, i) => {
      const x = 40 + i * 190;
      ctx.font = "bold 20px Georgia, serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(s.val, x, 255);
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(s.label.toUpperCase(), x, 272);
    });

    // Footer
    ctx.font = "11px sans-serif";
    ctx.fillStyle = COLORS.gold;
    ctx.fillText("koni.or.id · #KONIBerprestasi · #OlahragaIndonesia", 40, 350);

    // Dots decoration
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(520 + i * 12, 340, 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 2 ? COLORS.merah : i === 1 || i === 3 ? COLORS.gold : "rgba(255,255,255,0.2)";
      ctx.fill();
    }

    setGenerated(true);
  };

  const handleCopy = () => {
    const text = `🏆 Saya dapat ${skor} poin di Kuis Olahraga KONI!\n✅ ${benar}/${total} jawaban benar\n🔥 Streak terbaik: ${maxStreak}\n🥇 Rating: ${rating}\n\nCoba juga di koni.or.id #KONIBerprestasi`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Caption tersalin untuk share! 📤", type: "success" } }));
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 6000,
        background: "rgba(5,10,20,0.9)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <div style={{
        maxWidth: 500, width: "100%",
        background: "linear-gradient(160deg, #0A1628, #132040)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Share2 size={16} color="#fff" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Bagikan Hasil Kuis</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Preview card */}
          <div style={{
            background: "linear-gradient(135deg, #0A1628, #1E3A5F)",
            border: `2px solid ${COLORS.gold}40`,
            borderRadius: 12, padding: "1.5rem",
            marginBottom: "1.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})` }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontSize: 9, color: COLORS.gold, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>KONI PUSAT · Kuis Olahraga</div>
                <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.gold, fontFamily: "Georgia, serif", lineHeight: 1 }}>{skor}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Poin</div>
              </div>
              <div style={{ fontSize: 44 }}>🏆</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {[
                { v: `${benar}/${total}`, l: "Benar" },
                { v: `${maxStreak}🔥`, l: "Streak" },
                { v: rating.split(" ")[0], l: "Rating" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 9, color: COLORS.gold, letterSpacing: "0.12em" }}>koni.or.id · #KONIBerprestasi</div>
          </div>

          {/* Hidden canvas for generation */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={handleCopy} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              border: `1px solid ${COLORS.gold}40`,
              borderRadius: 10, padding: "12px",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(204,0,0,0.3)",
              transition: "all 0.2s",
            }}>
              {copied ? <><Check size={15} /> Caption Tersalin!</> : <><Copy size={15} /> Salin Caption untuk Share</>}
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "💬", label: "WhatsApp", color: "#25D366", url: `https://wa.me/?text=${encodeURIComponent(`🏆 Saya dapat ${skor} poin di Kuis Olahraga KONI!\n✅ ${benar}/${total} benar · 🔥 Streak ${maxStreak}\nCoba juga di koni.or.id`)}` },
                { icon: "𝕏", label: "Twitter/X", color: "#1DA1F2", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Saya dapat ${skor} poin di Kuis Olahraga @KONI_Pusat! ${benar}/${total} benar 🏆 #KONIBerprestasi #OlahragaIndonesia`)}` },
              ].map(s => (
                <button key={s.label} onClick={() => window.open(s.url, "_blank")} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: `${s.color}15`, border: `1px solid ${s.color}30`,
                  borderRadius: 10, padding: "11px",
                  color: s.color, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${s.color}25`}
                  onMouseLeave={e => e.currentTarget.style.background = `${s.color}15`}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
