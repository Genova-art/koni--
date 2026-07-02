import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../data/constants";

const CABOR_LIST = ["Atletik", "Renang", "Bulutangkis", "Angkat Besi", "Pencak Silat", "Panahan", "Sepak Bola", "Voli", "Basket", "Tinju", "Judo", "Karate", "Taekwondo"];
const PROVINSI_LIST = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan", "Bali"];
const AVATAR_OPTIONS = ["👤", "👨", "👩", "🧑", "👨‍🦱", "👩‍🦱"];

function Field({ label, type = "text", value, onChange, placeholder, error, options, icon }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)", marginBottom: 8,
            }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                {icon && (
                    <span style={{
                        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                        fontSize: 14, opacity: 0.6, pointerEvents: "none",
                    }}>
                        {icon}
                    </span>
                )}
                {options ? (
                    <select
                        value={value}
                        onChange={onChange}
                        style={{
                            width: "100%", boxSizing: "border-box",
                            padding: `11px 14px ${icon ? "11px 42px" : "11px 14px"}`,
                            background: "rgba(255,255,255,0.04)",
                            border: error ? `1px solid #FF6B6B` : "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
                            appearance: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="">Pilih {label}</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        style={{
                            width: "100%", boxSizing: "border-box",
                            padding: `11px 14px ${icon ? "11px 42px" : "11px 14px"}`,
                            background: "rgba(255,255,255,0.04)",
                            border: error ? `1px solid #FF6B6B` : "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
                        }}
                    />
                )}
            </div>
            {error && <p style={{ fontSize: 11, color: "#FF6B6B", margin: "6px 0 0" }}>{error}</p>}
        </div>
    );
}

export default function EditProfil({ user, onClose }) {
    const { updateProfile } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        telp: user?.telp || "",
        cabor: user?.cabor || "",
        provinsi: user?.provinsi || "",
        avatar: user?.avatar || "👤",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Nama wajib diisi";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
        if (!form.telp) e.telp = "Nomor telepon wajib diisi";
        else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(form.telp.replace(/\D/g, ''))) e.telp = "Format telepon tidak valid";
        if (!form.cabor) e.cabor = "Cabang olahraga wajib dipilih";
        if (!form.provinsi) e.provinsi = "Provinsi wajib dipilih";
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setApiError("");
        setSuccess(false);
        setLoading(true);
        try {
            await updateProfile(form);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose?.();
            }, 1500);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: 54, marginBottom: "1rem", animation: "bounce 0.6s" }}>✅</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", margin: 0, marginBottom: 8 }}>
                Profil Berhasil Diperbarui
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Semua perubahan telah tersimpan</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* Header */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{
                    fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", margin: "0 0 8px",
                }}>
                    Edit Profil Saya
                </h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                    Perbarui informasi pribadi dan data atlet Anda
                </p>
            </div>

            {/* Avatar Picker */}
            <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                    display: "block", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)", marginBottom: 12,
                }}>
                    Pilih Avatar Anda
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                    {AVATAR_OPTIONS.map((avatar) => (
                        <button key={avatar} type="button" onClick={() => setForm({ ...form, avatar })} style={{
                            width: 50, height: 50, borderRadius: "50%",
                            background: form.avatar === avatar ? `linear-gradient(135deg, ${COLORS.merah}, #8B0000)` : "rgba(255,255,255,0.06)",
                            border: form.avatar === avatar ? `2px solid ${COLORS.gold}` : "2px solid rgba(255,255,255,0.15)",
                            fontSize: 24, cursor: "pointer", transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {avatar}
                        </button>
                    ))}
                </div>
            </div>

            {/* API Error */}
            {apiError && (
                <div style={{
                    background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)",
                    borderRadius: 6, padding: "10px 12px", marginBottom: "1rem",
                    fontSize: 12, color: "#FF6B6B",
                }}>
                    ⚠️ {apiError}
                </div>
            )}

            {/* Form Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <Field label="Nama Lengkap" value={form.name} onChange={set("name")} placeholder="Nama Anda" error={errors.name} icon="👤" />
                <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="email@koni.or.id" error={errors.email} icon="📧" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <Field label="Nomor Telepon" type="tel" value={form.telp} onChange={set("telp")} placeholder="+62 812 3456 7890" error={errors.telp} icon="📱" />
                <Field label="Cabang Olahraga" value={form.cabor} onChange={set("cabor")} options={CABOR_LIST} error={errors.cabor} />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
                <Field label="Provinsi" value={form.provinsi} onChange={set("provinsi")} options={PROVINSI_LIST} error={errors.provinsi} />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: "1.5rem" }}>
                <button type="button" onClick={onClose} style={{
                    flex: 1, padding: "10px 16px", background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                    Batal
                </button>
                <button type="submit" disabled={loading} style={{
                    flex: 1, padding: "10px 16px",
                    background: loading ? "rgba(204,0,0,0.5)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                    border: "none", borderRadius: 6,
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    opacity: loading ? 0.7 : 1,
                }}>
                    {loading ? "⏳ Menyimpan..." : "💾 Simpan Perubahan"}
                </button>
            </div>
        </form>
    );
}
