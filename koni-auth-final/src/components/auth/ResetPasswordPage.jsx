import { useState } from "react";
import { authService } from "../../services/authService";
import { COLORS } from "../../data/constants";

export default function ResetPasswordPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || params.get("resetToken");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("Token reset password tidak ditemukan.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Reset password gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: COLORS.gradient,
      padding: 20,
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 420,
        background: `linear-gradient(160deg, ${COLORS.navyMid}, ${COLORS.navy})`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "2rem",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
      }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 24, margin: "0 0 8px" }}>
          Reset Password
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, margin: "0 0 1.5rem" }}>
          Masukkan password baru untuk akun KONI Anda.
        </p>

        {success ? (
          <div style={{ color: COLORS.success, fontWeight: 700, fontSize: 14 }}>
            Password berhasil diubah. Anda akan diarahkan ke beranda...
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: 6,
                color: "#FFB4B4",
                fontSize: 13,
                padding: "10px 12px",
                marginBottom: "1rem",
              }}>
                {error}
              </div>
            )}

            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 6,
                color: "#fff",
                marginBottom: "1rem",
              }}
            />

            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 6,
                color: "#fff",
                marginBottom: "1.5rem",
              }}
            />

            <button type="submit" disabled={loading} style={{
              width: "100%",
              padding: 13,
              border: "none",
              borderRadius: 6,
              background: loading ? "rgba(204,0,0,0.5)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
