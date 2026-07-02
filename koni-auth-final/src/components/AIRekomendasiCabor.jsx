import { useState } from "react";
import { COLORS, caborData } from "../data/constants";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";
import { Sparkles, RefreshCw, ChevronRight } from "lucide-react";

const QUESTIONS = [
  { q: "Seberapa aktif kamu secara fisik?", opts: ["Sangat aktif setiap hari", "Aktif 3-4x seminggu", "Sesekali berolahraga", "Lebih suka indoor"] },
  { q: "Preferensi olahraga kamu?", opts: ["Tim/berkelompok", "Individual/solo", "Seni & teknik", "Kekuatan & power"] },
  { q: "Waktu latihan yang cocok?", opts: ["Pagi hari", "Siang/sore", "Malam hari", "Kapan saja"] },
  { q: "Target prestasi kamu?", opts: ["Juara nasional", "SEA Games", "Olimpiade", "Sehat & fun"] },
  { q: "Postur tubuh kamu?", opts: ["Tinggi & ramping", "Kekar & berotot", "Gesit & lincah", "Semua bisa"] },
];

export default function AIRekomendasiCabor() {
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState([]);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [started, setStarted]   = useState(false);

  const getRekomendasi = async (ans) => {
    setLoading(true);
    const answerText = QUESTIONS.map((q, i) => `${q.q}: ${ans[i]}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Berdasarkan jawaban kuesioner berikut, rekomendasikan 3 cabang olahraga yang paling cocok dari daftar: Atletik, Renang, Bulutangkis, Angkat Besi, Pencak Silat, Panahan, Sepak Bola, Voli.\n\nJawaban:\n${answerText}\n\nRespond HANYA dengan JSON format ini tanpa markdown:\n{"rekomendasi":[{"nama":"...","alasan":"...","cocok":95,"icon":"..."},{"nama":"...","alasan":"...","cocok":85,"icon":"..."},{"nama":"...","alasan":"...","cocok":75,"icon":"..."}],"pesan":"..."}`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json?|```/g, "").trim());
      setResult(parsed);
    } catch {
      // Fallback result
      setResult({
        rekomendasi: [
          { nama: "Bulutangkis", alasan: "Cocok dengan profil aktif dan gesit kamu, plus Indonesia sangat kuat di cabor ini!", cocok: 92, icon: "🏸" },
          { nama: "Pencak Silat", alasan: "Seni bela diri asli Indonesia yang menggabungkan kekuatan, teknik, dan budaya.", cocok: 84, icon: "🥋" },
          { nama: "Atletik", alasan: "Dasar semua olahraga — cocok untuk membangun fondasi fisik yang kuat.", cocok: 76, icon: "🏃" },
        ],
        pesan: "Berdasarkan profil kamu, olahraga yang membutuhkan kelincahan dan teknik sangat cocok!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (ans) => {
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      getRekomendasi(newAnswers);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); setStarted(false); };

  return (
    <section style={{ background: `linear-gradient(160deg, #060D1A, ${COLORS.navy})`, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel label="AI Rekomendasi" />
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: COLORS.putih, margin: "0 0 0.5rem" }}>
            Cabor yang Cocok Untukmu
          </h2>
          <GoldDivider />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8 }}>
            Jawab 5 pertanyaan singkat, AI akan merekomendasikan cabang olahraga terbaik sesuai kepribadian dan fisikmu.
          </p>
        </FadeIn>

        {!started && !result && (
          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(79,70,229,0.3)`, borderRadius: 16, padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🤖</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 10 }}>AI Cabor Matcher</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.7 }}>
                5 pertanyaan · Analisis AI · Rekomendasi personal<br />
                <span style={{ color: "#A78BFA", fontSize: 11 }}>✨ Powered by Claude AI</span>
              </div>
              <button onClick={() => setStarted(true)} style={{
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                color: "#fff", border: "none", padding: "14px 36px", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 28px rgba(79,70,229,0.4)",
                display: "flex", alignItems: "center", gap: 8, margin: "0 auto",
              }}>
                <Sparkles size={16} /> Mulai Quiz AI
              </button>
            </div>
          </FadeIn>
        )}

        {started && !result && !loading && (
          <FadeIn key={step}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(79,70,229,0.3)`, borderRadius: 16, overflow: "hidden" }}>
              {/* Progress */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", width: `${((step + 1) / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #4F46E5, #A78BFA)", transition: "width 0.4s", borderRadius: 99 }} />
              </div>
              <div style={{ padding: "2rem" }}>
                <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  PERTANYAAN {step + 1} / {QUESTIONS.length}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: "1.75rem", lineHeight: 1.4 }}>
                  {QUESTIONS[step].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {QUESTIONS[step].opts.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(opt)} style={{
                      padding: "14px 18px", borderRadius: 10, textAlign: "left",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500,
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,70,229,0.15)"; e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                    >
                      <span>{opt}</span>
                      <ChevronRight size={14} style={{ opacity: 0.4 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {loading && (
          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(79,70,229,0.3)`, borderRadius: 16, padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, animation: "floatAnim 2s ease-in-out infinite" }}>🤖</div>
              <div style={{ fontSize: 14, color: "#A78BFA", fontWeight: 600, marginBottom: 8 }}>Claude AI sedang menganalisis...</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>Memproses {answers.length} jawaban kamu</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#A78BFA", animation: `dotBounce 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          </FadeIn>
        )}

        {result && (
          <FadeIn>
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(79,70,229,0.3)`, borderRadius: 16, padding: "2rem" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>✨ Hasil Analisis AI</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontStyle: "italic" }}>{result.pesan}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {result.rekomendasi?.map((r, i) => (
                  <div key={i} style={{
                    background: i === 0 ? `linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${i === 0 ? "#7C3AED60" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12, padding: "1.25rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{ fontSize: 32, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(79,70,229,0.15)`, borderRadius: 10, border: `1px solid rgba(79,70,229,0.3)`, flexShrink: 0 }}>
                        {r.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
                          {r.nama}
                          {i === 0 && <span style={{ background: "#4F46E5", borderRadius: 100, padding: "1px 8px", fontSize: 9, fontWeight: 800, color: "#fff" }}>TERBAIK</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{r.alasan}</div>
                      </div>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? "#A78BFA" : COLORS.gold }}>{r.cocok}%</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>cocok</div>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.cocok}%`, background: i === 0 ? "linear-gradient(90deg, #4F46E5, #A78BFA)" : `linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})`, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={reset} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "12px", color: "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                <RefreshCw size={13} /> Coba Lagi dengan Jawaban Berbeda
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
