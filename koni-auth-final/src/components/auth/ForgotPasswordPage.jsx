import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../data/constants";

export default function ForgotPasswordPage({ onSwitchLogin }) {
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Masukkan email yang valid");
      return;
    }
    setError(""); setLoading(true);
    try {
      await sendResetEmail(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
      <div style={{ fontSize: 56, marginBottom: "1.25rem" }}>📧</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", margin: "0 0 12px" }}>
        Email Terkirim
      </h2>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 320, margin: "0 auto 1.5rem" }}>
        Instruksi reset password telah dikirimkan ke <strong style={{ color: COLORS.gold }}>{email}</strong>. Silakan periksa kotak masuk Anda.
      </p>
      <div style={{
        background: "rgba(184,150,12,0.08)", border: `1px solid ${COLORS.border}`,
        borderRadius: 8, padding: "10px 16px", marginBottom: "1.5rem",
        fontSize: 12, color: "rgba(255,255,255,0.45)",
      }}>
        ⏱️ Link reset berlaku selama <strong style={{ color: COLORS.gold }}>15 menit</strong>
      </div>
      <button onClick={onSwitchLogin} style={{
        background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
        color: "#fff", border: "none", padding: "12px 32px",
        borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer",
        letterSpacing: "0.08em",
      }}>
        Kembali ke Login
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 48, marginBottom: "1rem" }}>🔑</div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", margin: "0 0 8px" }}>
          Lupa Password
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>
          Masukkan email terdaftar Anda. Kami akan mengirimkan link untuk mereset password.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.35)",
          borderRadius: 6, padding: "10px 14px", marginBottom: "1rem",
          fontSize: 13, color: "#FF6B6B",
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)", marginBottom: 8,
        }}>
          Alamat Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Masukkan email terdaftar"
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 14px 12px 40px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 6, color: "#fff", fontSize: 14,
            outline: "none", marginBottom: "1.5rem",
          }}
        />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "rgba(184,150,12,0.4)" : `linear-gradient(135deg, ${COLORS.gold}, #8B6F00)`,
          color: "#fff", border: "none", borderRadius: 6,
          fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 20px rgba(184,150,12,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {loading ? (
            <>
              <span style={{
                display: "inline-block", width: 13, height: 13,
                border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              Mengirim...
            </>
          ) : "Kirim Link Reset Password"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={onSwitchLogin} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "rgba(255,255,255,0.45)",
        }}>
          ← Kembali ke Login
        </button>
      </div>
    </div>
  );
}
