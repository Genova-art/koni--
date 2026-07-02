import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { Accessibility, Type, Contrast, Eye, ZapOff } from "lucide-react";

export default function AccessibilityMenu() {
  const [open, setOpen]           = useState(false);
  const [fontSize, setFontSize]   = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute("data-high-contrast", highContrast ? "true" : "false");
    if (highContrast) {
      document.documentElement.style.setProperty("--force-contrast", "1");
    } else {
      document.documentElement.style.removeProperty("--force-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      const style = document.createElement("style");
      style.id = "reduced-motion-style";
      style.textContent = `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }`;
      document.head.appendChild(style);
    } else {
      document.getElementById("reduced-motion-style")?.remove();
    }
    return () => document.getElementById("reduced-motion-style")?.remove();
  }, [reducedMotion]);

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setReducedMotion(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 100, left: 24, zIndex: 997 }}>
      <button
        onClick={() => setOpen(p => !p)}
        title="Aksesibilitas"
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: open ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : "rgba(10,22,40,0.9)",
          border: `2px solid ${open ? COLORS.gold : "rgba(255,255,255,0.2)"}`,
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "none"}
      >
        <Accessibility size={20} />
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: 0,
          width: 260,
          background: "linear-gradient(160deg, #0A1628, #132040)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
          animation: "slideUpModal 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Accessibility size={14} color="#fff" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>AKSESIBILITAS</span>
          </div>

          <div style={{ padding: "1rem" }}>
            {/* Font size */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Type size={13} color={COLORS.gold} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ukuran Font</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>{fontSize}%</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[80, 90, 100, 115, 130].map(size => (
                  <button key={size} onClick={() => setFontSize(size)} style={{
                    flex: 1, padding: "6px 0", borderRadius: 6,
                    background: fontSize === size ? COLORS.merah : "rgba(255,255,255,0.06)",
                    border: `1px solid ${fontSize === size ? COLORS.merah : "rgba(255,255,255,0.1)"}`,
                    color: "#fff", fontSize: 10, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>{size}%</button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            {[
              { icon: <Contrast size={13} />, label: "Kontras Tinggi", val: highContrast, set: setHighContrast },
              { icon: <ZapOff size={13} />, label: "Kurangi Animasi", val: reducedMotion, set: setReducedMotion },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: item.val ? COLORS.gold : "rgba(255,255,255,0.4)" }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: item.val ? "#fff" : "rgba(255,255,255,0.55)" }}>{item.label}</span>
                </div>
                <button onClick={() => item.set(p => !p)} style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: item.val ? COLORS.merah : "rgba(255,255,255,0.1)",
                  border: "none", cursor: "pointer",
                  position: "relative", transition: "background 0.2s",
                }}>
                  <div style={{
                    position: "absolute", top: 2,
                    left: item.val ? 20 : 2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </button>
              </div>
            ))}

            <button onClick={resetAll} style={{
              width: "100%", marginTop: 10, padding: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "rgba(255,255,255,0.4)",
              fontSize: 11, cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              Reset ke Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
