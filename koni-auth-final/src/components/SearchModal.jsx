import { useState, useEffect, useRef } from "react";
import { COLORS, caborData, atletData } from "../data/constants";
import { getStoredNews } from "../services/localData";

const CATEGORY_COLORS = {
  "Berita": COLORS.merah,
  "Cabang Olahraga": COLORS.gold,
  "Atlet": "#6B21A8",
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
      setResults([]);
      setActiveIdx(0);
    }
  }, [isOpen]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new Event("koni-open-search"));
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Keyboard navigation inside results
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[activeIdx]) {
        handleSelect(results[activeIdx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, activeIdx]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) { setResults([]); setActiveIdx(0); return; }
    const q = query.toLowerCase();

    const newsResults = getStoredNews()
      .filter(n => n.judul.toLowerCase().includes(q) || n.deskripsi?.toLowerCase().includes(q) || n.kategori?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(n => ({ type: "Berita", icon: n.img || "📰", title: n.judul, subtitle: n.tanggal + " · " + n.kategori, data: n }));

    const caborResults = caborData
      .filter(c => c.nama.toLowerCase().includes(q))
      .slice(0, 2)
      .map(c => ({ type: "Cabang Olahraga", icon: c.icon, title: c.nama, subtitle: `${c.medali} Medali · ${c.atlet} Atlet`, data: c }));

    const atletResults = atletData
      .filter(a => a.nama.toLowerCase().includes(q) || a.cabor.toLowerCase().includes(q) || a.prestasi?.toLowerCase().includes(q))
      .slice(0, 2)
      .map(a => ({ type: "Atlet", icon: a.icon, title: a.nama, subtitle: a.cabor + " · " + a.prestasi, data: a }));

    setResults([...newsResults, ...caborResults, ...atletResults]);
    setActiveIdx(0);
  }, [query]);

  const handleSelect = (item) => {
    const sectionMap = { "Berita": "#berita", "Cabang Olahraga": "#cabor", "Atlet": "#atlet" };
    const target = document.querySelector(sectionMap[item.type]);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(5,10,20,0.75)",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "10vh", padding: "10vh 1rem 1rem",
        animation: "fadeInOverlay 0.18s ease",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 620,
        background: "linear-gradient(160deg, #0F1E38, #162A50)",
        border: `1px solid rgba(184,150,12,0.3)`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(184,150,12,0.1)",
        animation: "slideUpModal 0.22s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Search input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px",
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari berita, cabang olahraga, atlet..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#fff", fontSize: 16, fontFamily: "inherit",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{
              background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6,
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              fontSize: 12, padding: "3px 8px",
            }}>✕</button>
          )}
          <kbd style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6, padding: "3px 8px", fontSize: 11,
            color: "rgba(255,255,255,0.35)", fontFamily: "inherit", letterSpacing: "0.05em",
          }}>ESC</kbd>
        </div>

        {/* Results */}
        {query && (
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {results.length === 0 ? (
              <div style={{
                padding: "3rem", textAlign: "center",
                color: "rgba(255,255,255,0.35)", fontSize: 14,
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                Tidak ada hasil untuk <strong style={{ color: "rgba(255,255,255,0.6)" }}>"{query}"</strong>
              </div>
            ) : (
              <>
                {/* Group by type */}
                {["Berita", "Cabang Olahraga", "Atlet"].map(type => {
                  const group = results.filter(r => r.type === type);
                  if (!group.length) return null;
                  return (
                    <div key={type}>
                      <div style={{
                        padding: "10px 20px 6px",
                        fontSize: 10, fontWeight: 700,
                        color: CATEGORY_COLORS[type],
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                      }}>
                        {type}
                      </div>
                      {group.map((item, i) => {
                        const globalIdx = results.indexOf(item);
                        const isActive = globalIdx === activeIdx;
                        return (
                          <div
                            key={i}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIdx(globalIdx)}
                            style={{
                              display: "flex", alignItems: "center", gap: 14,
                              padding: "11px 20px",
                              cursor: "pointer",
                              background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                              borderLeft: isActive ? `3px solid ${CATEGORY_COLORS[type]}` : "3px solid transparent",
                              transition: "all 0.15s",
                            }}
                          >
                            <span style={{
                              fontSize: 22, width: 36, height: 36,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: `${CATEGORY_COLORS[type]}15`,
                              borderRadius: 8, flexShrink: 0,
                            }}>{item.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: 14, fontWeight: 600, color: "#fff",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              }}>
                                {/* Highlight matching text */}
                                {highlightMatch(item.title, query)}
                              </div>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                                {item.subtitle}
                              </div>
                            </div>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>↵</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        {!query && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⌨️</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7 }}>
              Ketik untuk mencari berita, cabang olahraga, atau atlet<br />
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
                Gunakan <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.12)" }}>↑</kbd>
                {" "}<kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.12)" }}>↓</kbd>
                {" "}untuk navigasi · <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.12)" }}>↵</kbd> untuk pilih
              </span>
            </div>
          </div>
        )}

        {query && results.length > 0 && (
          <div style={{
            padding: "10px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              {results.length} hasil ditemukan
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              Ctrl+K untuk buka/tutup
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(184,150,12,0.35)", color: COLORS.gold, borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
