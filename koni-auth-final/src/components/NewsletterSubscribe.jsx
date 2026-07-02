import { useState } from "react";
import { COLORS } from "../data/constants";
import { Mail, CheckCircle, ArrowRight, Bell } from "lucide-react";

export default function NewsletterSubscribe() {
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics]   = useState(["berita"]);

  const TOPIC_LIST = [
    { id: "berita",  label: "Berita Terbaru",    icon: "📰" },
    { id: "jadwal",  label: "Jadwal Event",       icon: "📅" },
    { id: "atlet",   label: "Profil Atlet",       icon: "🏆" },
    { id: "prestasi",label: "Prestasi Nasional",  icon: "🥇" },
  ];

  const toggleTopic = (id) => setTopics(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id]);

  const handleSubmit = () => {
    if (!email.includes("@")) {
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Masukkan email yang valid!", type: "error" } }));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        const subs = JSON.parse(localStorage.getItem("koni-subscribers") || "[]");
        if (!subs.find(s => s.email === email)) {
          subs.push({ name, email, topics, subscribedAt: new Date().toISOString() });
          localStorage.setItem("koni-subscribers", JSON.stringify(subs));
        }
      } catch {}
      setLoading(false);
      setDone(true);
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "🎉 Berhasil berlangganan newsletter KONI!", type: "success" } }));
      window.dispatchEvent(new CustomEvent("koni-badge-earned", { detail: { id: "subscriber", icon: "📬", name: "Subscriber", desc: "Berlangganan newsletter KONI", color: "#3B82F6" } }));
    }, 1200);
  };

  if (done) return (
    <section style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`, padding: "5rem 2rem", textAlign: "center" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>📬</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 8 }}>
          Berhasil Berlangganan!
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
          Terima kasih <strong style={{ color: COLORS.gold }}>{name || email}</strong>! Kamu akan mendapat update terbaru dari KONI Pusat sesuai topik yang dipilih.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {topics.map(t => {
            const topic = TOPIC_LIST.find(tl => tl.id === t);
            return topic && (
              <span key={t} style={{ background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}30`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: COLORS.gold }}>
                {topic.icon} {topic.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );

  return (
    <section style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyMid})`, padding: "5rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,150,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,12,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "5%", top: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,150,12,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <Bell size={20} color={COLORS.gold} />
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>Newsletter</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#fff", margin: "0 0 0.75rem" }}>
            Tetap Update Bersama KONI
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8 }}>
            Dapatkan informasi terbaru seputar olahraga Indonesia langsung di inbox kamu.
          </p>
        </div>

        {/* Topic selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
          {TOPIC_LIST.map(t => (
            <button key={t.id} onClick={() => toggleTopic(t.id)} style={{
              padding: "8px 14px", borderRadius: 100,
              background: topics.includes(t.id) ? `${COLORS.gold}20` : "rgba(255,255,255,0.06)",
              border: `1px solid ${topics.includes(t.id) ? COLORS.gold : "rgba(255,255,255,0.12)"}`,
              color: topics.includes(t.id) ? COLORS.gold : "rgba(255,255,255,0.5)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460, margin: "0 auto" }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama kamu (opsional)"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0 16px", gap: 10 }}>
              <Mail size={16} color="rgba(255,255,255,0.4)" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="email@kamu.com"
                style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 13, outline: "none", padding: "12px 0", fontFamily: "inherit" }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!email || loading}
              style={{
                background: email && !loading ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : "rgba(255,255,255,0.08)",
                border: "none", borderRadius: 10, padding: "12px 16px",
                color: "#fff", cursor: email && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: email && !loading ? "0 4px 20px rgba(204,0,0,0.3)" : "none",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >
              {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                : <ArrowRight size={18} />}
            </button>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            🔒 Data kamu aman. Tidak ada spam. Berhenti berlangganan kapan saja.
          </div>
        </div>
      </div>
    </section>
  );
}
