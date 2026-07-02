import { useState, useEffect } from "react";
import { COLORS } from "../data/constants";

const REACTIONS = [
  { emoji: "🔥", label: "Keren", color: "#F97316" },
  { emoji: "❤️", label: "Suka",  color: "#EF4444" },
  { emoji: "💪", label: "Semangat", color: "#3B82F6" },
  { emoji: "🏆", label: "Juara", color: COLORS.gold },
];

function FloatingEmoji({ emoji, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <span style={{
      position: "absolute", bottom: "100%", left: "50%",
      fontSize: 20, pointerEvents: "none",
      animation: "emojiBurst 1.2s ease-out forwards",
      zIndex: 10,
    }}>
      {emoji}
      <style>{`
        @keyframes emojiBurst {
          0%   { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-60px) scale(1.6); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

export default function ReactionButton({ itemId }) {
  const storageKey = `koni-reactions-${itemId}`;
  const [counts, setCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch { return {}; }
  });
  const [myReaction, setMyReaction] = useState(() => {
    try { return localStorage.getItem(`${storageKey}-mine`) || null; }
    catch { return null; }
  });
  const [bursts, setBursts] = useState([]);

  const handleReact = (emoji) => {
    const isRemoving = myReaction === emoji;
    const next = { ...counts };
    if (myReaction && next[myReaction]) next[myReaction] = Math.max(0, (next[myReaction] || 0) - 1);
    if (!isRemoving) {
      next[emoji] = (next[emoji] || 0) + 1;
      setBursts(b => [...b, { emoji, id: Date.now() }]);
    }
    setCounts(next);
    const newReaction = isRemoving ? null : emoji;
    setMyReaction(newReaction);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      if (newReaction) localStorage.setItem(`${storageKey}-mine`, newReaction);
      else localStorage.removeItem(`${storageKey}-mine`);
    } catch {}
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      {REACTIONS.map(r => (
        <div key={r.emoji} style={{ position: "relative" }}>
          {bursts.filter(b => b.emoji === r.emoji).map(b => (
            <FloatingEmoji key={b.id} emoji={r.emoji} id={b.id} onDone={() => setBursts(p => p.filter(x => x.id !== b.id))} />
          ))}
          <button
            onClick={() => handleReact(r.emoji)}
            title={r.label}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 100,
              background: myReaction === r.emoji ? `${r.color}20` : "rgba(0,0,0,0.04)",
              border: `1px solid ${myReaction === r.emoji ? r.color + "60" : "rgba(0,0,0,0.1)"}`,
              cursor: "pointer", transition: "all 0.2s",
              transform: myReaction === r.emoji ? "scale(1.06)" : "scale(1)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = myReaction === r.emoji ? "scale(1.06)" : "scale(1)"}
          >
            <span style={{ fontSize: 14 }}>{r.emoji}</span>
            {counts[r.emoji] > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: myReaction === r.emoji ? r.color : "#666" }}>
                {counts[r.emoji]}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
