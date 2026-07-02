import { COLORS } from "../data/constants";
import { useBookmark } from "../context/BookmarkContext";
import { Bookmark, X, Trash2, Newspaper, Calendar } from "lucide-react";

export default function BookmarkPanel({ open, onClose }) {
  const { bookmarks, toggle, clear } = useBookmark();
  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 4500,
        background: "rgba(5,10,20,0.8)", backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "flex-end",
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <div style={{
        width: 380, height: "100%",
        background: "linear-gradient(160deg, #0A1628, #132040)",
        borderLeft: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bookmark size={16} color={COLORS.gold} fill={COLORS.gold} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Tersimpan</span>
            <span style={{ background: COLORS.merah, borderRadius: 100, padding: "1px 8px", fontSize: 10, color: "#fff", fontWeight: 700 }}>
              {bookmarks.length}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {bookmarks.length > 0 && (
              <button onClick={clear} title="Hapus semua" style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, color: "#f87171", cursor: "pointer",
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Trash2 size={13} />
              </button>
            )}
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6, color: "#fff", cursor: "pointer",
              width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                Belum ada yang tersimpan.<br />
                Klik ikon ♥ pada berita atau jadwal untuk menyimpannya.
              </div>
            </div>
          ) : bookmarks.map(b => (
            <div key={b.id} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: b.type === "berita" ? `${COLORS.merah}20` : `${COLORS.gold}20`,
                border: `1px solid ${b.type === "berita" ? COLORS.merah : COLORS.gold}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {b.emoji || (b.type === "berita" ? <Newspaper size={16} color={COLORS.merah} /> : <Calendar size={16} color={COLORS.gold} />)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: "#fff",
                  lineHeight: 1.35, marginBottom: 3,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {b.judul}
                </div>
                <div style={{ fontSize: 10, color: b.type === "berita" ? COLORS.merah : COLORS.gold, fontWeight: 600, marginBottom: 2 }}>
                  {b.type === "berita" ? "📰 Berita" : "📅 Jadwal"}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                  {new Date(b.savedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </div>
              </div>
              <button onClick={() => toggle(b)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.3)", padding: 4, flexShrink: 0,
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
