import { useState, useRef } from "react";
import { COLORS } from "../data/constants";
import { Camera, X, Check, Upload } from "lucide-react";

export default function FotoProfilUpload({ user, onClose, onSave }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Pilih file gambar (JPG/PNG/WebP)", type: "error" } }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Ukuran file maksimal 5MB", type: "error" } }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (!preview) return;
    try { localStorage.setItem("koni-avatar", preview); } catch {}
    setSaved(true);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "Foto profil berhasil diperbarui! 📸", type: "success" } }));
    onSave?.(preview);
    setTimeout(onClose, 1200);
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, zIndex: 5700,
      background: "rgba(5,10,20,0.88)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", animation: "fadeInOverlay 0.2s ease",
    }}>
      <div style={{
        maxWidth: 420, width: "100%",
        background: "linear-gradient(160deg, #0A1628, #132040)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Camera size={16} color="#fff" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Upload Foto Profil</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* Current avatar */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: preview ? "none" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                border: `3px solid ${COLORS.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: preview ? "none" : 40, fontWeight: 700, color: "#fff",
                overflow: "hidden", margin: "0 auto",
                boxShadow: `0 0 24px ${COLORS.gold}30`,
              }}>
                {preview
                  ? <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (user?.avatar || "👤")}
              </div>
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: COLORS.gold, border: "2px solid #0A1628",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }} onClick={() => inputRef.current?.click()}>
                <Camera size={13} color="#000" />
              </div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
              {preview ? "Preview foto baru" : "Foto saat ini"}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? COLORS.gold : "rgba(255,255,255,0.15)"}`,
              borderRadius: 12, padding: "2rem",
              textAlign: "center", cursor: "pointer",
              background: dragOver ? `${COLORS.gold}08` : "rgba(255,255,255,0.03)",
              transition: "all 0.2s", marginBottom: "1.25rem",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
            onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          >
            <Upload size={24} color={dragOver ? COLORS.gold : "rgba(255,255,255,0.3)"} style={{ margin: "0 auto 10px" }} />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
              Drag & drop foto disini
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              atau klik untuk memilih · JPG, PNG, WebP · Maks 5MB
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "11px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, color: "rgba(255,255,255,0.6)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              Batal
            </button>
            <button onClick={handleSave} disabled={!preview || saved} style={{
              flex: 2, padding: "11px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: !preview ? "rgba(255,255,255,0.06)" : saved ? "rgba(34,197,94,0.2)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              border: `1px solid ${saved ? "#22C55E" : "transparent"}`,
              borderRadius: 10, color: !preview ? "rgba(255,255,255,0.3)" : "#fff",
              fontSize: 12, fontWeight: 700, cursor: !preview ? "default" : "pointer",
              boxShadow: preview && !saved ? "0 4px 16px rgba(204,0,0,0.3)" : "none",
              transition: "all 0.2s",
            }}>
              {saved ? <><Check size={14} /> Tersimpan!</> : <><Camera size={14} /> Simpan Foto</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
