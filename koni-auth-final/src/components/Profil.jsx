import { COLORS, pimpinanData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

export default function Profil() {
  return (
    <section id="profil" style={{ background: COLORS.gray, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Tentang Kami" />
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              color: COLORS.navy,
              margin: "0 0 0.5rem",
            }}
          >
            Komite Olahraga Nasional Indonesia
          </h2>
          <GoldDivider />
        </FadeIn>

        <div className="profil-grid">
          <FadeIn delay={0.1}>
            <p style={{ color: "#374151", lineHeight: 1.9, fontSize: 15, marginBottom: "1.5rem" }}>
              Komite Olahraga Nasional Indonesia (KONI) adalah induk organisasi olahraga Indonesia
              yang berdiri sejak 1946. KONI memiliki peran strategis dalam membina, mengembangkan,
              dan mengkoordinasikan kegiatan olahraga di seluruh Indonesia untuk mencapai prestasi
              tertinggi.
            </p>
            <p style={{ color: "#374151", lineHeight: 1.9, fontSize: 15, marginBottom: "2rem" }}>
              Dengan 67 cabang olahraga yang dinaungi dan 34 KONI Provinsi di seluruh Indonesia,
              KONI berkomitmen untuk mewujudkan Indonesia sebagai bangsa yang berprestasi dan
              berdaya saing di kancah olahraga internasional.
            </p>

            <div className="profil-bullet-grid">
              {[
                "Visi 2045: Indonesia Emas Olahraga Dunia",
                "Pembinaan atlet berprestasi nasional",
                "Koordinasi 67 cabang olahraga",
                "Kemitraan internasional strategis",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    background: COLORS.putih,
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderLeft: `3px solid ${COLORS.merah}`,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pimpinanData.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: COLORS.putih,
                    border: "1px solid rgba(0,0,0,0.07)",
                    borderRadius: 10,
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)")
                  }
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.putih,
                      fontSize: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                      border: `2px solid ${COLORS.gold}`,
                    }}
                  >
                    {p.nama.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: COLORS.navy,
                        marginBottom: 2,
                      }}
                    >
                      {p.nama}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.merah,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        marginBottom: 2,
                      }}
                    >
                      {p.jabatan}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                      Periode {p.periode}
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{
                  background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
                  borderRadius: 10,
                  padding: "1.5rem",
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Dasar Hukum
                </div>
                <div
                  style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.7 }}
                >
                  UU No. 11 Tahun 2022 tentang Keolahragaan · Peraturan Presiden No. 15 Tahun
                  2016 · AD/ART KONI Pusat
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
