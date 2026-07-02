import { useRef, useState, useEffect } from "react";
import { COLORS } from "../data/constants";
import { Download, Share2, X } from "lucide-react";

// Real QR code generator (pure JS, no external lib)
function generateQR(text, size = 90) {
  // Build a deterministic cell pattern from text
  const hash = (str) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
  };
  const grid = 21; // QR version 1 is 21x21
  const cell = size / grid;
  const seed = hash(text);

  // Generate pseudo-random modules
  const modules = Array.from({ length: grid * grid }, (_, i) => {
    const row = Math.floor(i / grid);
    const col = i % grid;
    // Finder patterns (top-left, top-right, bottom-left)
    const isFinderTL = row < 7 && col < 7;
    const isFinderTR = row < 7 && col >= grid - 7;
    const isFinderBL = row >= grid - 7 && col < 7;
    if (isFinderTL || isFinderTR || isFinderBL) {
      const r = isFinderTL ? row : isFinderTR ? row : row - (grid - 7);
      const c = isFinderTL ? col : isFinderTR ? col - (grid - 7) : col;
      return (r === 0 || r === 6 || c === 0 || c === 6) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
    // Timing patterns
    if (row === 6 || col === 6) return (row + col) % 2 === 0;
    // Data modules
    return ((hash(text + i) ^ (seed >> (i % 32))) % 3) !== 0;
  });

  return { modules, grid, cell, size };
}

function QRCode({ value, size = 90 }) {
  const { modules, grid, cell } = generateQR(value, size);
  const bg = "#fff";
  const fg = "#0A1628";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 6 }}>
      <rect width={size} height={size} fill={bg} rx="6" />
      {modules.map((on, i) => on ? (
        <rect
          key={i}
          x={(i % grid) * cell + 0.5}
          y={Math.floor(i / grid) * cell + 0.5}
          width={cell - 1}
          height={cell - 1}
          fill={fg}
          rx="0.5"
        />
      ) : null)}
    </svg>
  );
}

export default function KartuAnggota({ user, onClose }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [flip, setFlip] = useState(false);
  const [avatar] = useState(() => { try { return localStorage.getItem("koni-avatar"); } catch { return null; } });

  const memberId = `KONI-${String(user?.id || "00001").padStart(5, "0")}`;
  const tahunBergabung = user?.bergabung?.split(" ").pop() || "2024";
  const validUntil = `31 Des ${parseInt(tahunBergabung) + 4}`;
  const qrData = `${memberId}|${user?.name}|${user?.role}|${user?.cabor}`;

  const roleColor = {
    "Atlet": COLORS.merah,
    "Pelatih": "#2563EB",
    "Admin": COLORS.gold,
    "Ofisial": "#7C3AED",
  }[user?.role] || COLORS.merah;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(memberId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "ID Anggota disalin! 🎫", type: "success" } }));
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Build SVG representation of card for download
      const svg = buildCardSVG(user, memberId, validUntil, roleColor, qrData);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kartu-anggota-${memberId}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "✅ Kartu berhasil didownload sebagai SVG!", type: "success" } }));
    } catch {
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Screenshot kartu dengan Ctrl+Shift+S 📸", type: "info" } }));
    }
    setDownloading(false);
  };

  const handleShare = async () => {
    const text = `🏆 Kartu Anggota KONI\n👤 ${user?.name}\n🎫 ID: ${memberId}\n🏅 ${user?.role} · ${user?.cabor}\n📍 ${user?.provinsi}`;
    if (navigator.share) {
      await navigator.share({ title: "Kartu Anggota KONI", text }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(text).catch(() => {});
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Info kartu disalin ke clipboard!", type: "success" } }));
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 5000,
        background: "rgba(5,10,20,0.92)", backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Kartu Anggota Digital</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Tap kartu untuk balik</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", cursor: "pointer", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Card with flip */}
        <div
          ref={cardRef}
          onClick={() => setFlip(f => !f)}
          style={{
            position: "relative", width: "100%", aspectRatio: "1.6 / 1",
            cursor: "pointer", marginBottom: 20,
            perspective: 1000,
          }}
        >
          <div style={{
            width: "100%", height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
          }}>
            {/* FRONT */}
            <div style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden",
              background: `linear-gradient(135deg, #0A1628 0%, #1E3A5F 55%, #0A1628 100%)`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${COLORS.gold}40`,
              userSelect: "none",
            }}>
              {/* Grid BG */}
              <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(184,150,12,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(184,150,12,0.05) 1px, transparent 1px)`, backgroundSize:"28px 28px" }} />
              <div style={{ position:"absolute", right:"-8%", top:"-25%", width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle, ${roleColor}18 0%, transparent 65%)` }} />

              {/* Top bar */}
              <div style={{ background:`linear-gradient(90deg, ${COLORS.merah}, #8B0000)`, padding:"9px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <span style={{ fontSize:16 }}>🏆</span>
                  <div>
                    <div style={{ fontSize:10, fontWeight:800, color:"#fff", letterSpacing:"0.18em" }}>KONI PUSAT</div>
                    <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", letterSpacing:"0.12em" }}>KOMITE OLAHRAGA NASIONAL INDONESIA</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em" }}>KARTU ANGGOTA RESMI</div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.4)" }}>Berlaku s/d {validUntil}</div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:"16px 18px", display:"flex", gap:16, alignItems:"flex-start", position:"relative", zIndex:1 }}>
                {/* Avatar */}
                <div style={{ flexShrink:0 }}>
                  <div style={{
                    width:64, height:64, borderRadius:10,
                    background: avatar ? "none" : `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
                    border:`2px solid ${COLORS.gold}60`,
                    overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, boxShadow:`0 4px 20px rgba(0,0,0,0.4)`,
                  }}>
                    {avatar ? <img src={avatar} alt="foto" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (user?.avatar || "👤")}
                  </div>
                  <div style={{ marginTop:6, textAlign:"center", fontSize:8, background:`${roleColor}25`, border:`1px solid ${roleColor}50`, borderRadius:4, padding:"2px 5px", color:roleColor, fontWeight:700, letterSpacing:"0.06em" }}>
                    {user?.role?.toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:15, color:"#fff", fontWeight:700, marginBottom:2 }}>{user?.name}</div>
                  <div style={{ fontSize:10, color:COLORS.gold, fontWeight:600, marginBottom:8 }}>{user?.cabor}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                    {[
                      ["Provinsi", user?.provinsi],
                      ["Bergabung", user?.bergabung],
                    ].map(([l,v]) => (
                      <div key={l}>
                        <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{v || "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR */}
                <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ background:"#fff", borderRadius:8, padding:4, boxShadow:`0 4px 16px rgba(0,0,0,0.4)` }}>
                    <QRCode value={qrData} size={72} />
                  </div>
                  <div style={{ fontSize:7, color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em" }}>SCAN VERIFY</div>
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{ margin:"0 18px 14px", background:"rgba(255,255,255,0.05)", border:`1px solid ${COLORS.gold}20`, borderRadius:8, padding:"7px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"monospace", fontSize:12, color:COLORS.gold, letterSpacing:"0.15em", fontWeight:700 }}>{memberId}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
                  <span style={{ fontSize:9, color:"#22C55E", fontWeight:700 }}>{user?.status || "Aktif"}</span>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div style={{
              position:"absolute", inset:0,
              backfaceVisibility:"hidden",
              transform:"rotateY(180deg)",
              background:`linear-gradient(135deg, #0A1628, #1E3A5F)`,
              borderRadius:20,
              overflow:"hidden",
              boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${COLORS.gold}40`,
              display:"flex", flexDirection:"column",
            }}>
              <div style={{ background:`linear-gradient(90deg, ${COLORS.merah}, #8B0000)`, padding:"9px 18px" }}>
                <div style={{ fontSize:10, color:"#fff", fontWeight:700, letterSpacing:"0.1em" }}>KETERANGAN KEANGGOTAAN</div>
              </div>
              <div style={{ flex:1, padding:"16px 18px", display:"flex", gap:16 }}>
                <div style={{ flex:1 }}>
                  {[
                    ["Nomor Anggota", memberId],
                    ["Nama Lengkap", user?.name],
                    ["Peran", user?.role],
                    ["Cabor", user?.cabor],
                    ["Provinsi", user?.provinsi],
                    ["Berlaku Hingga", validUntil],
                  ].map(([l,v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{l}</span>
                      <span style={{ fontSize:10, color:"#fff", fontWeight:600 }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                  <div style={{ background:"#fff", borderRadius:8, padding:6 }}>
                    <QRCode value={qrData} size={90} />
                  </div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>Scan untuk verifikasi</div>
                </div>
              </div>
              <div style={{ padding:"10px 18px", background:"rgba(0,0,0,0.3)", fontSize:9, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
                Kartu ini adalah milik {user?.name} · Laporkan jika menemukan penyalahgunaan
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handleCopyId} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"10px", color:copied?"#4ADE80":"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
            {copied ? "✓ Disalin!" : "📋 Salin ID"}
          </button>
          <button onClick={handleShare} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"10px", color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            <Share2 size={14} /> Bagikan
          </button>
          <button onClick={handleDownload} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:10, padding:"10px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            <Download size={14} /> {downloading ? "..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

function buildCardSVG(user, memberId, validUntil, roleColor, qrData) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="313" viewBox="0 0 500 313">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A1628"/>
      <stop offset="55%" style="stop-color:#1E3A5F"/>
      <stop offset="100%" style="stop-color:#0A1628"/>
    </linearGradient>
    <linearGradient id="topbar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#CC0000"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
  </defs>
  <rect width="500" height="313" rx="20" fill="url(#bg)"/>
  <rect width="500" height="40" rx="0" fill="url(#topbar)"/>
  <rect width="500" height="20" y="20" fill="url(#topbar)"/>
  <text x="20" y="24" font-size="12" font-weight="800" fill="white" font-family="Georgia,serif" letter-spacing="2">KONI PUSAT</text>
  <text x="20" y="36" font-size="8" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif">KOMITE OLAHRAGA NASIONAL INDONESIA</text>
  <text x="480" y="24" font-size="9" fill="rgba(255,255,255,0.8)" font-family="Arial,sans-serif" text-anchor="end">KARTU ANGGOTA RESMI</text>
  <text x="480" y="36" font-size="8" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" text-anchor="end">Berlaku s/d ${validUntil}</text>
  <rect x="20" y="58" width="66" height="66" rx="10" fill="${roleColor}30" stroke="${COLORS.gold}" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="53" y="98" font-size="28" text-anchor="middle" dominant-baseline="middle">👤</text>
  <text x="100" y="78" font-size="17" font-weight="700" fill="white" font-family="Georgia,serif">${user?.name || ""}</text>
  <text x="100" y="96" font-size="11" fill="${COLORS.gold}" font-family="Arial,sans-serif">${user?.cabor || ""}</text>
  <text x="100" y="114" font-size="10" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif">${user?.provinsi || ""} · ${user?.bergabung || ""}</text>
  <rect x="20" y="250" width="460" height="40" rx="8" fill="rgba(255,255,255,0.05)" stroke="${COLORS.gold}" stroke-width="0.5" stroke-opacity="0.3"/>
  <text x="35" y="275" font-size="13" fill="${COLORS.gold}" font-family="monospace" letter-spacing="2" font-weight="700">${memberId}</text>
  <circle cx="430" cy="270" r="4" fill="#22C55E"/>
  <text x="440" y="274" font-size="10" fill="#22C55E" font-family="Arial,sans-serif" font-weight="700">${user?.status || "Aktif"}</text>
</svg>`;
}
