import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { Award, X, Lock, CheckCircle } from "lucide-react";

const ALL_BADGES = [
  { id: "first_visit",    icon: "🌟", name: "Penjelajah",      desc: "Pertama kali mengunjungi website",        color: "#F59E0B", trigger: "visit" },
  { id: "quiz_done",      icon: "🧠", name: "Kuizzer",         desc: "Menyelesaikan kuis olahraga",              color: "#8B5CF6", trigger: "quiz" },
  { id: "quiz_master",    icon: "🏆", name: "Quiz Master",     desc: "Skor kuis di atas 100 poin",               color: COLORS.gold, trigger: "quiz_100" },
  { id: "streak_3",       icon: "🔥", name: "On Fire",         desc: "Streak 3 jawaban benar berturut-turut",    color: "#F97316", trigger: "streak_3" },
  { id: "easter_egg",     icon: "🎉", name: "Secret Hunter",   desc: "Menemukan Easter Egg KONI",                color: COLORS.merah, trigger: "easter_egg" },
  { id: "bookmarker",     icon: "🔖", name: "Kolektor",        desc: "Menyimpan 3 item ke bookmark",             color: "#06B6D4", trigger: "bookmark_3" },
  { id: "share_quiz",     icon: "📤", name: "Influencer",      desc: "Membagikan hasil kuis",                    color: "#EC4899", trigger: "share" },
  { id: "night_owl",      icon: "🦉", name: "Night Owl",       desc: "Mengunjungi di atas pukul 22.00",          color: "#6366F1", trigger: "night" },
  { id: "koni_lover",     icon: "❤️", name: "KONI Lover",      desc: "Bereaksi pada 5 berita",                   color: COLORS.merah, trigger: "react_5" },
  { id: "completionist",  icon: "💎", name: "Completionist",   desc: "Mengunjungi semua section",                color: "#14B8A6", trigger: "all_sections" },
];

function checkBadges() {
  try {
    const earned = JSON.parse(localStorage.getItem("koni-badges") || "[]");
    const hour   = new Date().getHours();
    const toAdd  = [];

    if (!earned.includes("first_visit")) toAdd.push("first_visit");
    if (hour >= 22 || hour < 4) if (!earned.includes("night_owl")) toAdd.push("night_owl");

    const reactions = JSON.parse(localStorage.getItem("koni-reaction-count") || "0");
    if (reactions >= 5 && !earned.includes("koni_lover")) toAdd.push("koni_lover");

    const bookmarks = JSON.parse(localStorage.getItem("koni-bookmarks") || "[]");
    if (bookmarks.length >= 3 && !earned.includes("bookmarker")) toAdd.push("bookmarker");

    const lb = JSON.parse(localStorage.getItem("koni-leaderboard") || "[]");
    const me = lb.find(e => e.isMe);
    if (me) {
      if (!earned.includes("quiz_done")) toAdd.push("quiz_done");
      if (me.skor >= 100 && !earned.includes("quiz_master")) toAdd.push("quiz_master");
      if (me.streak >= 3 && !earned.includes("streak_3")) toAdd.push("streak_3");
    }

    if (localStorage.getItem("koni-easter-found") && !earned.includes("easter_egg")) toAdd.push("easter_egg");
    if (localStorage.getItem("koni-shared-quiz") && !earned.includes("share_quiz")) toAdd.push("share_quiz");

    if (toAdd.length > 0) {
      const updated = [...earned, ...toAdd];
      localStorage.setItem("koni-badges", JSON.stringify(updated));
      return { earned: updated, new: toAdd };
    }
    return { earned, new: [] };
  } catch { return { earned: [], new: [] }; }
}

// Export for use elsewhere
export function awardBadge(triggerId) {
  try {
    const earned = JSON.parse(localStorage.getItem("koni-badges") || "[]");
    const badge = ALL_BADGES.find(b => b.trigger === triggerId || b.id === triggerId);
    if (badge && !earned.includes(badge.id)) {
      localStorage.setItem("koni-badges", JSON.stringify([...earned, badge.id]));
      window.dispatchEvent(new CustomEvent("koni-badge-earned", { detail: badge }));
    }
  } catch {}
}

export default function BadgeSystem() {
  const [open, setOpen]       = useState(false);
  const [badges, setBadges]   = useState([]);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    const { earned, new: newOnes } = checkBadges();
    setBadges(earned);
    if (newOnes.length > 0) {
      const badge = ALL_BADGES.find(b => b.id === newOnes[0]);
      if (badge) {
        setNewBadge(badge);
        setTimeout(() => setNewBadge(null), 4000);
      }
    }

    const onEarned = (e) => {
      setNewBadge(e.detail);
      setBadges(prev => [...new Set([...prev, e.detail.id])]);
      setTimeout(() => setNewBadge(null), 4000);
    };
    window.addEventListener("koni-badge-earned", onEarned);
    return () => window.removeEventListener("koni-badge-earned", onEarned);
  }, []);

  const earned = ALL_BADGES.filter(b => badges.includes(b.id));
  const locked = ALL_BADGES.filter(b => !badges.includes(b.id));

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        title={`${earned.length} Badge Diraih`}
        style={{
          position: "fixed", bottom: 156, left: 24, zIndex: 997,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(10,22,40,0.9)",
          border: `1px solid ${COLORS.gold}40`,
          borderRadius: 100, padding: "7px 12px",
          color: COLORS.gold, fontSize: 11, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}15`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,22,40,0.9)"; e.currentTarget.style.transform = "none"; }}
      >
        <Award size={13} />
        {earned.length}/{ALL_BADGES.length} Badge
      </button>

      {/* New badge notification */}
      {newBadge && (
        <div style={{
          position: "fixed", top: 120, left: "50%", transform: "translateX(-50%)",
          zIndex: 9996,
          background: `linear-gradient(135deg, ${newBadge.color}22, ${newBadge.color}44)`,
          border: `2px solid ${newBadge.color}`,
          borderRadius: 14, padding: "14px 24px",
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: `0 16px 48px ${newBadge.color}40`,
          animation: "slideUpModal 0.4s cubic-bezier(0.16,1,0.3,1)",
          minWidth: 280,
        }}>
          <div style={{ fontSize: 36 }}>{newBadge.icon}</div>
          <div>
            <div style={{ fontSize: 10, color: newBadge.color, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>🎖️ Badge Baru Diraih!</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{newBadge.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{newBadge.desc}</div>
          </div>
        </div>
      )}

      {/* Badge panel */}
      {open && (
        <div onClick={e => { if (e.target === e.currentTarget) setOpen(false); }} style={{
          position: "fixed", inset: 0, zIndex: 4800,
          background: "rgba(5,10,20,0.85)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem", animation: "fadeInOverlay 0.2s ease",
        }}>
          <div style={{
            maxWidth: 560, width: "100%",
            background: "linear-gradient(160deg, #0A1628, #132040)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
            animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
            maxHeight: "85vh", display: "flex", flexDirection: "column",
          }}>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Award size={18} color={COLORS.gold} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Badge & Achievement</span>
                <span style={{ background: COLORS.merah, borderRadius: 100, padding: "2px 8px", fontSize: 10, color: "#fff", fontWeight: 700 }}>{earned.length}/{ALL_BADGES.length}</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
            </div>

            <div style={{ overflowY: "auto", padding: "1.5rem" }}>
              {earned.length > 0 && (
                <>
                  <div style={{ fontSize: 10, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>✅ Diraih ({earned.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {earned.map(b => (
                      <div key={b.id} style={{ background: `${b.color}12`, border: `1px solid ${b.color}40`, borderRadius: 12, padding: "1rem", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ fontSize: 28, width: 44, height: 44, background: `${b.color}20`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${b.color}40` }}>{b.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{b.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{b.desc}</div>
                        </div>
                        <CheckCircle size={14} color={b.color} style={{ flexShrink: 0, marginLeft: "auto" }} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {locked.length > 0 && (
                <>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>🔒 Belum Diraih ({locked.length})</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                    {locked.map(b => (
                      <div key={b.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", display: "flex", gap: 12, alignItems: "center", opacity: 0.6 }}>
                        <div style={{ fontSize: 28, width: 44, height: 44, background: "rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, filter: "grayscale(1)" }}>{b.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{b.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{b.desc}</div>
                        </div>
                        <Lock size={12} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginLeft: "auto" }} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
