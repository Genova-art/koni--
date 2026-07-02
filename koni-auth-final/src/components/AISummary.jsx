import { useState } from "react";
import { COLORS } from "../data/constants";
import { Sparkles, X, RefreshCw, Copy, Check } from "lucide-react";

export default function AISummary({ judul, deskripsi, onClose }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [done, setDone]       = useState(false);

  const generateFallback = (judul, deskripsi) => {
    const words = deskripsi ? deskripsi.split(' ').slice(0, 20).join(' ') : judul;
    const topics = ['prestasi', 'atlet', 'medali', 'kompetisi', 'kejuaraan', 'olahraga'];
    const topic = topics.find(t => (judul + deskripsi).toLowerCase().includes(t)) || 'olahraga';
    return `📰 ${judul.slice(0, 100)}.\n\n✅ ${words}... Berita ini merupakan bagian dari perkembangan dunia ${topic} Indonesia yang terus menorehkan prestasi di kancah nasional maupun internasional.\n\n🏆 KONI Pusat terus berkomitmen mendukung setiap atlet dan program pembinaan demi kejayaan Indonesia.`;
  };

  const generate = async () => {
    setLoading(true); setSummary(""); setDone(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Ringkas artikel berita olahraga Indonesia berikut dalam 3 kalimat singkat, padat, dan informatif dalam Bahasa Indonesia. Gunakan emoji relevan di awal tiap kalimat.\n\nJudul: ${judul}\nIsi: ${deskripsi}\n\nTuliskan hanya ringkasan, tanpa penjelasan tambahan.`,
          }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setSummary(data.content?.[0]?.text || generateFallback(judul, deskripsi));
      setDone(true);
    } catch {
      setSummary(generateFallback(judul, deskripsi));
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Ringkasan tersalin! 📋", type: "success" } }));
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, zIndex: 5600,
      background: "rgba(5,10,20,0.88)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", animation: "fadeInOverlay 0.2s ease",
    }}>
      <div style={{
        maxWidth: 480, width: "100%",
        background: "linear-gradient(160deg, #0A1628, #132040)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={16} color="#fff" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Ringkasan AI</span>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, padding: "1px 7px", fontSize: 9, color: "#fff", fontWeight: 700 }}>Claude</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Article title */}
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: "1.25rem", lineHeight: 1.5, padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 8, borderLeft: `3px solid ${COLORS.merah}` }}>
            {judul}
          </div>

          {/* Summary area */}
          <div style={{ minHeight: 120, background: "rgba(255,255,255,0.04)", border: `1px solid ${done ? "#A78BFA40" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "14px", marginBottom: "1.25rem", transition: "border-color 0.3s" }}>
            {!summary && !loading && (
              <div style={{ textAlign: "center", padding: "1.5rem 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
                Klik tombol di bawah untuk meringkas artikel dengan AI
              </div>
            )}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[100, 85, 70].map((w, i) => (
                  <div key={i} style={{ height: 12, borderRadius: 4, width: `${w}%`, background: "linear-gradient(90deg, rgba(167,139,250,0.1) 25%, rgba(167,139,250,0.2) 50%, rgba(167,139,250,0.1) 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmer 1.4s infinite" }} />
                ))}
                <div style={{ fontSize: 10, color: "#A78BFA", textAlign: "center", marginTop: 8, animation: "pulse 1.5s infinite" }}>Claude AI sedang membaca artikel...</div>
              </div>
            )}
            {summary && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {summary}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={generate} disabled={loading} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #4F46E5, #7C3AED)",
              border: "none", borderRadius: 10, padding: "12px",
              color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading ? "default" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(79,70,229,0.35)", transition: "all 0.2s",
            }}>
              {loading
                ? <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Meringkas...</>
                : <><Sparkles size={14} /> {done ? "Ringkas Ulang" : "Ringkas dengan AI"}</>}
            </button>
            {done && (
              <button onClick={handleCopy} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${copied ? "#22C55E" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 10, padding: "12px 14px",
                color: copied ? "#4ADE80" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
