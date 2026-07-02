import { useState } from "react";
import { COLORS, navItems } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Notifikasi from "./Notifikasi";
import ThemePicker from "./ThemePicker";
import LanguageToggle from "./MultiLanguage";
import { Bookmark } from "lucide-react";

export default function Navbar({ scrolled, onOpenLogin, onOpenRegister, onOpenDashboard, onOpenSearch }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const displayName = user?.name || user?.nama || "Pengguna";

  const navBg = isDark
    ? (scrolled ? "rgba(10,22,40,0.98)" : "transparent")
    : (scrolled ? "rgba(255,255,255,0.97)" : "transparent");

  const textColor = isDark ? COLORS.putih : (scrolled ? COLORS.navy : COLORS.putih);

  const linkStyle = {
    color: textColor,
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.08em",
    padding: "8px 14px",
    borderRadius: 4,
    transition: "all 0.2s",
    textTransform: "uppercase",
    opacity: 0.85,
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, zIndex: 1000,
          background: navBg,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${isDark ? COLORS.border : "rgba(0,0,0,0.08)"}` : "none",
          transition: "all 0.4s ease",
          padding: "0 2rem",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 72,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{
              width: 46, height: 46,
              borderRadius: "50%",
              border: `2px solid ${COLORS.gold}`,
              boxShadow: "0 0 20px rgba(204,0,0,0.4)",
              flexShrink: 0,
              overflow: "hidden",
              background: "#fff",
            }}>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='98' fill='%23fff' stroke='%23CC0000' stroke-width='3'/%3E%3Cpath d='M100 18 C97 30 88 35 89 46 C90 57 100 63 100 63 C100 63 110 57 111 46 C112 35 103 30 100 18Z' fill='%23CC0000'/%3E%3Cpath d='M100 28 C98 37 93 40 94 47 C95 53 100 57 100 57 C100 57 105 53 106 47 C107 40 102 37 100 28Z' fill='%23F4C300'/%3E%3Cpath d='M100 62 C91 58 79 54 69 47 C62 42 58 36 60 31 C63 37 70 42 79 47 C88 52 95 59 100 62Z' fill='%23CC0000'/%3E%3Cpath d='M100 62 C90 57 76 51 65 42 C58 36 56 28 59 23 C61 30 68 36 77 42 C86 48 94 57 100 62Z' fill='%238B0000' opacity='.55'/%3E%3Cpath d='M100 69 C90 67 77 64 67 57 C60 52 57 45 59 40 C63 46 71 50 80 54 C89 58 95 65 100 69Z' fill='%23CC0000' opacity='.8'/%3E%3Cpath d='M100 62 C109 58 121 54 131 47 C138 42 142 36 140 31 C137 37 130 42 121 47 C112 52 105 59 100 62Z' fill='%23CC0000'/%3E%3Cpath d='M100 62 C110 57 124 51 135 42 C142 36 144 28 141 23 C139 30 132 36 123 42 C114 48 106 57 100 62Z' fill='%238B0000' opacity='.55'/%3E%3Cpath d='M100 69 C110 67 123 64 133 57 C140 52 143 45 141 40 C137 46 129 50 120 54 C111 58 105 65 100 69Z' fill='%23CC0000' opacity='.8'/%3E%3Ctext x='100' y='95' text-anchor='middle' font-family='Arial,sans-serif' font-size='12' font-weight='bold' fill='%23CC0000' letter-spacing='2'%3EINDONESIA%3C/text%3E%3Cline x1='30' y1='101' x2='170' y2='101' stroke='%23CC0000' stroke-width='1' opacity='.35'/%3E%3Ccircle cx='47' cy='133' r='16' fill='none' stroke='%230085C7' stroke-width='5'/%3E%3Ccircle cx='74' cy='133' r='16' fill='none' stroke='%23F4C300' stroke-width='5'/%3E%3Ccircle cx='101' cy='133' r='16' fill='none' stroke='%23333' stroke-width='5'/%3E%3Ccircle cx='128' cy='133' r='16' fill='none' stroke='%23009F3D' stroke-width='5'/%3E%3Ccircle cx='155' cy='133' r='16' fill='none' stroke='%23DF0024' stroke-width='5'/%3E%3C/svg%3E"
                alt="Logo KONI"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{
                fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 15,
                color: textColor, letterSpacing: "0.05em", lineHeight: 1.1,
              }}>KONI PUSAT</div>
              <div style={{
                fontSize: 9, letterSpacing: "0.12em", color: COLORS.gold,
                textTransform: "uppercase", marginTop: 1,
              }}>Komite Olahraga Nasional Indonesia</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} style={linkStyle}
                onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.color = COLORS.gold; }}
                onMouseLeave={(e) => { e.target.style.opacity = 0.85; e.target.style.color = textColor; }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search button */}
            <button
              onClick={onOpenSearch}
              title="Cari (Ctrl+K)"
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                borderRadius: 8, padding: "7px 12px",
                cursor: "pointer", color: textColor,
                fontSize: 12, transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            >
              <span style={{ fontSize: 14 }}>🔍</span>
              <span style={{ opacity: 0.6, fontSize: 11 }}>Ctrl+K</span>
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Mode Terang" : "Mode Gelap"}
              style={{
                width: 38, height: 38,
                borderRadius: 8,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                cursor: "pointer",
                fontSize: 17,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                color: textColor,
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Notifikasi bell */}
            <Notifikasi />

            {/* Theme Picker */}
            <ThemePicker />

            {/* Bookmark */}
            <button
              onClick={() => window.dispatchEvent(new Event("koni-open-bookmarks"))}
              title="Tersimpan"
              style={{
                width: 38, height: 38, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              <Bookmark size={16} color="rgba(255,255,255,0.7)" />
            </button>

            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, padding: "7px 14px",
                    cursor: "pointer", color: COLORS.putih,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                    border: `1.5px solid ${COLORS.gold}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff",
                  }}>
                    {user.avatar}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{displayName.split(" ")[0]}</div>
                    <div style={{ fontSize: 9, color: COLORS.gold, letterSpacing: "0.06em" }}>{user.role}</div>
                  </div>
                  <span style={{ fontSize: 10, opacity: 0.5, color: "#fff" }}>▼</span>
                </button>

                {dropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    width: 200,
                    background: "rgba(10,22,40,0.98)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    zIndex: 100,
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
                      <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{displayName}</div>
                      <div style={{ fontSize: 10, color: COLORS.gold, marginTop: 2 }}>{user.email}</div>
                    </div>
                    {[
                      { icon: "🏠", label: "Portal Anggota", onClick: () => { onOpenDashboard(); setDropOpen(false); } },
                      { icon: "👤", label: "Profil Saya", onClick: () => { onOpenDashboard(); setDropOpen(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.onClick} style={{
                        display: "block", width: "100%", padding: "10px 16px",
                        background: "none", border: "none", textAlign: "left",
                        color: "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        {item.icon} {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}>
                      <button onClick={() => { setDropOpen(false); window.dispatchEvent(new Event("koni-logout")); }} style={{
                        display: "block", width: "100%", padding: "10px 16px",
                        background: "none", border: "none", textAlign: "left",
                        color: "#f87171", fontSize: 12, cursor: "pointer",
                      }}>
                        🚪 Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={onOpenLogin} style={{
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  color: textColor,
                  padding: "9px 18px", borderRadius: 4,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                >
                  Masuk
                </button>
                <button onClick={onOpenRegister} style={{
                  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                  color: COLORS.putih,
                  padding: "9px 18px", borderRadius: 4,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(204,0,0,0.35)",
                }}>
                  Daftar
                </button>
              </>
            )}

            {isAdmin && (
              <button onClick={onOpenDashboard} style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, #D4AF37)`,
                color: "#000",
                padding: "9px 18px", borderRadius: 4,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(212,175,55,0.35)",
                marginLeft: 4,
              }}>
                🛡️ Admin
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none", flexDirection: "column", gap: 5 }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: 24, height: 2,
                background: textColor, borderRadius: 2, transition: "all 0.3s",
                transform: menuOpen && i === 0 ? "rotate(45deg) translate(5px, 5px)" : menuOpen && i === 2 ? "rotate(-45deg) translate(5px, -5px)" : menuOpen && i === 1 ? "scaleX(0)" : "none",
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <button onClick={() => { onOpenSearch(); setMenuOpen(false); }} className="mobile-cta" style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
            🔍 Cari
          </button>
          <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="mobile-cta" style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}>
            {isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap"}
          </button>
          {user ? (
            <button onClick={() => { onOpenDashboard(); setMenuOpen(false); }} className="mobile-cta">Portal Anggota</button>
          ) : (
            <>
              <button onClick={() => { onOpenLogin(); setMenuOpen(false); }} className="mobile-cta">Masuk</button>
              <button onClick={() => { onOpenRegister(); setMenuOpen(false); }} className="mobile-cta">Daftar</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
