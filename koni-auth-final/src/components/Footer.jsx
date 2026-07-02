import { COLORS } from "../data/constants";

const footerCols = [
  { title: "Navigasi", links: ["Beranda", "Profil", "Cabang Olahraga", "Atlet Nasional", "Berita"] },
  { title: "Program", links: ["Pelatnas", "Diklat Atlet", "Beasiswa Atlet", "Anti-Doping", "Wasit & Pelatih"] },
  { title: "Informasi", links: ["Peraturan", "Dokumen Resmi", "PPID", "Pengaduan", "Karir"] },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: COLORS.navy,
        padding: "3rem 2rem 1.5rem",
        borderTop: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  border: `2px solid ${COLORS.gold}`,
                  flexShrink: 0,
                }}
              >
                🏆
              </div>
              <div>
                <div
                  style={{
                    color: COLORS.putih,
                    fontWeight: 700,
                    fontFamily: "Georgia, serif",
                    fontSize: 14,
                  }}
                >
                  KONI PUSAT
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: COLORS.gold,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Komite Olahraga Nasional Indonesia
                </div>
              </div>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 12,
                lineHeight: 1.8,
                maxWidth: 260,
                margin: 0,
              }}
            >
              Induk organisasi olahraga Indonesia yang berkomitmen membangun atlet berprestasi
              demi kejayaan bangsa.
            </p>
          </div>

          {/* Link columns */}
          {footerCols.map((col, i) => (
            <div key={i}>
              <div
                style={{
                  color: COLORS.gold,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {col.title}
              </div>
              {col.links.map((link, j) => (
                <a
                  key={j}
                  href="#"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 12,
                    textDecoration: "none",
                    padding: "4px 0",
                    lineHeight: 1.6,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = COLORS.gold)}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.45)")}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.25rem",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            © 2026 KONI Pusat — Komite Olahraga Nasional Indonesia. Hak cipta dilindungi
            undang-undang.
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            🇮🇩 Untuk Kejayaan Indonesia
          </div>
        </div>
      </div>
    </footer>
  );
}
