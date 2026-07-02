import { useState, useRef, useEffect, useCallback } from "react";
import { COLORS } from "../data/constants";
import { MessageCircle, X, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

const SYSTEM_PROMPT = `Kamu adalah KONI Assistant, asisten resmi website KONI Pusat (Komite Olahraga Nasional Indonesia). Kamu membantu pengunjung dengan informasi seputar:
- KONI Pusat dan organisasinya (berdiri 1946, menaungi 67 cabor, 34 KONI Provinsi, 4200+ atlet)
- Cabang olahraga yang dinaungi KONI
- Jadwal kompetisi: SEA Games 2026 (Juli), PON XXI (September 2026), Asian Games
- Atlet berprestasi: Kevin Sanjaya (Bulutangkis #1 Dunia), Eko Yuli Irawan (4x Olimpiade), Greysia Polii (Emas Tokyo)
- Prestasi Indonesia: 94 emas SEA Games 2025, 2 emas Olimpiade Paris 2024
- Cara daftar anggota KONI melalui website
- Kontak: Jl. Pintu I Senayan Jakarta, telp (021) 574-6044

Jawab dalam Bahasa Indonesia, ramah, informatif, dan singkat (maksimal 3 paragraf). Gunakan emoji relevan. Jika ditanya di luar topik olahraga Indonesia, arahkan kembali ke topik KONI.`;

const QUICK_REPLIES = ["Apa itu KONI?", "Cabang Olahraga", "Cara Daftar", "Jadwal Event", "Prestasi SEA Games", "Kontak KONI"];

export default function ChatbotKONI() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([
    { role: "bot", text: "Halo! 👋 Saya **KONI Assistant** yang didukung AI. Ada yang bisa saya bantu seputar olahraga Indonesia?", time: "Baru saja" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI]     = useState(false); // default OFF — butuh API key untuk ON
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const callAPI = useCallback(async (userMsg, history) => {
    const messages = [
      ...history.filter(m => m.role !== "bot" || history.indexOf(m) > 0).map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text.replace(/\*\*(.*?)\*\*/g, "$1"),
      })),
      { role: "user", content: userMsg },
    ];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Maaf, terjadi kesalahan. Silakan coba lagi.";
  }, []);

  // Fallback FAQ for offline/error
  const getFallback = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("koni")) return "KONI (Komite Olahraga Nasional Indonesia) berdiri sejak 1946, menaungi 67 cabang olahraga dan 34 KONI Provinsi di seluruh Indonesia. 🏆";
    if (lower.includes("daftar") || lower.includes("register")) return "Untuk mendaftar, klik tombol **Daftar** di navbar, isi formulir lengkap, dan verifikasi email. Keanggotaan gratis! 🎫";
    if (lower.includes("jadwal") || lower.includes("event") || lower.includes("kompetisi")) return "Event mendatang: SEA Games 2026 (15 Juli), PON XXI (8 September 2026). Cek section Jadwal untuk countdown! 📅";
    if (lower.includes("sea games")) return "Di SEA Games 2025, Indonesia meraih **94 emas, 88 perak, 109 perunggu** — juara umum! 🥇🇮🇩";
    if (lower.includes("kontak") || lower.includes("alamat") || lower.includes("telepon")) return "Kantor KONI: Jl. Pintu I Senayan, Jakarta. Telp: (021) 574-6044. Email: sekretariat@koni.or.id 📞";
    if (lower.includes("atlet") || lower.includes("kevin") || lower.includes("eko yuli")) return "Atlet unggulan Indonesia: **Kevin Sanjaya** (Bulutangkis #1 Dunia), **Eko Yuli Irawan** (4x Olimpiade Angkat Besi), **Greysia Polii** (Emas Tokyo 2020). 🥇";
    if (lower.includes("cabor") || lower.includes("cabang olahraga") || lower.includes("olahraga")) return "KONI menaungi 67 cabang olahraga, antara lain: Bulutangkis, Renang, Atletik, Sepak Bola, Bola Voli, Tinju, Angkat Besi, Pencak Silat, dan banyak lagi! 🏅";
    if (lower.includes("login") || lower.includes("masuk") || lower.includes("akun")) return "Klik tombol **Masuk** di navbar, masukkan email dan password terdaftar. Belum punya akun? Klik **Daftar** untuk membuat akun baru! 🔐";
    if (lower.includes("prestasi") || lower.includes("medali") || lower.includes("emas")) return "Indonesia meraih **2 emas** di Olimpiade Paris 2024 dan **94 emas** di SEA Games 2025 — juara umum! Total koleksi medali terus bertambah setiap tahunnya. 🏅";
    if (lower.includes("pon") || lower.includes("pekan olahraga")) return "PON XXI dijadwalkan pada **8 September 2026**. PON adalah ajang olahraga multi-cabang terbesar di Indonesia yang diadakan setiap 4 tahun sekali. 🏟️";
    if (lower.includes("purwokerto") || lower.includes("banyumas")) return "KONI Cabang Purwokerto menaungi atlet berprestasi Kabupaten Banyumas, Jawa Tengah. Purwokerto dikenal sebagai Kota Satria yang melahirkan banyak juara olahraga! 🏆";
    return "Terima kasih atas pertanyaannya! Saya dapat membantu seputar KONI, cabang olahraga, jadwal event, atlet berprestasi, dan cara mendaftar. Silakan tanya lebih spesifik! 😊";
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMsgs = [...msgs, { role: "user", text: msg, time: "Baru saja" }];
    setMsgs(newMsgs);
    setLoading(true);

    try {
      let reply;
      if (useAI) {
        reply = await callAPI(msg, newMsgs.slice(-6));
      } else {
        reply = getFallback(msg);
      }
      setMsgs(p => [...p, { role: "bot", text: reply, time: "Baru saja" }]);
    } catch {
      const fallback = getFallback(msg);
      setMsgs(p => [...p, { role: "bot", text: fallback, time: "Baru saja" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: COLORS.gold }}>{part}</strong> : part
    );

  return (
    <div style={{ position: "fixed", bottom: 90, right: 32, zIndex: 998 }}>
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 12px)", right: 0,
          width: 340, height: 500,
          background: "linear-gradient(160deg, #0A1628, #132040)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
          animation: "slideUpModal 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Bot size={18} color="#fff" />
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: "#22C55E", border: "1.5px solid #0A1628" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                KONI Assistant
                <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, padding: "1px 6px", fontSize: 8, letterSpacing: "0.1em" }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>● Online · Powered by Claude AI</div>
            </div>
            <button
              onClick={() => setUseAI(p => !p)}
              title={useAI ? "Matikan AI" : "Aktifkan AI"}
              style={{ background: useAI ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <Sparkles size={11} color={useAI ? COLORS.gold : "rgba(255,255,255,0.4)"} />
              <span style={{ fontSize: 9, color: useAI ? COLORS.gold : "rgba(255,255,255,0.4)", fontWeight: 700 }}>{useAI ? "AI ON" : "AI OFF"}</span>
            </button>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {m.role === "bot" && (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={13} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: "82%",
                  background: m.role === "user" ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : "rgba(255,255,255,0.07)",
                  border: m.role === "bot" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "10px 13px", fontSize: 12, color: "#fff", lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}>
                  {renderText(m.text)}
                </div>
                {m.role === "user" && (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, #B8960C)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={13} color="#000" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={13} color="#fff" />
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gold, animation: `dotBounce 1.2s ${i*0.2}s infinite` }} />)}
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>{useAI ? "AI sedang berpikir..." : ""}</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {msgs.length <= 2 && (
            <div style={{ padding: "0 1rem 0.75rem", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid rgba(184,150,12,0.3)`, borderRadius: 100, padding: "5px 10px", fontSize: 10, color: COLORS.gold, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(184,150,12,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={useAI ? "Tanya apa saja..." : "Ketik pertanyaan..."}
              disabled={loading}
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: input.trim() && !loading ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              {loading ? <RefreshCw size={13} color="rgba(255,255,255,0.4)" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} color={input.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />}
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(p => !p)} style={{ width: 54, height: 54, borderRadius: "50%", background: open ? `linear-gradient(135deg, ${COLORS.navyMid}, ${COLORS.navy})` : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: `2px solid ${open ? COLORS.gold+"60" : COLORS.gold}`, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(204,0,0,0.4)", transition: "all 0.3s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "none"}
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
      </button>

      <style>{`@keyframes dotBounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  );
}
