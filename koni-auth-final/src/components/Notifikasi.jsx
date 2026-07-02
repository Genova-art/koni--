import { useState, useEffect, useRef } from "react";
import { COLORS } from "../data/constants";
import { Bell, X, Check, Trophy, Calendar, Newspaper, Award } from "lucide-react";

const INITIAL_NOTIFS = [
  { id: 1, type: "prestasi", icon: <Trophy size={14} />, color: COLORS.gold, judul: "🥇 Prestasi Terbaru Indonesia!", pesan: "Indonesia kembali ukir prestasi di ajang internasional — pantau berita terbaru.", waktu: "2 menit lalu", read: false },
  { id: 2, type: "event", icon: <Calendar size={14} />, color: "#60A5FA", judul: "📅 Info Jadwal Event", pesan: "Terdapat pembaruan jadwal event nasional. Cek halaman Jadwal untuk detailnya.", waktu: "18 menit lalu", read: false },
  { id: 3, type: "berita", icon: <Newspaper size={14} />, color: "#34D399", judul: "📰 Berita Terbaru KONI", pesan: "KONI merilis program pembinaan atlet muda 2026–2030. Daftar sekarang.", waktu: "1 jam lalu", read: false },
  { id: 4, type: "prestasi", icon: <Award size={14} />, color: COLORS.merah, judul: "🏆 Medali SEA Games 2025", pesan: "Kontingen Indonesia tampil membanggakan di SEA Games 2025!", waktu: "3 jam lalu", read: true },
  { id: 5, type: "event", icon: <Calendar size={14} />, color: "#A78BFA", judul: "⏰ Countdown PON XXI", pesan: "Pekan Olahraga Nasional XXI semakin dekat. Persiapkan dirimu!", waktu: "Kemarin", read: true },
];

export default function Notifikasi() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [animNew, setAnimNew] = useState(false);
  const ref = useRef(null);

  const unread = notifs.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Simulate incoming notif every 30s
  useEffect(() => {
    const t = setTimeout(() => {
      setNotifs(prev => [{
        id: Date.now(), type: "berita", icon: <Newspaper size={14} />, color: "#34D399",
        judul: "🔔 Update Terbaru", pesan: "Atlet renang Indonesia pecahkan rekor SEA Games 50m gaya bebas.",
        waktu: "Baru saja", read: false,
      }, ...prev.slice(0, 9)]);
      setAnimNew(true);
      setTimeout(() => setAnimNew(false), 1000);
    }, 30000);
    return () => clearTimeout(t);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Notifikasi"
        style={{
          width: 38, height: 38, borderRadius: 8,
          background: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${open ? COLORS.gold + "60" : "rgba(255,255,255,0.12)"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", transition: "all 0.2s",
          animation: animNew ? "bellRing 0.5s ease" : "none",
        }}
      >
        <Bell size={16} color={open ? COLORS.gold : "rgba(255,255,255,0.7)"} />
        {unread > 0 && (
          <div style={{
            position: "absolute", top: 4, right: 4,
            width: 16, height: 16, borderRadius: "50%",
            background: COLORS.merah,
            border: `2px solid rgba(10,22,40,0.9)`,
            fontSize: 8, fontWeight: 700, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse 2s infinite",
          }}>
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 340, zIndex: 5000,
          background: "linear-gradient(160deg, #0F1E38, #162A50)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,150,12,0.1)",
          animation: "slideUpModal 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: `1px solid rgba(255,255,255,0.07)`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={14} color={COLORS.gold} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Notifikasi</span>
              {unread > 0 && (
                <span style={{ background: COLORS.merah, borderRadius: 100, padding: "1px 7px", fontSize: 10, color: "#fff", fontWeight: 700 }}>
                  {unread} baru
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: "none", border: "none", color: COLORS.gold,
                fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600,
              }}>
                <Check size={11} /> Tandai semua
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                Tidak ada notifikasi
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: "flex", gap: 12, padding: "13px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: n.read ? "transparent" : `${n.color}08`,
                  borderLeft: n.read ? "3px solid transparent" : `3px solid ${n.color}`,
                  cursor: "pointer", transition: "background 0.2s",
                  position: "relative",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : `${n.color}08`}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${n.color}20`, border: `1px solid ${n.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: n.color,
                }}>
                  {n.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: n.read ? 500 : 700, color: "#fff", marginBottom: 3, lineHeight: 1.3 }}>
                    {n.judul}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 4 }}>
                    {n.pesan}
                  </div>
                  <div style={{ fontSize: 10, color: n.color, fontWeight: 600 }}>{n.waktu}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: 2, flexShrink: 0 }}
                >
                  <X size={12} />
                </button>
                {!n.read && (
                  <div style={{ position: "absolute", top: 16, right: 36, width: 6, height: 6, borderRadius: "50%", background: n.color }} />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <button onClick={() => setNotifs([])} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              fontSize: 11, cursor: "pointer",
            }}>
              Hapus semua notifikasi
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bellRing {
          0%,100% { transform: rotate(0); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
