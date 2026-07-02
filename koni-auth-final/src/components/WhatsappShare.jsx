import { useState } from "react";
import { COLORS } from "../data/constants";
import { X, Copy, Check } from "lucide-react";

const SITE_URL = "https://koni.or.id";

function MiniQR({ size = 80 }) {
  const cells = 7;
  const cell = size / cells;
  const pat = [1,1,1,1,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,1,1,1,0,1, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" rx="6" />
      {pat.map((on, i) => on && (
        <rect key={i} x={(i%cells)*cell+1} y={Math.floor(i/cells)*cell+1} width={cell-1.5} height={cell-1.5} fill="#0A1628" rx="1" />
      ))}
    </svg>
  );
}

export default function WhatsappShare() {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);

  const waText = encodeURIComponent(`🏆 KONI Pusat — Website Resmi Komite Olahraga Nasional Indonesia\n\nTemukan info terbaru:\n🏅 Berita olahraga nasional\n📅 Jadwal kompetisi & countdown\n🗺️ Peta KONI 34 Provinsi\n🎮 Kuis olahraga interaktif\n\n${SITE_URL}`);

  const copyLink = () => {
    navigator.clipboard?.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Link website KONI tersalin! 🔗", type: "success" } }));
  };

  return (
    <div style={{ position: "fixed", bottom: 156, right: 32, zIndex: 996 }}>
      {/* Popup */}
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", right: 0,
          width: 280,
          background: "linear-gradient(160deg, #0A1628, #132040)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          animation: "slideUpModal 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #064E3B, #065F46)",
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>💬</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Bagikan Website</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={12} />
            </button>
          </div>

          <div style={{ padding: "1.25rem" }}>
            {/* QR code */}
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "inline-block", background: "#fff", borderRadius: 12, padding: 10, border: `2px solid ${COLORS.gold}40` }}>
                <MiniQR size={80} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Scan QR untuk buka website</div>
            </div>

            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 12, fontFamily: "monospace" }}>
              {SITE_URL}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)",
                borderRadius: 8, padding: "10px",
                color: "#4ADE80", fontSize: 12, fontWeight: 700,
                textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.12)"}
              >
                💬 Bagikan via WhatsApp
              </a>
              <button onClick={copyLink} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "10px",
                color: copied ? "#4ADE80" : "rgba(255,255,255,0.7)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>
                {copied ? <><Check size={13} /> Tersalin!</> : <><Copy size={13} /> Salin Link</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Bagikan Website"
        style={{
          width: 46, height: 46, borderRadius: "50%",
          background: open ? `linear-gradient(135deg, ${COLORS.navyMid}, ${COLORS.navy})` : "linear-gradient(135deg, #25D366, #128C7E)",
          border: `2px solid ${open ? COLORS.gold + "60" : "rgba(255,255,255,0.3)"}`,
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
          transition: "all 0.2s", fontSize: 18,
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "none"}
      >
        {open ? <X size={18} /> : "💬"}
      </button>
    </div>
  );
}
