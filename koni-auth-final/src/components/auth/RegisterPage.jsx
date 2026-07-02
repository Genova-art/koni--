import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../data/constants";

const CABOR_LIST = ["Atletik","Renang","Bulutangkis","Angkat Besi","Pencak Silat","Panahan","Sepak Bola","Voli","Basket","Tinju","Judo","Karate","Taekwondo","Lainnya"];
const PROVINSI_LIST = ["DKI Jakarta","Jawa Barat","Jawa Tengah","Jawa Timur","Banten","Sumatera Utara","Sumatera Barat","Sumatera Selatan","Kalimantan Timur","Sulawesi Selatan","Bali","D.I. Yogyakarta","Lainnya"];
const ROLE_LIST = ["Atlet","Pelatih","Official","Wasit","Pengurus","Media","Umum"];

function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)", marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#FF6B6B", margin: "5px 0 0" }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
};

export default function RegisterPage({ onSwitchLogin }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nama: "", nik: "", email: "", password: "", confirm: "",
    role: "", cabor: "", provinsi: "", telp: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validateStep1 = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.nik || form.nik.length !== 16) e.nik = "NIK harus 16 digit";
    if (!form.telp) e.telp = "Nomor telepon wajib diisi";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.role) e.role = "Peran wajib dipilih";
    if (!form.cabor) e.cabor = "Cabang olahraga wajib dipilih";
    if (!form.provinsi) e.provinsi = "Provinsi wajib dipilih";
    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
    if (!form.password || form.password.length < 8) e.password = "Minimal 8 karakter";
    if (form.password !== form.confirm) e.confirm = "Password tidak cocok";
    return e;
  };

  const nextStep = () => {
    const e = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {};
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const e = validateStep3();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError(""); setLoading(true);
    try {
      await register(form);
      setDone(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <div style={{ fontSize: 60, marginBottom: "1.25rem" }}>🎉</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", margin: "0 0 12px" }}>
        Pendaftaran Berhasil!
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto 2rem" }}>
        Akun Anda sedang dalam proses verifikasi oleh tim KONI. Anda akan menerima konfirmasi melalui email <strong style={{ color: COLORS.gold }}>{form.email}</strong> dalam 1×24 jam.
      </p>
      <div style={{
        background: "rgba(184,150,12,0.08)", border: `1px solid ${COLORS.border}`,
        borderRadius: 8, padding: "1rem", marginBottom: "1.5rem",
        display: "inline-block",
      }}>
        <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: "0.1em", marginBottom: 4 }}>NO. REGISTRASI</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>
          KONI-{Date.now().toString().slice(-8)}
        </div>
      </div>
      <br />
      <button onClick={onSwitchLogin} style={{
        background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
        color: "#fff", border: "none", padding: "12px 32px",
        borderRadius: 6, fontSize: 13, fontWeight: 700,
        letterSpacing: "0.08em", cursor: "pointer",
      }}>
        Kembali ke Login →
      </button>
    </div>
  );

  const steps = ["Data Diri", "Keanggotaan", "Akun & Keamanan"];

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", margin: "0 0 4px" }}>
          Pendaftaran Anggota KONI
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Lengkapi data untuk mendaftar sebagai anggota resmi
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: i + 1 < step ? COLORS.gold : i + 1 === step ? COLORS.merah : "rgba(255,255,255,0.1)",
                border: `2px solid ${i + 1 <= step ? (i + 1 < step ? COLORS.gold : COLORS.merah) : "rgba(255,255,255,0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
                transition: "all 0.3s",
              }}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 10, marginTop: 5, textAlign: "center",
                color: i + 1 === step ? COLORS.gold : "rgba(255,255,255,0.3)",
                fontWeight: i + 1 === step ? 700 : 400,
                letterSpacing: "0.05em",
              }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1, marginBottom: 20,
                background: i + 1 < step ? COLORS.gold : "rgba(255,255,255,0.1)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {apiError && (
        <div style={{
          background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.4)",
          borderRadius: 6, padding: "10px 14px", marginBottom: "1rem",
          fontSize: 13, color: "#FF6B6B",
        }}>
          ⚠️ {apiError}
        </div>
      )}

      {/* Step 1: Data Diri */}
      {step === 1 && (
        <div>
          <Field label="Nama Lengkap" error={errors.nama}>
            <input style={inputStyle} placeholder="Sesuai KTP" value={form.nama} onChange={set("nama")} />
          </Field>
          <Field label="NIK (16 digit)" error={errors.nik}>
            <input style={inputStyle} placeholder="3201XXXXXXXXXXXX" maxLength={16}
              value={form.nik} onChange={set("nik")} />
          </Field>
          <Field label="Nomor Telepon / WhatsApp" error={errors.telp}>
            <input style={inputStyle} placeholder="08XXXXXXXXXX" value={form.telp} onChange={set("telp")} />
          </Field>
        </div>
      )}

      {/* Step 2: Keanggotaan */}
      {step === 2 && (
        <div>
          <Field label="Peran / Jabatan" error={errors.role}>
            <select style={{ ...inputStyle, appearance: "none" }} value={form.role} onChange={set("role")}>
              <option value="">-- Pilih Peran --</option>
              {ROLE_LIST.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Cabang Olahraga" error={errors.cabor}>
            <select style={{ ...inputStyle, appearance: "none" }} value={form.cabor} onChange={set("cabor")}>
              <option value="">-- Pilih Cabor --</option>
              {CABOR_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Provinsi Asal" error={errors.provinsi}>
            <select style={{ ...inputStyle, appearance: "none" }} value={form.provinsi} onChange={set("provinsi")}>
              <option value="">-- Pilih Provinsi --</option>
              {PROVINSI_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
      )}

      {/* Step 3: Akun */}
      {step === 3 && (
        <div>
          <Field label="Email Aktif" error={errors.email}>
            <input style={inputStyle} type="email" placeholder="email@domain.com" value={form.email} onChange={set("email")} />
          </Field>
          <Field label="Password" error={errors.password}>
            <input style={inputStyle} type="password" placeholder="Min. 8 karakter" value={form.password} onChange={set("password")} />
          </Field>
          <Field label="Konfirmasi Password" error={errors.confirm}>
            <input style={inputStyle} type="password" placeholder="Ulangi password" value={form.confirm} onChange={set("confirm")} />
          </Field>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" required style={{ marginTop: 2, accentColor: COLORS.gold }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Saya menyetujui <span style={{ color: COLORS.gold }}>Syarat & Ketentuan</span> dan <span style={{ color: COLORS.gold }}>Kebijakan Privasi</span> KONI Pusat.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: "0.5rem" }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{
            flex: 1, padding: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            ← Kembali
          </button>
        )}
        <button
          onClick={step < 3 ? nextStep : handleSubmit}
          disabled={loading}
          style={{
            flex: 1, padding: "12px",
            background: loading ? "rgba(204,0,0,0.5)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
            border: "none", color: "#fff", borderRadius: 6,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(204,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 13, height: 13,
                border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              Mendaftar...
            </>
          ) : step < 3 ? "Lanjut →" : "Daftar Sekarang"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Sudah punya akun? </span>
        <button onClick={onSwitchLogin} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: COLORS.gold, fontWeight: 700,
        }}>
          Masuk →
        </button>
      </div>
    </div>
  );
}
