import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../data/constants";

function InputField({ label, type = "text", value, onChange, placeholder, icon, error, hint }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPass = type === "password";

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: focused ? COLORS.gold : "rgba(255,255,255,0.55)",
        marginBottom: 8, transition: "color 0.2s",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, opacity: 0.5, pointerEvents: "none",
          }}>
            {icon}
          </span>
        )}
        <input
          type={isPass && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: `12px ${isPass ? "44px" : "14px"} 12px ${icon ? "42px" : "14px"}`,
            background: focused ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? COLORS.merah : focused ? COLORS.gold : "rgba(255,255,255,0.15)"}`,
            borderRadius: 6,
            color: COLORS.putih,
            fontSize: 14,
            outline: "none",
            transition: "all 0.2s",
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              fontSize: 16, opacity: 0.5, padding: 4,
              color: COLORS.putih,
            }}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: "#FF6B6B", margin: "6px 0 0", paddingLeft: 2 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "6px 0 0", paddingLeft: 2 }}>{hint}</p>}
    </div>
  );
}

function Divider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.5rem 0" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

export default function LoginPage({ onClose, onSwitchRegister, onSwitchReset }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [remember, setRemember] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Minimal 6 karakter";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await login(email, password);
      onClose?.();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoFill = (acc) => {
    if (acc === "atlet") { setEmail("atlet@koni.or.id"); setPassword("Koni2026!"); setAccountType('user'); }
    else if (acc === "official") { setEmail("official@koni.or.id"); setPassword("Koni2026!"); setAccountType('user'); }
    else { setEmail("admin@koni.or.id"); setPassword("AdminKoni2026!"); setAccountType('admin'); }
    setApiError(""); setErrors({});
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          border: `2px solid ${COLORS.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, margin: "0 auto 1rem",
          boxShadow: `0 0 24px rgba(204,0,0,0.35)`,
        }}>🔐</div>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700,
          color: COLORS.putih, margin: "0 0 6px",
        }}>
          Masuk ke Portal KONI
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
          Sistem Informasi Manajemen Olahraga Nasional
        </p>
      </div>

      {/* Demo shortcut */}
      <div style={{
        background: "rgba(184,150,12,0.08)", border: `1px solid ${COLORS.border}`,
        borderRadius: 8, padding: "10px 14px", marginBottom: "1.5rem",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 11, color: COLORS.gold, fontWeight: 600, letterSpacing: "0.08em" }}>DEMO AKUN:</span>
        <button onClick={() => demoFill("atlet")} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: COLORS.putih, fontSize: 11, padding: "4px 10px", borderRadius: 4,
          cursor: "pointer", fontWeight: 600,
        }}>
          👤 Atlet
        </button>
        <button onClick={() => demoFill("official")} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: COLORS.putih, fontSize: 11, padding: "4px 10px", borderRadius: 4,
          cursor: "pointer", fontWeight: 600,
        }}>
          🎖️ Official
        </button>
        <button onClick={() => demoFill("admin")} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          color: COLORS.putih, fontSize: 11, padding: "4px 10px", borderRadius: 4,
          cursor: "pointer", fontWeight: 600,
        }}>
          🛡️ Admin
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {['user', 'admin'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: accountType === type ? `1px solid ${COLORS.gold}` : "1px solid rgba(255,255,255,0.16)",
              background: accountType === type ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: COLORS.putih,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {type === 'admin' ? 'Admin Login' : 'User Login'}
          </button>
        ))}
      </div>

      {/* Error */}
      {apiError && (
        <div style={{
          background: "rgba(204,0,0,0.12)", border: `1px solid rgba(204,0,0,0.4)`,
          borderRadius: 6, padding: "10px 14px", marginBottom: "1.25rem",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>⚠️</span>
          <span style={{ fontSize: 13, color: "#FF6B6B" }}>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email" type="email" icon="✉️"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="nama@koni.or.id"
          error={errors.email}
        />
        <InputField
          label="Password" type="password" icon="🔒"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Masukkan password"
          error={errors.password}
        />

        {/* Remember & Forgot */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              style={{ accentColor: COLORS.gold }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Ingat saya</span>
          </label>
          <button type="button" onClick={onSwitchReset} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: COLORS.gold, fontWeight: 600,
          }}>
            Lupa password?
          </button>
        </div>

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "rgba(204,0,0,0.5)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          color: COLORS.putih, border: "none", borderRadius: 6,
          fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 20px rgba(204,0,0,0.4)",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 14, height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Memverifikasi...
            </>
          ) : "Masuk ke Portal"}
        </button>
      </form>

      <Divider text="atau" />

      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Belum punya akun? </span>
        <button onClick={onSwitchRegister} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: COLORS.gold, fontWeight: 700,
        }}>
          Daftar Sekarang →
        </button>
      </div>

      {/* Security badge */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, marginTop: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem",
      }}>
        <span style={{ fontSize: 12 }}>🛡️</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
          DIPROTEKSI SSL · DATA TERENKRIPSI AES-256 · SISTEM RESMI KONI
        </span>
      </div>
    </div>
  );
}
