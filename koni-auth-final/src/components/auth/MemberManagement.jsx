import { useEffect, useMemo, useState } from "react";
import { COLORS } from "../../data/constants";
import { authService } from "../../services/authService";

export default function MemberManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await authService.getAllUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal memuat data anggota.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      const name = (user.name || user.nama || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const matchSearch = !keyword || name.includes(keyword) || email.includes(keyword);
      const matchStatus = !status || user.status === status;
      const matchRole = !role || user.role === role;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, status, role]);

  const updateStatus = async (userId, nextStatus) => {
    try {
      await authService.updateUserStatus(userId, nextStatus);
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, status: nextStatus } : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengubah status anggota.");
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: "0 0 1.25rem" }}>
        Manajemen Anggota
      </h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email"
          style={fieldStyle}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldStyle}>
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={fieldStyle}>
          <option value="">Semua Role</option>
          <option value="Atlet">Atlet</option>
          <option value="Pelatih">Pelatih</option>
          <option value="Official">Official</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={loadUsers} style={buttonStyle}>Refresh</button>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.35)",
          borderRadius: 6,
          color: "#FFB4B4",
          padding: "10px 12px",
          marginBottom: "1rem",
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.6)", padding: "2rem", textAlign: "center" }}>
          Memuat data anggota...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ color: "rgba(255,255,255,0.6)", padding: "2rem", textAlign: "center" }}>
          Tidak ada anggota ditemukan.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filteredUsers.map((user) => (
            <div key={user.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "1rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
            }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                  {user.name || user.nama || "Tanpa Nama"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 3 }}>
                  {user.email} - {user.role || "-"} - {user.provinsi || "-"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{
                  color: statusColor(user.status),
                  background: `${statusColor(user.status)}22`,
                  border: `1px solid ${statusColor(user.status)}55`,
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {user.status || "Unknown"}
                </span>
                {user.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(user.id, "Aktif")} style={smallButton("#22c55e")}>Approve</button>
                    <button onClick={() => updateStatus(user.id, "Inactive")} style={smallButton("#ef4444")}>Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const fieldStyle = {
  padding: "9px 12px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 13,
};

const buttonStyle = {
  ...fieldStyle,
  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
  cursor: "pointer",
  fontWeight: 700,
};

const smallButton = (color) => ({
  border: `1px solid ${color}55`,
  background: `${color}22`,
  color,
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
});

function statusColor(status) {
  if (status === "Aktif") return "#22c55e";
  if (status === "Pending") return "#fbbf24";
  if (status === "Inactive") return "#ef4444";
  return "#94a3b8";
}
