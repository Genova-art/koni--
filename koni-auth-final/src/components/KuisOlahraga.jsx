import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Trophy, RefreshCw, Timer, Star, Zap, Share2 } from "lucide-react";
import Konfeti from "./Konfeti";
import ShareKuis from "./ShareKuis";

const SOAL_BANK = [
  { q: "Atlet bulutangkis Indonesia yang meraih medali emas di Olimpiade Tokyo 2020?", options: ["Kevin Sanjaya", "Greysia Polii & Apriyani", "Marcus Fernaldi", "Jonatan Christie"], jawaban: 1, cabor: "Bulutangkis", level: "Mudah" },
  { q: "Berapa cabang olahraga yang dinaungi KONI Pusat?", options: ["45 cabor", "55 cabor", "67 cabor", "72 cabor"], jawaban: 2, cabor: "Umum", level: "Mudah" },
  { q: "Di kota mana Asian Games pertama kali diadakan di Indonesia?", options: ["Surabaya", "Bandung", "Medan", "Jakarta"], jawaban: 3, cabor: "Sejarah", level: "Sedang" },
  { q: "Atlet angkat besi Indonesia yang meraih 4 medali Olimpiade?", options: ["Triyatno", "Eko Yuli Irawan", "Nurul Akmal", "Deni"], jawaban: 1, cabor: "Angkat Besi", level: "Sedang" },
  { q: "Tahun berapa KONI (Komite Olahraga Nasional Indonesia) didirikan?", options: ["1942", "1946", "1950", "1955"], jawaban: 1, cabor: "Sejarah", level: "Mudah" },
  { q: "Indonesia pertama kali berpartisipasi di Olimpiade pada tahun?", options: ["1948", "1952", "1956", "1960"], jawaban: 1, cabor: "Sejarah", level: "Sedang" },
  { q: "Atlet Indonesia yang pertama kali meraih medali emas Olimpiade?", options: ["Rudy Hartono", "Susi Susanti & Alan Budi Kusuma", "Ricky Subagja", "Rexy Mainaky"], jawaban: 1, cabor: "Bulutangkis", level: "Mudah" },
  { q: "Olahraga apa yang menyumbang emas Olimpiade terbanyak bagi Indonesia?", options: ["Panahan", "Angkat Besi", "Bulutangkis", "Renang"], jawaban: 2, cabor: "Umum", level: "Mudah" },
  { q: "PON XXI 2024 diselenggarakan di provinsi mana?", options: ["Sulawesi Selatan", "Kalimantan Timur", "Aceh & Sumatera Utara", "Jawa Timur"], jawaban: 2, cabor: "PON", level: "Sedang" },
  { q: "Stadion utama yang digunakan pada Asian Games 2018 Jakarta adalah?", options: ["Stadion Lebak Bulus", "Stadion Manahan Solo", "Gelora Bung Karno", "Stadion Patriot"], jawaban: 2, cabor: "Fasilitas", level: "Mudah" },
  { q: "Berapa jumlah KONI Provinsi di seluruh Indonesia?", options: ["30", "32", "34", "38"], jawaban: 2, cabor: "Organisasi", level: "Mudah" },
  { q: "Susi Susanti meraih emas Olimpiade di edisi keberapa?", options: ["Seoul 1988", "Barcelona 1992", "Atlanta 1996", "Sydney 2000"], jawaban: 1, cabor: "Bulutangkis", level: "Sedang" },
  { q: "Cabor Pencak Silat pertama kali masuk SEA Games pada tahun?", options: ["1975", "1979", "1987", "1991"], jawaban: 2, cabor: "Pencak Silat", level: "Sulit" },
  { q: "Indonesia pernah menjadi juara umum SEA Games sebanyak berapa kali?", options: ["8 kali", "11 kali", "14 kali", "16 kali"], jawaban: 1, cabor: "SEA Games", level: "Sulit" },
];

const LEVEL_COLOR = { Mudah: "#22C55E", Sedang: COLORS.gold, Sulit: COLORS.merah };
const TIME_LIMIT = 20;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function KuisOlahraga() {
  const [soal, setSoal]           = useState(() => shuffle(SOAL_BANK).slice(0, 8));
  const [idx, setIdx]             = useState(0);
  const [pilihan, setPilihan]     = useState(null);
  const [skor, setSkor]           = useState(0);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [done, setDone]           = useState(false);
  const [waktu, setWaktu]         = useState(TIME_LIMIT);
  const [results, setResults]     = useState([]);
  const [started, setStarted]     = useState(false);
  const [showAnim, setShowAnim]   = useState(null);
  const [konfeti, setKonfeti]     = useState(false);
  const [shareOpen, setShareOpen] = useState(false); // "correct" | "wrong"

  const current = soal[idx];

  // Countdown timer
  useEffect(() => {
    if (!started || done || pilihan !== null) return;
    if (waktu <= 0) { handlePilih(-1); return; }
    const t = setTimeout(() => setWaktu(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [waktu, started, done, pilihan]);

  const handlePilih = useCallback((i) => {
    if (pilihan !== null) return;
    setPilihan(i);
    const benar = i === current.jawaban;
    const bonus = waktu > 10 ? 2 : 1; // speed bonus
    if (benar) {
      const newStreak = streak + 1;
      setSkor(s => s + (10 * bonus) + (newStreak >= 3 ? 5 : 0));
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      setShowAnim("correct");
    } else {
      setStreak(0);
      setShowAnim("wrong");
    }
    setResults(r => [...r, { soal: current.q, benar, pilihan: i, jawaban: current.jawaban, options: current.options }]);
    setTimeout(() => { setShowAnim(null); next(); }, 1200);
  }, [pilihan, current, streak, waktu]);

  const next = () => {
    if (idx + 1 >= soal.length) {
      setDone(true);
      if (skor >= 60) setTimeout(() => setKonfeti(true), 300);
      // Save to leaderboard
      try {
        const prev = JSON.parse(localStorage.getItem("koni-leaderboard") || "[]");
        const entry = { nama: "Saya", skor, benar: results.filter(r=>r.benar).length + (benar ? 1 : 0), streak: maxStreak, waktu: "Baru saja", isMe: true };
        localStorage.setItem("koni-leaderboard", JSON.stringify([entry, ...prev].slice(0, 5)));
      } catch {}
      return;
    }
    setIdx(i => i + 1);
    setPilihan(null);
    setWaktu(TIME_LIMIT);
  };

  const restart = () => {
    setSoal(shuffle(SOAL_BANK).slice(0, 8));
    setIdx(0); setPilihan(null); setSkor(0);
    setStreak(0); setMaxStreak(0); setDone(false);
    setWaktu(TIME_LIMIT); setResults([]); setStarted(false);
    setShowAnim(null);
  };

  const rating = skor >= 100 ? { label: "Juara Dunia! 🏆", color: COLORS.gold } :
    skor >= 70 ? { label: "Atlet Nasional! 🥇", color: "#22C55E" } :
    skor >= 40 ? { label: "Atlet Daerah 🥈", color: "#60A5FA" } :
    { label: "Masih Berlatih 💪", color: COLORS.merah };

  return (
    <section style={{ background: `linear-gradient(160deg, #060D1A, ${COLORS.navy})`, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel label="Kuis Interaktif" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Kuis Olahraga Indonesia
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8 }}>
            Uji pengetahuanmu seputar olahraga dan KONI Indonesia. 8 soal, jawab secepat mungkin!
          </p>
        </FadeIn>

        {!started && !done && (
          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 10 }}>Siap Mulai Kuis?</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
                8 pertanyaan seputar olahraga Indonesia<br />
                ⏱️ 20 detik per soal · ⚡ Bonus poin jawab cepat · 🔥 Bonus streak
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                {[{ icon: <Timer size={16} />, label: "20 detik/soal" }, { icon: <Zap size={16} />, label: "Bonus kecepatan" }, { icon: <Star size={16} />, label: "Bonus streak ×3" }].map(b => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", borderRadius: 100, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ color: COLORS.gold }}>{b.icon}</span> {b.label}
                  </div>
                ))}
              </div>
              <button onClick={() => setStarted(true)} style={{
                background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                color: "#fff", border: `1px solid ${COLORS.gold}40`,
                padding: "14px 40px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.08em",
                boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                🚀 Mulai Kuis
              </button>
            </div>
          </FadeIn>
        )}

        {started && !done && (
          <FadeIn key={idx}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden" }}>
              {/* Progress + timer bar */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})`, width: `${((idx) / soal.length) * 100}%`, transition: "width 0.3s" }} />
              </div>

              <div style={{ padding: "1.5rem" }}>
                {/* Top bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Soal {idx + 1}/{soal.length}</span>
                    <span style={{ fontSize: 11, background: `${LEVEL_COLOR[current.level]}20`, color: LEVEL_COLOR[current.level], borderRadius: 100, padding: "2px 8px", fontWeight: 600 }}>{current.level}</span>
                    <span style={{ fontSize: 11, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", borderRadius: 100, padding: "2px 8px" }}>{current.cabor}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {streak >= 2 && <span style={{ fontSize: 11, color: "#F97316", fontWeight: 700 }}>🔥 {streak} streak!</span>}
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold }}>⭐ {skor}</span>
                  </div>
                </div>

                {/* Timer */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      <Timer size={12} /> Waktu tersisa
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: waktu <= 5 ? COLORS.merah : COLORS.gold, fontFamily: "Georgia, serif" }}>{waktu}s</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                    <div style={{ height: "100%", borderRadius: 99, background: waktu <= 5 ? COLORS.merah : `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})`, width: `${(waktu / TIME_LIMIT) * 100}%`, transition: "width 1s linear, background 0.3s" }} />
                  </div>
                </div>

                {/* Question */}
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.55, fontFamily: "Georgia, serif", marginBottom: "1.5rem" }}>
                  {current.q}
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {current.options.map((opt, i) => {
                    const isCorrect = i === current.jawaban;
                    const isPicked = i === pilihan;
                    let bg = "rgba(255,255,255,0.05)";
                    let border = "rgba(255,255,255,0.1)";
                    let color = "rgba(255,255,255,0.8)";
                    if (pilihan !== null) {
                      if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "#22C55E"; color = "#fff"; }
                      else if (isPicked) { bg = "rgba(204,0,0,0.15)"; border = COLORS.merah; color = "#fff"; }
                    }
                    return (
                      <button key={i} onClick={() => handlePilih(i)} disabled={pilihan !== null} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 10,
                        padding: "13px 16px", textAlign: "left", cursor: pilihan !== null ? "default" : "pointer",
                        color, fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                        onMouseEnter={e => { if (pilihan === null) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={e => { if (pilihan === null) e.currentTarget.style.background = bg; }}
                      >
                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.gold, flexShrink: 0 }}>
                          {["A","B","C","D"][i]}
                        </span>
                        {opt}
                        {pilihan !== null && isCorrect && <span style={{ marginLeft: "auto", fontSize: 14 }}>✓</span>}
                        {pilihan !== null && isPicked && !isCorrect && <span style={{ marginLeft: "auto", fontSize: 14 }}>✗</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Answer feedback */}
                {showAnim && (
                  <div style={{
                    marginTop: "1rem", padding: "10px 16px", borderRadius: 8, textAlign: "center",
                    background: showAnim === "correct" ? "rgba(34,197,94,0.15)" : "rgba(204,0,0,0.15)",
                    border: `1px solid ${showAnim === "correct" ? "#22C55E" : COLORS.merah}40`,
                    fontSize: 13, fontWeight: 700,
                    color: showAnim === "correct" ? "#4ADE80" : "#f87171",
                  }}>
                    {showAnim === "correct"
                      ? `✓ Benar! ${streak >= 3 ? "🔥 Streak Bonus +5!" : "+10 poin"}`
                      : `✗ Salah! Jawaban: ${current.options[current.jawaban]}`}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {done && (
          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 4 }}>Kuis Selesai!</div>
              <div style={{ fontSize: 14, color: rating.color, fontWeight: 700, marginBottom: "1.5rem" }}>{rating.label}</div>

              {/* Score breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { label: "Total Poin", val: skor, color: COLORS.gold },
                  { label: "Benar", val: `${results.filter(r => r.benar).length}/${soal.length}`, color: "#22C55E" },
                  { label: "Max Streak", val: `${maxStreak}🔥`, color: "#F97316" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "1rem" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Georgia, serif" }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Review salah */}
              {results.filter(r => !r.benar).length > 0 && (
                <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Review Jawaban Salah</div>
                  {results.filter(r => !r.benar).map((r, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{r.soal}</div>
                      <div style={{ fontSize: 11, color: "#4ADE80" }}>✓ {r.options[r.jawaban]}</div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={restart} style={{
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                color: "#fff", border: "none", padding: "13px 32px", borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: "pointer", margin: "0 auto",
                boxShadow: "0 8px 28px rgba(204,0,0,0.35)",
              }}>
                <RefreshCw size={15} /> Main Lagi
              </button>
              <button onClick={() => setShareOpen(true)} style={{
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.gold}40`,
                color: COLORS.gold, padding: "11px 28px", borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: "pointer", margin: "0 auto",
              }}>
                <Share2 size={15} /> Bagikan Hasil
              </button>
            </div>
            <Konfeti active={konfeti} onDone={() => setKonfeti(false)} />
            {shareOpen && (
              <ShareKuis
                skor={skor} benar={results.filter(r=>r.benar).length}
                total={soal.length} maxStreak={maxStreak}
                rating={rating.label}
                onClose={() => setShareOpen(false)}
              />
            )}
          </FadeIn>
        )}
      </div>
    </section>
  );
}
