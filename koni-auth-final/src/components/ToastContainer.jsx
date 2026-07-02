import { useContext, useState } from "react";
import { ToastContext } from "../context/ToastContext";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const TOAST_CONFIG = {
  success: { bg: "linear-gradient(135deg,#064E3B,#065F46)", border: "#22C55E", icon: <CheckCircle size={16} />, iconColor: "#4ADE80" },
  error:   { bg: "linear-gradient(135deg,#7C0000,#991B1B)", border: "#EF4444", icon: <AlertCircle size={16} />, iconColor: "#FCA5A5" },
  warning: { bg: "linear-gradient(135deg,#78350F,#92400E)", border: "#F59E0B", icon: <AlertTriangle size={16} />, iconColor: "#FCD34D" },
  info:    { bg: "linear-gradient(135deg,#0A1628,#132040)",  border: "#3B82F6", icon: <Info size={16} />, iconColor: "#93C5FD" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div style={{
      position: "fixed", top: 120, right: 20,
      zIndex: 9998, display: "flex",
      flexDirection: "column", gap: 10,
      maxWidth: 360, pointerEvents: "none",
    }}>
      {toasts.map((toast) => {
        const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
        return (
          <div key={toast.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            background: cfg.bg,
            border: `1px solid ${cfg.border}40`,
            borderLeft: `3px solid ${cfg.border}`,
            color: "#fff",
            padding: "13px 14px",
            borderRadius: 10,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}20`,
            animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "all",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
            <span style={{ flex: 1, fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>
              {toast.message || toast.msg}
            </span>
            <button onClick={() => removeToast(toast.id)} style={{
              background: "rgba(255,255,255,0.1)", border: "none",
              color: "rgba(255,255,255,0.6)", cursor: "pointer",
              borderRadius: 4, width: 22, height: 22,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-380px); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(380px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
