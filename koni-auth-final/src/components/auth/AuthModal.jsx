import { useState, useEffect } from "react";
import { COLORS } from "../../data/constants";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

export default function AuthModal({ isOpen, onClose, initialView = "login" }) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(5,10,20,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeInOverlay 0.25s ease",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 460,
        maxHeight: "90vh", overflowY: "auto",
        background: `linear-gradient(160deg, ${COLORS.navyMid} 0%, ${COLORS.navy} 60%, #0f0a18 100%)`,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: "2rem",
        position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(184,150,12,0.1)",
        animation: "slideUpModal 0.3s ease",
      }}>
        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
          borderRadius: 1,
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            width: 32, height: 32, borderRadius: 8,
            cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ✕
        </button>

        {/* Views */}
        {view === "login" && (
          <LoginPage
            onClose={onClose}
            onSwitchRegister={() => setView("register")}
            onSwitchReset={() => setView("forgot")}
          />
        )}
        {view === "register" && (
          <RegisterPage onSwitchLogin={() => setView("login")} />
        )}
        {view === "forgot" && (
          <ForgotPasswordPage onSwitchLogin={() => setView("login")} />
        )}

        {/* Bottom KONI badge */}
        <div style={{
          marginTop: "1.5rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: 0.35,
        }}>
          <span style={{ fontSize: 12 }}>🏆</span>
          <span style={{ fontSize: 10, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            KONI PUSAT © 2026
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpModal { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
