import { useState } from "react";
import { useThemeColor, THEMES } from "../context/ThemeColorContext";
import { COLORS } from "../data/constants";
import { Palette, Check } from "lucide-react";

export default function ThemePicker() {
  const { themeKey, setThemeKey } = useThemeColor();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(p => !p)}
        title="Pilih Tema Warna"
        style={{
          width: 38, height: 38, borderRadius: 8,
          background: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${open ? COLORS.gold + "60" : "rgba(255,255,255,0.12)"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        <Palette size={16} color={open ? COLORS.gold : "rgba(255,255,255,0.7)"} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "linear-gradient(160deg, #0F1E38, #162A50)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12, padding: "1rem",
          width: 200, zIndex: 5000,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          animation: "slideUpModal 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Tema Warna
          </div>
          {Object.entries(THEMES).map(([key, t]) => (
            <button key={key} onClick={() => { setThemeKey(key); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "9px 10px", borderRadius: 8,
              background: themeKey === key ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${themeKey === key ? COLORS.gold + "40" : "transparent"}`,
              cursor: "pointer", transition: "all 0.15s",
              marginBottom: 4,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = themeKey === key ? "rgba(255,255,255,0.08)" : "transparent"}
            >
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.primary, border: `2px solid ${t.gold}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: themeKey === key ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: themeKey === key ? 700 : 400, flex: 1, textAlign: "left" }}>
                {t.label}
              </span>
              {themeKey === key && <Check size={12} color={COLORS.gold} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
