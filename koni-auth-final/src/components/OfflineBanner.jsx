import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineBanner() {
  const [online, setOnline]   = useState(navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const goOffline = () => setOnline(false);
    const goOnline  = () => {
      setOnline(true);
      setShowBack(true);
      setTimeout(() => setShowBack(false), 3000);
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online",  goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online",  goOnline);
    };
  }, []);

  if (online && !showBack) return null;

  return (
    <div style={{
      position: "fixed", top: 72, left: 0, right: 0,
      zIndex: 9995,
      background: online
        ? "linear-gradient(90deg, #064E3B, #065F46)"
        : "linear-gradient(90deg, #7C0000, #991B1B)",
      borderBottom: `1px solid ${online ? "#22C55E" : COLORS.merah}60`,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      padding: "9px 20px",
      animation: "slideDownBanner 0.3s ease",
      boxShadow: `0 4px 20px ${online ? "rgba(34,197,94,0.2)" : "rgba(204,0,0,0.3)"}`,
    }}>
      {online
        ? <Wifi size={14} color="#4ADE80" />
        : <WifiOff size={14} color="#FCA5A5" />
      }
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: online ? "#4ADE80" : "#FCA5A5",
        letterSpacing: "0.04em",
      }}>
        {online
          ? "✓ Koneksi kembali — website online"
          : "Tidak ada koneksi internet — beberapa fitur mungkin terbatas"}
      </span>
    </div>
  );
}
