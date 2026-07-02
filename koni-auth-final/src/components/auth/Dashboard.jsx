import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../data/constants";
import EditProfil from "./EditProfil";
import KartuAnggota from "../KartuAnggota";
import FotoProfilUpload from "../FotoProfilUpload";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, FileText, Bell, Shield,
  Download, RefreshCw, CheckCircle, XCircle, AlertCircle,
  Activity, Target, Calendar, Award, Zap, Clock,
} from "lucide-react";

import { authService } from "../../services/authService";
import { exportToCsv, getStoredDocuments, getStoredMessages, getStoredNews, saveStoredDocuments, saveStoredMessages, saveStoredNews } from "../../services/localData";

const memberMenu = [
  { id: "overview",     icon: "🏠", label: "Beranda" },
  { id: "profil",       icon: "👤", label: "Profil Saya" },
  { id: "kartu",        icon: "🎫", label: "Kartu Anggota" },
  { id: "prestasi",     icon: "🏆", label: "Prestasi" },
  { id: "jadwal",       icon: "📅", label: "Program Latihan" },
  { id: "performa",     icon: "📈", label: "Analitik Performa" },
  { id: "target",       icon: "🎯", label: "Target & Goal" },
  { id: "dokumen",      icon: "📄", label: "Dokumen" },
  { id: "pengumuman",   icon: "📢", label: "Pengumuman" },
  { id: "inbox-atlet",  icon: "✉️", label: "Pesan & Inbox" },
];

const adminMenu = [
  { id: "overview",  icon: "🏠", label: "Beranda" },
  { id: "anggota",   icon: "👥", label: "Manajemen Anggota" },
  { id: "laporan",   icon: "📊", label: "Laporan & Analytics" },
  { id: "pengaturan",icon: "⚙️", label: "Pengaturan" },
];

const adminFeatureMenu = [
  { id: "berita",        icon: "📰", label: "Manajemen Berita" },
  { id: "pesan",         icon: "✉",  label: "Pesan Masuk" },
  { id: "dokumen-admin", icon: "📄", label: "Verifikasi Dokumen" },
  { id: "notif-admin",   icon: "🔔", label: "Notifikasi Admin" },
  { id: "event-admin",   icon: "🏟️", label: "Manajemen Event" },
  { id: "cabor-admin",   icon: "🏅", label: "Manajemen Cabor" },
  { id: "broadcast",     icon: "📣", label: "Broadcast Pengumuman" },
  { id: "pelatih-admin", icon: "🧑‍🏫", label: "Manajemen Pelatih" },
  { id: "audit-trail",   icon: "🔍", label: "Audit Trail" },
  { id: "role-mgmt",     icon: "🛡️", label: "Role & Permission" },
  { id: "keuangan",      icon: "💰", label: "Dashboard Keuangan" },
  { id: "export-admin",  icon: "📥", label: "Export Data" },
];

function AdminOverview({ user }) {
  const [stats, setStats] = useState(null)
  const [localStats, setLocalStats] = useState({
    news: 0,
    unreadMessages: 0,
    pendingDocuments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadLocalStats()
  }, [])

  useEffect(() => {
    const syncLocalStats = () => loadLocalStats()
    window.addEventListener("koni-news-updated", syncLocalStats)
    window.addEventListener("koni-messages-updated", syncLocalStats)
    window.addEventListener("koni-documents-updated", syncLocalStats)
    return () => {
      window.removeEventListener("koni-news-updated", syncLocalStats)
      window.removeEventListener("koni-messages-updated", syncLocalStats)
      window.removeEventListener("koni-documents-updated", syncLocalStats)
    }
  }, [])

  const loadLocalStats = () => {
    const messages = getStoredMessages()
    const documents = getStoredDocuments()
    setLocalStats({
      news: getStoredNews().length,
      unreadMessages: messages.filter((message) => !message.dibaca).length,
      pendingDocuments: documents.filter((document) => document.status === "Pending").length,
    })
  }

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await authService.getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load admin stats:', error)
      // Set fallback stats so UI doesn't get stuck on "Memuat..."
      setStats({
        totalUsers: 0, activeUsers: 0, pendingUsers: 0, inactiveUsers: 0,
        byRole: { atlet: 0, official: 0, admin: 0 },
        topProvinces: [],
        _offline: true,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.6)" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        Memuat statistik dari server...
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        Gagal memuat data. Pastikan backend berjalan.
        <br />
        <button onClick={loadStats} style={{ marginTop: 12, background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          🔄 Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div>
      {stats._offline && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 16px", marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:12, color:"#f87171" }}>⚠️ Backend tidak terhubung — data statistik belum tersedia</div>
          <button onClick={loadStats} style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:6, padding:"4px 12px", color:"#f87171", fontSize:11, fontWeight:700, cursor:"pointer" }}>🔄 Retry</button>
        </div>
      )}
      <div style={{
        background: `linear-gradient(135deg, rgba(204,0,0,0.15), rgba(10,22,40,0.8))`,
        border: `1px solid rgba(204,0,0,0.2)`,
        borderRadius: 12, padding: "1.5rem",
        marginBottom: "1.5rem",
        display: "flex", alignItems: "center", gap: "1rem",
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          border: `2px solid ${COLORS.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {user.avatar}
        </div>
        <div>
          <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Selamat datang, Admin
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>
            {user.nama}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
            {user.role} · {user.email}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon="👥" label="Anggota Terdaftar" value={stats.totalUsers} color="#60a5fa" />
        <StatCard icon="📄" label="Laporan Bulanan" value="12" color={COLORS.gold} />
        <StatCard icon="⚠️" label="Aksi Pending" value={stats.pendingUsers} color={COLORS.merah} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon="📰" label="Total Berita" value={localStats.news} color="#38bdf8" />
        <StatCard icon="✉" label="Pesan Baru" value={localStats.unreadMessages} color="#fbbf24" />
        <StatCard icon="📄" label="Dokumen Pending" value={localStats.pendingDocuments} color="#fb7185" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Status Anggota
          </div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Aktif</span>
              <span style={{ fontWeight: 600, color: "#22c55e" }}>{stats.activeUsers}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Pending</span>
              <span style={{ fontWeight: 600, color: "#fbbf24" }}>{stats.pendingUsers}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Inactive</span>
              <span style={{ fontWeight: 600, color: "#ef4444" }}>{stats.inactiveUsers}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Peran Anggota
          </div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Atlet</span>
              <span style={{ fontWeight: 600 }}>{stats.byRole.atlet}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Official</span>
              <span style={{ fontWeight: 600 }}>{stats.byRole.official}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.7)" }}>
              <span>Admin</span>
              <span style={{ fontWeight: 600 }}>{stats.byRole.admin}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
        <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Top 5 Provinsi
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {stats.topProvinces.map((province, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "rgba(255,255,255,0.7)" }}>
              <span>{province.provinsi || 'Tidak Diketahui'}</span>
              <span style={{ fontWeight: 600, color: COLORS.gold }}>{province.count} anggota</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', role: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadUsers()
  }, [filter, currentPage])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = { ...filter, page: currentPage, limit: 10 }
      const response = await authService.getAllUsers(params)
      setUsers(response.users || [])
      setTotalPages(response.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "⚠️ Gagal memuat data anggota — cek koneksi backend", type: "error" } }))
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await authService.updateUserStatus(userId, newStatus)
      loadUsers()
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: `✅ Status berhasil diubah ke ${newStatus}`, type: "success" } }))
    } catch (error) {
      console.error('Failed to update user status:', error)
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "⚠️ Gagal mengubah status — cek koneksi backend", type: "error" } }))
    }
  }

  const exportUsers = () => {
    exportToCsv("anggota-koni.csv", users.map((user) => ({
      id: user.id,
      nama: user.name || user.nama || "",
      email: user.email || "",
      role: user.role || "",
      status: user.status || "",
      cabor: user.cabor || "",
      provinsi: user.provinsi || "",
    })))
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>Manajemen Anggota</h3>
        <button onClick={exportUsers} disabled={!users.length} style={adminSecondaryButtonStyle}>Export CSV</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 14
          }}
        >
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={filter.role}
          onChange={(e) => setFilter({ ...filter, role: e.target.value })}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 14
          }}
        >
          <option value="">Semua Role</option>
          <option value="Atlet">Atlet</option>
          <option value="Official">Official</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Users List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
          ⏳ Memuat data anggota...
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"rgba(255,255,255,0.35)" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>👥</div>
          <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Tidak ada data anggota</div>
          <div style={{ fontSize:12 }}>Pastikan backend berjalan dan sudah ada anggota terdaftar.</div>
          <button onClick={loadUsers} style={{ marginTop:12, background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>🔄 Muat Ulang</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {users.map((user) => (
            <div key={user.id} style={{
              padding: "1rem",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff"
                }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    {user.email} • {user.role} • {user.provinsi}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: user.status === 'Aktif' ? 'rgba(34,197,94,0.2)' :
                    user.status === 'Pending' ? 'rgba(251,191,36,0.2)' :
                      'rgba(239,68,68,0.2)',
                  color: user.status === 'Aktif' ? '#22c55e' :
                    user.status === 'Pending' ? '#fbbf24' :
                      '#ef4444'
                }}>
                  {user.status}
                </span>

                {user.status === 'Pending' && (
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => handleStatusChange(user.id, 'Aktif')}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "rgba(34,197,94,0.2)",
                        color: "#22c55e",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(user.id, 'Inactive')}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "rgba(239,68,68,0.2)",
                        color: "#ef4444",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              color: currentPage === 1 ? "rgba(255,255,255,0.3)" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer"
            }}
          >
            ‹
          </button>
          <span style={{ color: "rgba(255,255,255,0.6)", padding: "8px 12px" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              color: currentPage === totalPages ? "rgba(255,255,255,0.3)" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer"
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

const emptyNewsForm = {
  tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
  judul: "",
  kategori: "Program",
  img: "📰",
  deskripsi: "",
};

function NewsManagement() {
  const [news, setNews] = useState(() => getStoredNews());
  const [form, setForm] = useState(emptyNewsForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");

  const setValue = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const persist = (items) => {
    setNews(items);
    saveStoredNews(items);
  };

  const resetForm = () => {
    setForm(emptyNewsForm);
    setEditingIndex(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.judul.trim() || !form.deskripsi.trim()) {
      setError("Judul dan deskripsi wajib diisi.");
      return;
    }

    const item = { ...form, judul: form.judul.trim(), deskripsi: form.deskripsi.trim() };
    if (editingIndex === null) {
      persist([item, ...news]);
    } else {
      persist(news.map((current, index) => index === editingIndex ? item : current));
    }
    resetForm();
  };

  const handleEdit = (item, index) => {
    setForm(item);
    setEditingIndex(index);
    setError("");
  };

  const handleDelete = (index) => {
    persist(news.filter((_, itemIndex) => itemIndex !== index));
    if (editingIndex === index) resetForm();
  };

  const exportNews = () => {
    exportToCsv("berita-koni.csv", news.map((item) => ({
      tanggal: item.tanggal,
      judul: item.judul,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
    })));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ ...adminTitleStyle, margin: 0 }}>Manajemen Berita</h3>
        <button onClick={exportNews} disabled={!news.length} style={adminSecondaryButtonStyle}>Export CSV</button>
      </div>
      <form onSubmit={handleSubmit} style={adminPanelStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 10, marginBottom: 10 }}>
          <input value={form.judul} onChange={setValue("judul")} placeholder="Judul berita" style={adminInputStyle} />
          <input value={form.img} onChange={setValue("img")} placeholder="Icon" style={adminInputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input value={form.tanggal} onChange={setValue("tanggal")} placeholder="Tanggal" style={adminInputStyle} />
          <select value={form.kategori} onChange={setValue("kategori")} style={adminInputStyle}>
            <option>Prestasi</option>
            <option>Program</option>
            <option>Organisasi</option>
            <option>Pengumuman</option>
          </select>
        </div>
        <textarea value={form.deskripsi} onChange={setValue("deskripsi")} placeholder="Deskripsi berita" rows={3} style={{ ...adminInputStyle, resize: "vertical", marginBottom: 10 }} />
        {error && <div style={{ color: "#fca5a5", fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" style={adminPrimaryButtonStyle}>
            {editingIndex === null ? "Tambah Berita" : "Simpan Perubahan"}
          </button>
          {editingIndex !== null && (
            <button type="button" onClick={resetForm} style={adminSecondaryButtonStyle}>Batal</button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        {news.map((item, index) => (
          <div key={`${item.judul}-${index}`} style={adminPanelStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", borderRadius: 8 }}>
                {item.img}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.gold, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  {item.kategori} · {item.tanggal}
                </div>
                <div style={{ color: "#fff", fontWeight: 700, marginBottom: 4 }}>{item.judul}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.6 }}>{item.deskripsi}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button onClick={() => handleEdit(item, index)} style={adminSecondaryButtonStyle}>Edit</button>
                <button onClick={() => handleDelete(index)} style={adminDangerButtonStyle}>Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageInbox() {
  const [messages, setMessages] = useState(() => getStoredMessages());

  useEffect(() => {
    const syncMessages = () => setMessages(getStoredMessages());
    window.addEventListener("koni-messages-updated", syncMessages);
    return () => window.removeEventListener("koni-messages-updated", syncMessages);
  }, []);

  const persist = (items) => {
    setMessages(items);
    saveStoredMessages(items);
  };

  const markRead = (index) => {
    persist(messages.map((message, itemIndex) => itemIndex === index ? { ...message, dibaca: true } : message));
  };

  const removeMessage = (index) => {
    persist(messages.filter((_, itemIndex) => itemIndex !== index));
  };

  const exportMessages = () => {
    exportToCsv("pesan-koni.csv", messages.map((message) => ({
      nama: message.nama,
      email: message.email,
      institusi: message.institusi || "",
      kategori: message.kategori,
      pesan: message.pesan,
      status: message.dibaca ? "Dibaca" : "Baru",
      tanggal: message.tanggal,
    })));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ ...adminTitleStyle, margin: 0 }}>Pesan Masuk</h3>
        <button onClick={exportMessages} disabled={!messages.length} style={adminSecondaryButtonStyle}>Export CSV</button>
      </div>
      {messages.length === 0 ? (
        <div style={{ ...adminPanelStyle, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
          Belum ada pesan dari form kontak.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {messages.map((message, index) => (
            <div key={`${message.email}-${message.tanggal}-${index}`} style={{
              ...adminPanelStyle,
              borderColor: message.dibaca ? "rgba(255,255,255,0.08)" : "rgba(184,150,12,0.45)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{message.nama}</div>
                  <div style={{ color: COLORS.gold, fontSize: 11, marginTop: 3 }}>
                    {message.email} · {message.kategori}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 3 }}>
                    {message.institusi || "Tanpa institusi"} · {formatDateTime(message.tanggal)}
                  </div>
                </div>
                <span style={{
                  background: message.dibaca ? "rgba(34,197,94,0.12)" : "rgba(251,191,36,0.12)",
                  border: `1px solid ${message.dibaca ? "rgba(34,197,94,0.35)" : "rgba(251,191,36,0.35)"}`,
                  borderRadius: 999,
                  color: message.dibaca ? "#4ade80" : "#fbbf24",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}>
                  {message.dibaca ? "Dibaca" : "Baru"}
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.7, margin: "12px 0" }}>
                {message.pesan}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {!message.dibaca && <button onClick={() => markRead(index)} style={adminSecondaryButtonStyle}>Tandai Dibaca</button>}
                <button onClick={() => removeMessage(index)} style={adminDangerButtonStyle}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentVerification() {
  const [documents, setDocuments] = useState(() => getStoredDocuments());

  useEffect(() => {
    const syncDocuments = () => setDocuments(getStoredDocuments());
    window.addEventListener("koni-documents-updated", syncDocuments);
    return () => window.removeEventListener("koni-documents-updated", syncDocuments);
  }, []);

  const persist = (items) => {
    setDocuments(items);
    saveStoredDocuments(items);
  };

  const updateStatus = (id, status) => {
    persist(documents.map((doc) => doc.id === id ? { ...doc, status, reviewedAt: new Date().toISOString() } : doc));
  };

  const removeDocument = (id) => {
    persist(documents.filter((doc) => doc.id !== id));
  };

  const pendingCount = documents.filter((doc) => doc.status === "Pending").length;

  const exportDocuments = () => {
    exportToCsv("dokumen-koni.csv", documents.map((doc) => ({
      id: doc.id,
      namaUser: doc.namaUser,
      email: doc.email || "",
      jenis: doc.jenis,
      namaFile: doc.namaFile,
      status: doc.status,
      catatan: doc.catatan || "",
      tanggal: doc.tanggal,
      reviewedAt: doc.reviewedAt || "",
    })));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ ...adminTitleStyle, margin: 0 }}>Verifikasi Dokumen</h3>
        <button onClick={exportDocuments} disabled={!documents.length} style={adminSecondaryButtonStyle}>Export CSV</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1rem" }}>
        <StatCard icon="📄" label="Total Dokumen" value={documents.length} color="#60a5fa" />
        <StatCard icon="⏳" label="Menunggu" value={pendingCount} color="#fbbf24" />
        <StatCard icon="✅" label="Disetujui" value={documents.filter((doc) => doc.status === "Disetujui").length} color="#22c55e" />
      </div>

      {documents.length === 0 ? (
        <div style={{ ...adminPanelStyle, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
          Belum ada dokumen yang diupload anggota.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {documents.map((doc) => (
            <div key={doc.id} style={adminPanelStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{doc.jenis} - {doc.namaFile}</div>
                  <div style={{ color: COLORS.gold, fontSize: 11, marginTop: 3 }}>
                    {doc.namaUser} · {doc.email || "tanpa email"}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 3 }}>
                    Dikirim {formatDateTime(doc.tanggal)}
                  </div>
                </div>
                <span style={{
                  background: `${documentStatusColor(doc.status)}22`,
                  border: `1px solid ${documentStatusColor(doc.status)}55`,
                  borderRadius: 999,
                  color: documentStatusColor(doc.status),
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}>
                  {doc.status}
                </span>
              </div>
              {doc.catatan && (
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, margin: "12px 0" }}>
                  {doc.catatan}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {doc.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(doc.id, "Disetujui")} style={adminSecondaryButtonStyle}>Approve</button>
                    <button onClick={() => updateStatus(doc.id, "Ditolak")} style={adminDangerButtonStyle}>Reject</button>
                  </>
                )}
                <button onClick={() => removeDocument(doc.id)} style={adminDangerButtonStyle}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const adminTitleStyle = {
  fontFamily: "Georgia, serif",
  color: "#fff",
  fontSize: 18,
  margin: "0 0 1.25rem",
};

const adminPanelStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "1rem",
  marginBottom: "1rem",
};

const adminInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 6,
  color: "#fff",
  fontSize: 13,
  outline: "none",
  padding: "10px 12px",
};

const adminPrimaryButtonStyle = {
  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
  border: "none",
  borderRadius: 6,
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  padding: "9px 14px",
};

const adminSecondaryButtonStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 6,
  color: "rgba(255,255,255,0.75)",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  padding: "8px 12px",
};

const adminDangerButtonStyle = {
  ...adminSecondaryButtonStyle,
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.28)",
  color: "#f87171",
};

function formatDateTime(value) {
  if (!value) return "Tanpa tanggal";
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function documentStatusColor(status) {
  if (status === "Disetujui" || status === "Aktif") return "#22c55e";
  if (status === "Ditolak" || status === "Inactive") return "#ef4444";
  return "#fbbf24";
}

// ─── CHART DATA ────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────

function Reports() {
  const [period, setPeriod] = useState("2025");
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await authService.getAdminStats();
        setReportData(data);
      } catch {
        setReportData(null);
      } finally {
        setLoadingReport(false);
      }
    };
    fetchReportData();
  }, []);

  // Fallback empty charts when API has no data
  const memberGrowthData = reportData?.memberGrowth || [];
  const roleDistrib = reportData?.roleDistrib
    ? Object.entries(reportData.roleDistrib).map(([name, value], i) => ({
        name, value,
        color: [COLORS.merah, COLORS.gold, "#3B82F6", "#8B5CF6"][i % 4],
      }))
    : [];
  const prestasiChartData = reportData?.prestasiChart || [];
  const activityLog = reportData?.activityLog || [];
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "📊 Laporan berhasil diekspor!", type: "success" } }));
    }, 1500);
  };

  return (
    <div>
      {loadingReport && (
        <div style={{ textAlign: "center", padding: "1rem 0 0.5rem", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>⏳ Memuat data laporan dari server...</div>
      )}
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>Laporan & Analytics</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {["2023","2024","2025"].map(y => (
            <button key={y} onClick={() => setPeriod(y)} style={{
              padding: "6px 14px", borderRadius: 100,
              background: period === y ? COLORS.merah : "rgba(255,255,255,0.06)",
              border: `1px solid ${period === y ? COLORS.merah : "rgba(255,255,255,0.12)"}`,
              color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}>{y}</button>
          ))}
          <button onClick={handleExport} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 100,
            background: `${COLORS.gold}20`, border: `1px solid ${COLORS.gold}40`,
            color: COLORS.gold, fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            {exporting ? <RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={11} />}
            Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { icon: <Users size={16} />, label: "Total Anggota", val: reportData?.totalAnggota?.toLocaleString("id-ID") ?? "—", trend: reportData?.trendAnggota ?? "", up: true, color: "#60A5FA" },
          { icon: <Activity size={16} />, label: "Anggota Aktif", val: reportData?.anggotaAktif?.toLocaleString("id-ID") ?? "—", trend: reportData?.trendAktif ?? "", up: true, color: "#22C55E" },
          { icon: <FileText size={16} />, label: "Dok. Diproses", val: reportData?.dokumenDiproses?.toLocaleString("id-ID") ?? "—", trend: reportData?.trendDokumen ?? "", up: false, color: COLORS.gold },
          { icon: <Award size={16} />, label: "Medali Tahun Ini", val: reportData?.medaliTahunIni?.toLocaleString("id-ID") ?? "—", trend: reportData?.trendMedali ?? "", up: true, color: COLORS.merah },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25`, borderRadius: 10, padding: "1rem", borderLeft: `3px solid ${s.color}` }}>
            <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {s.up ? <TrendingUp size={11} color="#22C55E" /> : <TrendingDown size={11} color="#EF4444" />}
              <span style={{ fontSize: 10, color: s.up ? "#22C55E" : "#EF4444", fontWeight: 700 }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Member growth line */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Pertumbuhan Anggota 2025</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={memberGrowthData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.merah} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.merah} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <XAxis dataKey="bulan" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(10,22,40,0.95)", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="anggota" stroke={COLORS.merah} fill="url(#areaGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Pie chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Distribusi Peran</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={roleDistrib} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                {roleDistrib.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(10,22,40,0.95)", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {roleDistrib.map(r => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", flex: 1 }}>{r.name}</span>
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{r.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prestasi chart */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Tren Medali SEA Games</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={prestasiChartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <XAxis dataKey="tahun" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "rgba(10,22,40,0.95)", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12, color: "#fff" }} />
            <Bar dataKey="emas" name="Emas" fill={COLORS.gold} radius={[3,3,0,0]} />
            <Bar dataKey="perak" name="Perak" fill="#94a3b8" radius={[3,3,0,0]} />
            <Bar dataKey="perunggu" name="Perunggu" fill="#CD7F32" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity log */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>📋 Log Aktivitas Terbaru</div>
        {activityLog.map((log, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < activityLog.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: log.tipe === "success" ? "#22C55E" : log.tipe === "warning" ? "#F59E0B" : "#3B82F6" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", flexShrink: 0, width: 50 }}>{log.waktu}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{log.aksi}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({
    emailNotif: true, auditLog: true, twoFA: false,
    autoApprove: false, maintenanceMode: false, darkMode: true,
    maxUpload: "5", sessionTimeout: "30", defaultRole: "Atlet",
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "✅ Pengaturan berhasil disimpan!", type: "success" } }));
  };

  const ToggleRow = ({ label, desc, keyName, icon, color = COLORS.gold }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color, fontSize: 16 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{label}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{desc}</div>
        </div>
      </div>
      <button onClick={() => toggle(keyName)} style={{
        width: 44, height: 24, borderRadius: 12,
        background: settings[keyName] ? COLORS.merah : "rgba(255,255,255,0.12)",
        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3,
          left: settings[keyName] ? 22 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>Pengaturan Sistem</h3>
        <button onClick={handleSave} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: saved ? "rgba(34,197,94,0.2)" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          border: `1px solid ${saved ? "#22C55E" : "transparent"}`,
          borderRadius: 8, padding: "8px 16px",
          color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>
          {saved ? <><CheckCircle size={13} /> Tersimpan</> : "💾 Simpan Pengaturan"}
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {/* Notifikasi & Keamanan */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>🔔 Notifikasi & Keamanan</div>
          <ToggleRow label="Notifikasi Email" desc="Kirim email untuk setiap event penting" keyName="emailNotif" icon="📧" color="#60A5FA" />
          <ToggleRow label="Audit Logging" desc="Catat semua aktivitas admin" keyName="auditLog" icon="📋" color="#22C55E" />
          <ToggleRow label="Verifikasi 2 Faktor" desc="Keamanan tambahan untuk login admin" keyName="twoFA" icon="🔐" color={COLORS.gold} />
        </div>

        {/* Operasional */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>⚙️ Operasional</div>
          <ToggleRow label="Auto-Approve Anggota" desc="Setujui pendaftaran baru otomatis" keyName="autoApprove" icon="✅" color="#22C55E" />
          <ToggleRow label="Mode Maintenance" desc="Matikan akses publik sementara" keyName="maintenanceMode" icon="🔧" color={COLORS.merah} />
        </div>

        {/* Input settings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>📝 Konfigurasi</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { label: "Maks Upload (MB)", key: "maxUpload", opts: ["2","5","10","20"] },
              { label: "Timeout Sesi (Menit)", key: "sessionTimeout", opts: ["15","30","60","120"] },
              { label: "Peran Default", key: "defaultRole", opts: ["Atlet","Pelatih","Ofisial"] },
            ].map(s => (
              <div key={s.key}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                <select value={settings[s.key]} onChange={e => setSettings(p => ({ ...p, [s.key]: e.target.value }))}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "7px 10px", color: "#fff", fontSize: 12, outline: "none" }}>
                  {s.opts.map(o => <option key={o} value={o} style={{ background: "#0A1628" }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: load/save atlet data per user from localStorage
function loadAtletData(key, userId, defaultVal) {
  try {
    const raw = localStorage.getItem(`koni-${key}-${userId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return defaultVal;
}
function saveAtletData(key, userId, data) {
  try { localStorage.setItem(`koni-${key}-${userId}`, JSON.stringify(data)); } catch { /* ignore */ }
}

const DEFAULT_PERFORMA = [
  { minggu: "M1", stamina: 0, teknik: 0, kecepatan: 0 },
  { minggu: "M2", stamina: 0, teknik: 0, kecepatan: 0 },
  { minggu: "M3", stamina: 0, teknik: 0, kecepatan: 0 },
  { minggu: "M4", stamina: 0, teknik: 0, kecepatan: 0 },
  { minggu: "M5", stamina: 0, teknik: 0, kecepatan: 0 },
  { minggu: "M6", stamina: 0, teknik: 0, kecepatan: 0 },
];

const DEFAULT_DOKUMEN = [
  { nama: "Kartu Tanda Anggota (KTA)", status: "Pending", exp: "-", icon: "🪪" },
  { nama: "Sertifikat Atlet Nasional", status: "Pending", exp: "-", icon: "📜" },
  { nama: "Lisensi Kompetisi 2026", status: "Pending", exp: "-", icon: "📋" },
  { nama: "Hasil Medical Check-Up", status: "Pending", exp: "-", icon: "🩺" },
];

function StatCard({ icon, label, value, sub, color = COLORS.gold }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 10, padding: "1.1rem 1.25rem",
      borderLeft: `3px solid ${color}`,
      transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}50`; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Overview({ user }) {
  const userId = user?.id || user?.email || "guest";
  const savedAvatar = (() => { try { return localStorage.getItem("koni-avatar"); } catch { return null; } })();

  // Derived data
  const prestasi   = loadAtletData("prestasi", userId, []);
  const jadwalUser = loadAtletData("jadwal", userId, []);
  const goals      = loadAtletData("goals", userId, []);
  const performa   = loadAtletData("performa", userId, DEFAULT_PERFORMA);
  const metrics    = loadAtletData("metrics", userId, null);
  const inbox      = (() => { try { return JSON.parse(localStorage.getItem(`koni-inbox-${userId}`) || "[]"); } catch { return []; } })();

  const selesai    = jadwalUser.filter(j => j.selesai).length;
  const aktifJdwl  = jadwalUser.filter(j => !j.selesai);
  const doneGoals  = goals.filter(g => g.done).length;
  const pctTarget  = goals.length ? Math.round((doneGoals / goals.length) * 100) : 0;
  const unreadInbox = inbox.filter(m => !m.read).length;
  const hasPerforma = performa.some(p => p.stamina > 0 || p.teknik > 0 || p.kecepatan > 0);

  // Build weekly activity data from jadwal (last 7 weeks based on completed)
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const label = `M${i + 1}`;
    const sesiMinggu = jadwalUser.filter((_, idx) => Math.floor(idx / 2) === i).length;
    const selesaiMinggu = jadwalUser.filter((j, idx) => j.selesai && Math.floor(idx / 2) === i).length;
    const prestasiMinggu = prestasi.filter((_, idx) => Math.floor(idx / 2) === i).length;
    return { minggu: label, sesi: sesiMinggu, selesai: selesaiMinggu, prestasi: prestasiMinggu };
  });

  // Broadcast from admin
  const broadcastHistory = (() => { try { return JSON.parse(localStorage.getItem("koni-broadcast-history") || "[]"); } catch { return []; } })();
  const latestBroadcast = broadcastHistory.slice(0, 3);

  const tipeColor = { info:"#3B82F6", success:"#22C55E", warning:"#F59E0B", urgent:COLORS.merah };

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg, rgba(204,0,0,0.18), rgba(10,22,40,0.9))`,
        border: `1px solid rgba(204,0,0,0.25)`,
        borderRadius: 14, padding: "1.5rem",
        marginBottom: "1.25rem",
        display: "flex", alignItems: "center", gap: "1.25rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", right:"-5%", top:"-30%", width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, ${COLORS.merah}12 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: savedAvatar ? "none" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
          border: `3px solid ${COLORS.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: savedAvatar ? "none" : 24, fontWeight: 700, color: "#fff", flexShrink: 0,
          overflow: "hidden", boxShadow: `0 0 24px ${COLORS.gold}40`,
        }}>
          {savedAvatar ? <img src={savedAvatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (user.avatar || "👤")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Selamat datang kembali 👋</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", fontWeight: 700, marginTop: 2 }}>{user.nama || user.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{user.role} · {user.cabor} · {user.provinsi}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            background: user.status === "Aktif" ? "rgba(34,197,94,0.15)" : "rgba(250,204,21,0.15)",
            border: `1px solid ${user.status === "Aktif" ? "rgba(34,197,94,0.4)" : "rgba(250,204,21,0.4)"}`,
            color: user.status === "Aktif" ? "#4ade80" : "#facc15",
            fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 100,
            letterSpacing: "0.08em", marginBottom: 6,
          }}>● {user.status}</div>
          {unreadInbox > 0 && (
            <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>📬 {unreadInbox} pesan baru</div>
          )}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Bergabung {user.bergabung}</div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <StatCard icon={<Award size={18} color={COLORS.gold} />} label="Total Prestasi" value={String(prestasi.length)} color={COLORS.gold} />
        <StatCard icon={<Activity size={18} color="#60A5FA" />} label="Sesi Selesai" value={String(selesai)} sub={`/ ${jadwalUser.length} total`} color="#60A5FA" />
        <StatCard icon={<Target size={18} color="#22C55E" />} label="Target Tercapai" value={goals.length ? `${pctTarget}%` : "—"} sub={`${doneGoals}/${goals.length} goals`} color="#22C55E" />
        <StatCard icon={<Calendar size={18} color={COLORS.merah} />} label="Jadwal Aktif" value={String(aktifJdwl.length)} sub="menunggu selesai" color={COLORS.merah} />
      </div>

      {/* Main grid: chart + broadcast */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* Weekly activity chart */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>📊 Aktivitas Mingguan</div>
            <div style={{ display:"flex", gap:10, fontSize:9, color:"rgba(255,255,255,0.35)" }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:COLORS.merah, display:"inline-block" }} />Sesi</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:"#22C55E", display:"inline-block" }} />Selesai</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyActivity} barGap={2}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="minggu" tick={{ fill:"rgba(255,255,255,0.35)", fontSize:9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"rgba(255,255,255,0.35)", fontSize:9 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ background:"rgba(10,22,40,0.96)", border:`1px solid ${COLORS.border}`, borderRadius:8, fontSize:11, color:"#fff" }} cursor={{ fill:"rgba(255,255,255,0.04)" }} />
              <Bar dataKey="sesi" name="Total Sesi" fill={`${COLORS.merah}60`} radius={[3,3,0,0]} />
              <Bar dataKey="selesai" name="Selesai" fill="#22C55E" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performa radar / line */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>📈 Tren Performa</div>
          {hasPerforma ? (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={performa}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="minggu" tick={{ fill:"rgba(255,255,255,0.35)", fontSize:9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"rgba(255,255,255,0.35)", fontSize:9 }} axisLine={false} tickLine={false} domain={[0,100]} width={20} />
                <Tooltip contentStyle={{ background:"rgba(10,22,40,0.96)", border:`1px solid ${COLORS.border}`, borderRadius:8, fontSize:11, color:"#fff" }} />
                <Line type="monotone" dataKey="stamina" stroke={COLORS.merah} strokeWidth={2} dot={false} name="Stamina" />
                <Line type="monotone" dataKey="teknik" stroke={COLORS.gold} strokeWidth={2} dot={false} name="Teknik" />
                <Line type="monotone" dataKey="kecepatan" stroke="#60A5FA" strokeWidth={2} dot={false} name="Kecepatan" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign:"center", padding:"2rem 0", color:"rgba(255,255,255,0.25)", fontSize:12 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📉</div>
              Isi data di menu "Analitik Performa" untuk melihat grafik tren.
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: jadwal + broadcast + target summary */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>

        {/* Jadwal aktif */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>📅 Latihan Aktif</div>
          {aktifJdwl.length === 0 ? (
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:12, textAlign:"center", padding:"1.5rem 0" }}>Tidak ada jadwal aktif.</div>
          ) : aktifJdwl.slice(0, 3).map(j => (
            <div key={j.id} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>🏋️</span>
              <div>
                <div style={{ fontSize:12, color:"#fff", fontWeight:600 }}>{j.sesi}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{j.hari}{j.waktu ? ` · ${j.waktu}` : ""}</div>
              </div>
            </div>
          ))}
          {aktifJdwl.length > 3 && <div style={{ fontSize:10, color:COLORS.gold, marginTop:8, textAlign:"center" }}>+{aktifJdwl.length - 3} lainnya</div>}
        </div>

        {/* Pengumuman dari admin */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>📢 Pengumuman</div>
          {latestBroadcast.length === 0 ? (
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:12, textAlign:"center", padding:"1.5rem 0" }}>Belum ada pengumuman.</div>
          ) : latestBroadcast.map(b => (
            <div key={b.id} style={{ padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:2 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:tipeColor[b.tipe]||"#60A5FA", flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#fff", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.judul}</span>
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", paddingLeft:12 }}>{b.waktu}</div>
            </div>
          ))}
        </div>

        {/* Target ringkasan */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1rem" }}>🎯 Target</div>
          {goals.length === 0 ? (
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:12, textAlign:"center", padding:"1.5rem 0" }}>Tambahkan target di menu "Target & Goal".</div>
          ) : goals.slice(0, 4).map(g => (
            <div key={g.id} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:11, color:g.done?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.7)", textDecoration:g.done?"line-through":"none", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginRight:6 }}>{g.label}</span>
                <span style={{ fontSize:10, fontWeight:700, color:g.done?"#22C55E":g.warna, flexShrink:0 }}>{g.progress}%</span>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${g.progress}%`, background:g.done?"#22C55E":g.warna, borderRadius:99, transition:"width 0.5s" }} />
              </div>
            </div>
          ))}
          {goals.length > 4 && <div style={{ fontSize:10, color:COLORS.gold, textAlign:"center" }}>+{goals.length-4} target lainnya</div>}
        </div>
      </div>

      {/* Metrics highlight */}
      {metrics && (
        <div style={{ marginTop:"1rem", display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${m.color}20`, borderRadius:10, padding:"0.85rem 1rem", borderLeft:`3px solid ${m.color}` }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{m.label}</div>
              <div style={{ fontSize:18, fontWeight:700, color:m.color, fontFamily:"Georgia, serif" }}>{m.val} <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{m.unit}</span></div>
              <div style={{ marginTop:6, height:3, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min((m.val/(m.target||1))*100,100)}%`, background:m.color, borderRadius:99 }} />
              </div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:3 }}>Target: {m.target} {m.unit}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Prestasi({ user }) {
  const userId = user?.id || user?.email || "guest";
  const [prestasiData, setPrestasiData] = useState(() => loadAtletData("prestasi", userId, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tahun: new Date().getFullYear(), event: "", cabor: user?.cabor || "", hasil: "Emas 🥇", lokasi: "", poin: 100 });

  const save = (data) => { setPrestasiData(data); saveAtletData("prestasi", userId, data); };

  const tambah = () => {
    if (!form.event.trim()) return;
    const newData = [{ ...form, tahun: parseInt(form.tahun), poin: parseInt(form.poin) || 0 }, ...prestasiData];
    save(newData);
    setForm({ tahun: new Date().getFullYear(), event: "", cabor: user?.cabor || "", hasil: "Emas 🥇", lokasi: "", poin: 100 });
    setShowForm(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "🏆 Prestasi berhasil ditambahkan!", type: "success" } }));
  };

  const hapus = (idx) => {
    const updated = prestasiData.filter((_, i) => i !== idx);
    save(updated);
  };

  const totalPoin = prestasiData.reduce((a, b) => a + (b.poin || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>Riwayat Prestasi</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gold, fontFamily: "Georgia, serif" }}>{totalPoin}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Poin Karir</div>
          </div>
          <button onClick={() => setShowForm(p => !p)} style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {showForm ? "✕ Batal" : "+ Tambah"}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[
              { label: "Nama Event *", key: "event", placeholder: "Contoh: SEA Games 2026" },
              { label: "Cabang Olahraga", key: "cabor", placeholder: "Contoh: Bulutangkis" },
              { label: "Lokasi", key: "lokasi", placeholder: "Contoh: Singapore" },
              { label: "Tahun", key: "tahun", placeholder: "2026", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} type={f.type || "text"}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Hasil</div>
              <select value={form.hasil} onChange={e => setForm(p => ({ ...p, hasil: e.target.value }))}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none" }}>
                {["Emas 🥇", "Perak 🥈", "Perunggu 🥉", "Juara 4", "Juara Grup", "Semifinalis"].map(h => <option key={h} value={h} style={{ background: "#0A1628" }}>{h}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Poin</div>
              <input value={form.poin} onChange={e => setForm(p => ({ ...p, poin: e.target.value }))} type="number" placeholder="100"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={tambah} style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ✓ Simpan Prestasi
          </button>
        </div>
      )}

      {prestasiData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
          Belum ada prestasi tercatat. Klik "+ Tambah" untuk mencatat prestasi Anda.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {prestasiData.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 10, padding: "1rem 1.25rem",
              display: "flex", alignItems: "center", gap: "1rem",
              borderLeft: `3px solid ${p.hasil.includes("Emas") ? COLORS.gold : p.hasil.includes("Perak") ? "#94a3b8" : "#CD7F32"}`,
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${COLORS.navyLight}, ${COLORS.navy})`,
                border: `1px solid ${COLORS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: COLORS.gold,
              }}>
                {p.tahun.toString().slice(2)}'
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: 2 }}>{p.event}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.cabor} · 📍 {p.lokasi}</div>
              </div>
              <div style={{ textAlign: "right", marginRight: 8 }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: p.hasil.includes("Emas") ? COLORS.gold : p.hasil.includes("Perak") ? "#94a3b8" : "#CD7F32" }}>{p.hasil}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>+{p.poin} poin</div>
              </div>
              <button onClick={() => hapus(i)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "5px 10px", color: "#f87171", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Jadwal({ user }) {
  const userId = user?.id || user?.email || "guest";
  const [jadwal, setJadwal] = useState(() => loadAtletData("jadwal", userId, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sesi: "", waktu: "", lokasi: "", pelatih: "", hari: "Senin", tanggal: "" });
  const HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

  const save = (data) => { setJadwal(data); saveAtletData("jadwal", userId, data); };

  const tambah = () => {
    if (!form.sesi.trim()) return;
    save([...jadwal, { ...form, id: Date.now(), selesai: false }]);
    setForm({ sesi: "", waktu: "", lokasi: "", pelatih: "", hari: "Senin", tanggal: "" });
    setShowForm(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "📅 Jadwal latihan ditambahkan!", type: "success" } }));
  };

  const toggleSelesai = (id) => {
    save(jadwal.map(j => j.id === id ? { ...j, selesai: !j.selesai } : j));
  };

  const hapus = (id) => save(jadwal.filter(j => j.id !== id));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>Program Latihan</h3>
        <button onClick={() => setShowForm(p => !p)} style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          {showForm ? "✕ Batal" : "+ Tambah Sesi"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[
              { label: "Nama Sesi *", key: "sesi", placeholder: "Fisik & Kardio" },
              { label: "Waktu", key: "waktu", placeholder: "06:00–08:00" },
              { label: "Lokasi", key: "lokasi", placeholder: "GOR Senayan" },
              { label: "Pelatih", key: "pelatih", placeholder: "Nama pelatih" },
              { label: "Tanggal", key: "tanggal", placeholder: "13 Jun 2026" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Hari</div>
              <select value={form.hari} onChange={e => setForm(p => ({ ...p, hari: e.target.value }))}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none" }}>
                {HARI.map(h => <option key={h} value={h} style={{ background: "#0A1628" }}>{h}</option>)}
              </select>
            </div>
          </div>
          <button onClick={tambah} style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ✓ Simpan Jadwal
          </button>
        </div>
      )}

      {jadwal.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
          Belum ada jadwal latihan. Klik "+ Tambah Sesi" untuk menambahkan.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {jadwal.map(j => (
            <div key={j.id} style={{
              background: j.selesai ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${j.selesai ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10, padding: "1rem 1.25rem",
              display: "flex", alignItems: "center", gap: "1rem",
              opacity: j.selesai ? 0.7 : 1,
            }}>
              <div style={{ fontSize: 22 }}>🏋️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, textDecoration: j.selesai ? "line-through" : "none", marginBottom: 2 }}>{j.sesi}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  {j.hari}{j.tanggal ? ` ${j.tanggal}` : ""}{j.waktu ? ` · ${j.waktu}` : ""}{j.lokasi ? ` · ${j.lokasi}` : ""}{j.pelatih ? ` · ${j.pelatih}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => toggleSelesai(j.id)} style={{
                  background: j.selesai ? "rgba(34,197,94,0.15)" : `${COLORS.gold}15`,
                  border: `1px solid ${j.selesai ? "rgba(34,197,94,0.3)" : `${COLORS.gold}30`}`,
                  borderRadius: 100, padding: "4px 10px",
                  color: j.selesai ? "#4ADE80" : COLORS.gold,
                  fontSize: 10, fontWeight: 700, cursor: "pointer",
                }}>
                  {j.selesai ? "✓ Selesai" : "Tandai Selesai"}
                </button>
                <button onClick={() => hapus(j.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "5px 10px", color: "#f87171", fontSize: 11, cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function Dokumen({ user }) {
  const [documents, setDocuments] = useState(() => getStoredDocuments());
  const [form, setForm] = useState({ jenis: "KTP", namaFile: "", catatan: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const syncDocuments = () => setDocuments(getStoredDocuments());
    window.addEventListener("koni-documents-updated", syncDocuments);
    return () => window.removeEventListener("koni-documents-updated", syncDocuments);
  }, []);

  const userDocuments = documents.filter((doc) => String(doc.userId) === String(user?.id));

  const submitDocument = (event) => {
    event.preventDefault();
    if (!form.namaFile.trim()) {
      setError("Nama file wajib diisi.");
      return;
    }

    const newDocument = {
      id: Date.now(),
      userId: user?.id,
      namaUser: user?.name || user?.nama || "Anggota KONI",
      email: user?.email,
      jenis: form.jenis,
      namaFile: form.namaFile.trim(),
      catatan: form.catatan.trim(),
      status: "Pending",
      tanggal: new Date().toISOString(),
    };

    saveStoredDocuments([newDocument, ...documents]);
    setForm({ jenis: "KTP", namaFile: "", catatan: "" });
    setError("");
  };

  return (
    <div>
      <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: "0 0 1.25rem" }}>Dokumen Resmi</h3>
      <form onSubmit={submitDocument} style={adminPanelStyle}>
        <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Upload Dokumen Baru
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10, marginBottom: 10 }}>
          <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })} style={adminInputStyle}>
            <option>KTP</option>
            <option>KTA</option>
            <option>Sertifikat</option>
            <option>Medical Check-Up</option>
            <option>Surat Rekomendasi</option>
          </select>
          <input
            value={form.namaFile}
            onChange={(e) => setForm({ ...form, namaFile: e.target.value })}
            placeholder="Nama file, contoh: ktp-budi.pdf"
            style={adminInputStyle}
          />
        </div>
        <textarea
          value={form.catatan}
          onChange={(e) => setForm({ ...form, catatan: e.target.value })}
          placeholder="Catatan opsional"
          rows={2}
          style={{ ...adminInputStyle, resize: "vertical", marginBottom: 10 }}
        />
        {error && <div style={{ color: "#fca5a5", fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={adminPrimaryButtonStyle}>Kirim untuk Verifikasi</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[...userDocuments, ...DEFAULT_DOKUMEN].map((d, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{d.icon || "📄"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 3 }}>{d.nama || `${d.jenis} - ${d.namaFile}`}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                {d.exp ? `Berlaku s/d: ${d.exp}` : `Dikirim: ${formatDateTime(d.tanggal)}`}
              </div>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
              background: d.status === "Aktif" ? "rgba(34,197,94,0.1)" : "rgba(250,204,21,0.1)",
              border: `1px solid ${d.status === "Aktif" ? "rgba(34,197,94,0.35)" : "rgba(250,204,21,0.35)"}`,
              color: d.status === "Aktif" ? "#4ade80" : "#facc15",
              letterSpacing: "0.06em",
            }}>
              {d.status}
            </div>
            <button style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)", fontSize: 11, padding: "6px 12px", borderRadius: 6,
              cursor: "pointer", fontWeight: 600,
            }}>
              Unduh
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilSaya({ user, onEdit }) {
  const userId = user?.id || user?.email || "guest";
  const [showFotoUpload, setShowFotoUpload] = useState(false);
  const [avatar, setAvatar] = useState(() => { try { return localStorage.getItem("koni-avatar") || null; } catch { return null; } });
  const [bio, setBio] = useState(() => { try { return localStorage.getItem(`koni-bio-${userId}`) || ""; } catch { return ""; } });
  const [editBio, setEditBio] = useState(false);
  const [bioInput, setBioInput] = useState(bio);
  const [sosmed, setSosmed] = useState(() => { try { return JSON.parse(localStorage.getItem(`koni-sosmed-${userId}`) || "{}"); } catch { return {}; } });
  const [editSosmed, setEditSosmed] = useState(false);
  const [sosmedInput, setSosmedInput] = useState(sosmed);

  const prestasi = loadAtletData("prestasi", userId, []);
  const jadwal = loadAtletData("jadwal", userId, []);
  const goals = loadAtletData("goals", userId, []);
  const totalPoin = prestasi.reduce((a, b) => a + (b.poin || 0), 0);

  const saveBio = () => {
    setBio(bioInput);
    localStorage.setItem(`koni-bio-${userId}`, bioInput);
    setEditBio(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "✅ Bio disimpan!", type: "success" } }));
  };

  const saveSosmed = () => {
    setSosmed(sosmedInput);
    localStorage.setItem(`koni-sosmed-${userId}`, JSON.stringify(sosmedInput));
    setEditSosmed(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "✅ Sosial media disimpan!", type: "success" } }));
  };

  const topPrestasi = [...prestasi].sort((a, b) => {
    const rank = { "Emas 🥇": 0, "Perak 🥈": 1, "Perunggu 🥉": 2 };
    return (rank[a.hasil] ?? 3) - (rank[b.hasil] ?? 3);
  }).slice(0, 3);

  const sosmedLinks = [
    { key: "instagram", icon: "📸", label: "Instagram", placeholder: "@username" },
    { key: "twitter", icon: "🐦", label: "Twitter/X", placeholder: "@username" },
    { key: "tiktok", icon: "🎵", label: "TikTok", placeholder: "@username" },
    { key: "youtube", icon: "▶️", label: "YouTube", placeholder: "Channel URL" },
  ];

  return (
    <div>
      {/* Header card */}
      <div style={{
        background: `linear-gradient(135deg, rgba(204,0,0,0.12), rgba(10,22,40,0.9))`,
        border: `1px solid rgba(184,150,12,0.2)`,
        borderRadius: 16, padding: "1.75rem",
        marginBottom: "1.25rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", right:"-5%", top:"-30%", width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, ${COLORS.gold}08 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"flex-start", gap:20 }}>
          {/* Avatar */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: avatar ? "none" : `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
              border: `3px solid ${COLORS.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: avatar ? "none" : 32, color: "#fff", overflow: "hidden",
              boxShadow: `0 0 24px ${COLORS.gold}40`,
            }}>
              {avatar ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (user?.avatar || "👤")}
            </div>
            <button onClick={() => setShowFotoUpload(true)} style={{
              position:"absolute", bottom:0, right:0,
              width:26, height:26, borderRadius:"50%",
              background:COLORS.merah, border:`2px solid ${COLORS.navy}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:12,
            }}>📸</button>
          </div>

          {/* Info */}
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:22, color:"#fff", fontWeight:700 }}>{user?.name}</div>
              <div style={{
                background: user.status === "Aktif" ? "rgba(34,197,94,0.15)" : "rgba(250,204,21,0.15)",
                border: `1px solid ${user.status === "Aktif" ? "rgba(34,197,94,0.4)" : "rgba(250,204,21,0.4)"}`,
                color: user.status === "Aktif" ? "#4ade80" : "#facc15",
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing:"0.08em",
              }}>● {user.status}</div>
            </div>
            <div style={{ fontSize:12, color:COLORS.gold, marginBottom:4 }}>{user?.role} · {user?.cabor} · {user?.provinsi}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:12 }}>ID: KONI-{String(user?.id || "00001").padStart(5,"0")} · Bergabung {user?.bergabung}</div>

            {/* Bio section */}
            {editBio ? (
              <div>
                <textarea value={bioInput} onChange={e => setBioInput(e.target.value)} rows={3} maxLength={200}
                  placeholder="Ceritakan tentang diri Anda, spesialisasi, dan perjalanan atletmu..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"10px 12px", color:"#fff", fontSize:12, outline:"none", resize:"vertical", lineHeight:1.6, boxSizing:"border-box" }} />
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button onClick={saveBio} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:6, padding:"6px 14px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Simpan</button>
                  <button onClick={() => { setEditBio(false); setBioInput(bio); }} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:6, padding:"6px 14px", color:"rgba(255,255,255,0.6)", fontSize:11, cursor:"pointer" }}>Batal</button>
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                <div style={{ fontSize:12, color: bio ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", lineHeight:1.6, flex:1, fontStyle: bio ? "normal" : "italic" }}>
                  {bio || "Tambahkan bio singkat tentang dirimu..."}
                </div>
                <button onClick={() => { setEditBio(true); setBioInput(bio); }} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"4px 10px", color:"rgba(255,255,255,0.5)", fontSize:10, cursor:"pointer", flexShrink:0 }}>✏️ Edit</button>
              </div>
            )}

            {/* Sosmed */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
              {sosmedLinks.map(s => sosmed[s.key] ? (
                <div key={s.key} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"4px 10px", fontSize:11, color:"rgba(255,255,255,0.7)" }}>
                  <span>{s.icon}</span><span>{sosmed[s.key]}</span>
                </div>
              ) : null)}
              <button onClick={() => { setEditSosmed(true); setSosmedInput(sosmed); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"4px 12px", color:"rgba(255,255,255,0.4)", fontSize:11, cursor:"pointer" }}>
                {Object.values(sosmed).filter(Boolean).length > 0 ? "✏️ Edit Sosmed" : "+ Tambah Sosial Media"}
              </button>
            </div>
          </div>

          {/* Stat badges */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
            {[
              { val: prestasi.length, label:"Prestasi", icon:"🏆", color:COLORS.gold },
              { val: jadwal.filter(j=>j.selesai).length, label:"Sesi", icon:"💪", color:"#60A5FA" },
              { val: totalPoin, label:"Poin", icon:"⭐", color:COLORS.merah },
            ].map(s => (
              <div key={s.label} style={{ background:`${s.color}12`, border:`1px solid ${s.color}25`, borderRadius:10, padding:"8px 14px", textAlign:"center", minWidth:60 }}>
                <div style={{ fontSize:11, marginBottom:2 }}>{s.icon}</div>
                <div style={{ fontSize:18, fontWeight:700, color:s.color, fontFamily:"Georgia, serif" }}>{s.val}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sosmed edit modal */}
      {editSosmed && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ fontSize:13, color:COLORS.gold, fontWeight:700, marginBottom:"1rem" }}>🌐 Sosial Media</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {sosmedLinks.map(s => (
              <div key={s.key}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{s.icon} {s.label}</div>
                <input value={sosmedInput[s.key] || ""} onChange={e => setSosmedInput(p => ({...p, [s.key]: e.target.value}))} placeholder={s.placeholder}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={saveSosmed} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Simpan</button>
            <button onClick={() => setEditSosmed(false)} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 16px", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer" }}>Batal</button>
          </div>
        </div>
      )}

      {/* Prestasi highlight */}
      {topPrestasi.length > 0 && (
        <div style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${COLORS.gold}20`, borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>🏆 Prestasi Terbaik</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {topPrestasi.map((p, i) => (
              <div key={i} style={{
                flex:1, minWidth:150,
                background:`linear-gradient(135deg, rgba(204,0,0,0.1), rgba(10,22,40,0.6))`,
                border:`1px solid ${p.hasil.includes("Emas") ? COLORS.gold : p.hasil.includes("Perak") ? "#94a3b8" : "#CD7F32"}40`,
                borderRadius:10, padding:"1rem",
                borderTop:`3px solid ${p.hasil.includes("Emas") ? COLORS.gold : p.hasil.includes("Perak") ? "#94a3b8" : "#CD7F32"}`,
              }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{p.hasil.includes("Emas") ? "🥇" : p.hasil.includes("Perak") ? "🥈" : "🥉"}</div>
                <div style={{ fontSize:12, color:"#fff", fontWeight:700, marginBottom:2 }}>{p.event}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>{p.cabor} · {p.tahun}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data profil */}
      <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:16, margin:"0 0 1rem" }}>Data Keanggotaan</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {[
          ["Nama Lengkap", user.name],
          ["Peran", user.role],
          ["Cabang Olahraga", user.cabor],
          ["Provinsi", user.provinsi],
          ["Email", user.email],
          ["Status", user.status],
          ["Tahun Bergabung", user.bergabung],
          ["ID Keanggotaan", `KONI-${String(user.id||"00001").padStart(5,"0")}`],
        ].map(([label, val], i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"0.85rem 1rem" }}>
            <div style={{ fontSize:10, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:13, color:"#fff", fontWeight:500 }}>{val || "—"}</div>
          </div>
        ))}
      </div>
      <button onClick={onEdit} style={{
        background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
        color:"#fff", border:"none", padding:"11px 24px",
        borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer",
        letterSpacing:"0.08em",
      }}>
        ✏️ Edit Profil
      </button>

      {showFotoUpload && (
        <FotoProfilUpload user={user} onClose={() => setShowFotoUpload(false)} onSave={(img) => setAvatar(img)} />
      )}
    </div>
  );
}

function KartuAnggotaView({ user }) {
  const [showModal, setShowModal] = useState(false);
  const userId = user?.id || user?.email || "guest";
  const prestasi = loadAtletData("prestasi", userId, []);
  const jadwal = loadAtletData("jadwal", userId, []);
  const totalPoin = prestasi.reduce((a, b) => a + (b.poin || 0), 0);
  const memberId = `KONI-${String(user?.id || "00001").padStart(5, "0")}`;
  const tahunBergabung = user?.bergabung?.split(" ").pop() || "2024";
  const validUntil = `31 Des ${parseInt(tahunBergabung) + 4}`;
  const [avatar] = useState(() => { try { return localStorage.getItem("koni-avatar"); } catch { return null; } });

  const roleColor = { "Atlet":COLORS.merah, "Pelatih":"#2563EB", "Admin":COLORS.gold, "Ofisial":"#7C3AED" }[user?.role] || COLORS.merah;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:"0 0 4px" }}>Kartu Anggota Digital</h3>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>Tunjukkan QR code ini untuk verifikasi keanggotaan resmi KONI</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:10, padding:"10px 18px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          🔍 Lihat Fullscreen
        </button>
      </div>

      {/* Mini card preview */}
      <div style={{
        background:`linear-gradient(135deg, #0A1628 0%, #1E3A5F 55%, #0A1628 100%)`,
        borderRadius:20, overflow:"hidden", position:"relative",
        boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS.gold}30`,
        marginBottom:"1.5rem", userSelect:"none",
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(184,150,12,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(184,150,12,0.05) 1px, transparent 1px)`, backgroundSize:"28px 28px" }} />
        <div style={{ position:"absolute", right:"-5%", top:"-20%", width:240, height:240, borderRadius:"50%", background:`radial-gradient(circle, ${roleColor}15 0%, transparent 65%)` }} />

        {/* Top stripe */}
        <div style={{ background:`linear-gradient(90deg, ${COLORS.merah}, #8B0000)`, padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>🏆</span>
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:"#fff", letterSpacing:"0.18em" }}>KONI PUSAT</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", letterSpacing:"0.1em" }}>KOMITE OLAHRAGA NASIONAL INDONESIA</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)" }}>KARTU ANGGOTA RESMI</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.45)" }}>Berlaku s/d {validUntil}</div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding:"20px 24px", display:"flex", gap:20, alignItems:"flex-start", position:"relative", zIndex:1 }}>
          <div style={{ flexShrink:0 }}>
            <div style={{ width:72, height:72, borderRadius:12, background:avatar?"none":`linear-gradient(135deg, ${roleColor}, ${roleColor}99)`, border:`2px solid ${COLORS.gold}60`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, boxShadow:`0 4px 20px rgba(0,0,0,0.4)` }}>
              {avatar ? <img src={avatar} alt="foto" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (user?.avatar || "👤")}
            </div>
            <div style={{ marginTop:7, textAlign:"center", fontSize:8, background:`${roleColor}20`, border:`1px solid ${roleColor}40`, borderRadius:4, padding:"2px 6px", color:roleColor, fontWeight:700, letterSpacing:"0.06em" }}>{user?.role?.toUpperCase()}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"Georgia, serif", fontSize:18, color:"#fff", fontWeight:700, marginBottom:3 }}>{user?.name}</div>
            <div style={{ fontSize:12, color:COLORS.gold, marginBottom:12, fontWeight:600 }}>{user?.cabor}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["Provinsi", user?.provinsi], ["Bergabung", user?.bergabung]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>{l}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{v||"—"}</div>
                </div>
              ))}
            </div>
          </div>
          {/* QR */}
          <div style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{ background:"#fff", borderRadius:10, padding:5, boxShadow:`0 4px 20px rgba(0,0,0,0.5)`, display:"inline-block" }}>
              {/* Inline QR visual */}
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect width="80" height="80" fill="#fff" rx="4"/>
                {/* Finder TL */}
                <rect x="2" y="2" width="24" height="24" rx="2" fill="#0A1628"/>
                <rect x="5" y="5" width="18" height="18" rx="1" fill="#fff"/>
                <rect x="8" y="8" width="12" height="12" rx="1" fill="#0A1628"/>
                {/* Finder TR */}
                <rect x="54" y="2" width="24" height="24" rx="2" fill="#0A1628"/>
                <rect x="57" y="5" width="18" height="18" rx="1" fill="#fff"/>
                <rect x="60" y="8" width="12" height="12" rx="1" fill="#0A1628"/>
                {/* Finder BL */}
                <rect x="2" y="54" width="24" height="24" rx="2" fill="#0A1628"/>
                <rect x="5" y="57" width="18" height="18" rx="1" fill="#fff"/>
                <rect x="8" y="60" width="12" height="12" rx="1" fill="#0A1628"/>
                {/* Data dots */}
                {[32,36,40,44,48,54,60,66,32,36,40,44,48,32,54,66,40,44,48,54,60].map((x,i) => (
                  <rect key={i} x={x} y={28+((i%7)*4)} width="3" height="3" fill="#0A1628" rx="0.5"/>
                ))}
                {/* ID text */}
                <text x="40" y="76" fontSize="5" fill="#0A1628" fontFamily="monospace" textAnchor="middle">{memberId}</text>
              </svg>
            </div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", marginTop:5 }}>SCAN VERIFY</div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ margin:"0 20px 16px", background:"rgba(255,255,255,0.05)", border:`1px solid ${COLORS.gold}20`, borderRadius:8, padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"monospace", fontSize:14, color:COLORS.gold, letterSpacing:"0.15em", fontWeight:700 }}>{memberId}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E" }} />
            <span style={{ fontSize:10, color:"#22C55E", fontWeight:700 }}>{user?.status || "Aktif"}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
        {[
          { icon:"🏆", label:"Total Prestasi", val:prestasi.length, color:COLORS.gold },
          { icon:"💪", label:"Sesi Selesai", val:jadwal.filter(j=>j.selesai).length, color:"#60A5FA" },
          { icon:"⭐", label:"Total Poin", val:totalPoin, color:COLORS.merah },
        ].map(s => (
          <div key={s.label} style={{ background:`${s.color}10`, border:`1px solid ${s.color}25`, borderRadius:10, padding:"1rem", textAlign:"center", borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color, fontFamily:"Georgia, serif" }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"1rem 1.25rem" }}>
        <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, marginBottom:"0.75rem", letterSpacing:"0.08em", textTransform:"uppercase" }}>📋 Informasi Kartu</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["Nomor Anggota", memberId], ["Masa Berlaku", validUntil], ["Jenis Kartu", "Reguler Digital"], ["Verifikasi", "QR Code + ID"]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{l}</span>
              <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && <KartuAnggota user={user} onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ─── ANALITIKA PERFORMA ──────────────────────────────────────────────────────
function AnalitikaPerforma({ user }) {
  const userId = user?.id || user?.email || "guest";
  const [metrics, setMetrics] = useState(() => loadAtletData("metrics", userId, [
    { label: "VO2 Max", val: 0, unit: "ml/kg/min", target: 65, color: "#60A5FA" },
    { label: "Kecepatan Maks", val: 0, unit: "km/h", target: 36, color: COLORS.gold },
    { label: "Daya Tahan", val: 0, unit: "%", target: 95, color: "#22C55E" },
    { label: "Kekuatan Inti", val: 0, unit: "%", target: 90, color: COLORS.merah },
  ]));
  const [performa, setPerforma] = useState(() => loadAtletData("performa", userId, DEFAULT_PERFORMA));

  const updateMetric = (i, field, val) => {
    const updated = metrics.map((m, idx) => idx === i ? { ...m, [field]: Number(val) } : m);
    setMetrics(updated);
    saveAtletData("metrics", userId, updated);
  };

  const updatePerforma = (i, field, val) => {
    const updated = performa.map((p, idx) => idx === i ? { ...p, [field]: Number(val) } : p);
    setPerforma(updated);
    saveAtletData("performa", userId, updated);
  };

  return (
    <div>
      <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: "0 0 1.5rem" }}>Analitika Performa</h3>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>Klik nilai untuk mengedit data performa Anda secara langsung.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${m.color}25`, borderRadius: 10, padding: "1.1rem", borderLeft: `3px solid ${m.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Target:
                <input type="number" value={m.target} onChange={e => updateMetric(i, "target", e.target.value)}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 11, width: 36, outline: "none", textAlign: "right" }} />
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <input type="number" value={m.val} onChange={e => updateMetric(i, "val", e.target.value)}
                style={{ background: "transparent", border: "none", borderBottom: `1px solid ${m.color}50`, color: m.color, fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", width: 60, outline: "none" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.unit}</span>
            </div>
            <div style={{ marginTop: 8, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((m.val / (m.target || 1)) * 100, 100)}%`, background: m.color, borderRadius: 99, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem" }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tren Performa 6 Minggu</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>Edit nilai langsung di tabel di bawah untuk mengupdate grafik.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: "1rem" }}>
          {performa.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{p.minggu}</div>
              {["stamina","teknik","kecepatan"].map(f => (
                <input key={f} type="number" value={p[f]} onChange={e => updatePerforma(i, f, e.target.value)} min={0} max={100}
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 10, outline: "none", textAlign: "center", marginBottom: 2, boxSizing: "border-box" }}
                  placeholder={f.slice(0,3)} title={f} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: "0.75rem" }}>Baris: Stamina / Teknik / Kecepatan</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={performa}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="minggu" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "rgba(10,22,40,0.95)", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11, color: "#fff" }} />
            <Line type="monotone" dataKey="stamina" stroke={COLORS.merah} strokeWidth={2} dot={false} name="Stamina" />
            <Line type="monotone" dataKey="teknik" stroke={COLORS.gold} strokeWidth={2} dot={false} name="Teknik" />
            <Line type="monotone" dataKey="kecepatan" stroke="#60A5FA" strokeWidth={2} dot={false} name="Kecepatan" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── TARGET & GOAL ───────────────────────────────────────────────────────────
function TargetGoal({ user }) {
  const userId = user?.id || user?.email || "guest";
  const [goals, setGoals] = useState(() => loadAtletData("goals", userId, []));
  const [newGoal, setNewGoal] = useState("");

  const saveGoals = (data) => { setGoals(data); saveAtletData("goals", userId, data); };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    saveGoals([...goals, { id: Date.now(), label: newGoal, progress: 0, deadline: "2026", warna: COLORS.gold, done: false }]);
    setNewGoal("");
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "🎯 Target baru ditambahkan!", type: "success" } }));
  };
  const toggleDone = (id) => saveGoals(goals.map(g => g.id === id ? { ...g, done: !g.done, progress: !g.done ? 100 : g.progress } : g));
  const updateProgress = (id, val) => saveGoals(goals.map(g => g.id === id ? { ...g, progress: Number(val) } : g));
  const hapusGoal = (id) => saveGoals(goals.filter(g => g.id !== id));

  return (
    <div>
      <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: "0 0 1.5rem" }}>Target & Goal</h3>
      {/* Add goal */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          value={newGoal} onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addGoal()}
          placeholder="Tambah target baru..."
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit" }}
        />
        <button onClick={addGoal} style={{ background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border: "none", borderRadius: 8, padding: "10px 18px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          + Tambah
        </button>
      </div>
      {/* Goal list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {goals.map(g => (
          <div key={g.id} style={{
            background: g.done ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${g.done ? "#22C55E30" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10, padding: "1rem 1.25rem",
            borderLeft: `3px solid ${g.done ? "#22C55E" : g.warna}`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <button onClick={() => toggleDone(g.id)} style={{ background: g.done ? "#22C55E" : "rgba(255,255,255,0.08)", border: `1px solid ${g.done ? "#22C55E" : "rgba(255,255,255,0.15)"}`, borderRadius: "50%", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {g.done && <span style={{ fontSize: 12, color: "#000" }}>✓</span>}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: g.done ? "rgba(255,255,255,0.5)" : "#fff", fontWeight: 600, textDecoration: g.done ? "line-through" : "none" }}>{g.label}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Deadline: {g.deadline}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: g.done ? "#22C55E" : g.warna }}>{g.progress}%</span>
              <button onClick={() => hapusGoal(g.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "3px 8px", color: "#f87171", fontSize: 10, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
            {!g.done && (
              <div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${g.progress}%`, background: `linear-gradient(90deg, ${g.warna}, ${COLORS.gold})`, borderRadius: 99, transition: "width 0.3s" }} />
                </div>
                <input type="range" min="0" max="100" value={g.progress} onChange={e => updateProgress(g.id, e.target.value)}
                  style={{ width: "100%", accentColor: g.warna, height: 2 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIF ADMIN ─────────────────────────────────────────────────────────────
function NotifAdmin() {
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-admin-notifs") || "null") || []; } catch { return []; }
  });

  const markAll = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem("koni-admin-notifs", JSON.stringify(updated));
  };
  const markRead = (id) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem("koni-admin-notifs", JSON.stringify(updated));
  };
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: 0 }}>
          Notifikasi Admin {unread > 0 && <span style={{ background: COLORS.merah, borderRadius: 100, padding: "2px 8px", fontSize: 11, marginLeft: 8 }}>{unread}</span>}
        </h3>
        {unread > 0 && (
          <button onClick={markAll} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 14px", color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer" }}>
            Tandai semua dibaca
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {notifs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
            Tidak ada notifikasi saat ini.
          </div>
        ) : notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            style={{
              background: n.read ? "rgba(255,255,255,0.03)" : `${n.color}08`,
              border: `1px solid ${n.read ? "rgba(255,255,255,0.06)" : n.color + "30"}`,
              borderLeft: `3px solid ${n.read ? "transparent" : n.color}`,
              borderRadius: 10, padding: "1rem 1.25rem",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              transition: "all 0.2s",
            }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${n.color}15`, border: `1px solid ${n.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
              {n.tipe === "anggota" ? "👥" : n.tipe === "dokumen" ? "📄" : n.tipe === "pesan" ? "✉️" : n.tipe === "sistem" ? "⚙️" : "🏆"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: n.read ? "rgba(255,255,255,0.6)" : "#fff", fontWeight: n.read ? 400 : 600, marginBottom: 3 }}>{n.msg}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{n.waktu}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPORT DATA ─────────────────────────────────────────────────────────────
function ExportData() {
  const [exporting, setExporting] = useState(null);
  const exports = [
    { id: "anggota", label: "Data Anggota", desc: "Semua data anggota terdaftar (CSV)", icon: "👥", size: "~2.4 MB", color: "#60A5FA" },
    { id: "prestasi", label: "Data Prestasi", desc: "Riwayat medali & kompetisi (CSV)", icon: "🏆", size: "~850 KB", color: COLORS.gold },
    { id: "dokumen", label: "Laporan Dokumen", desc: "Status verifikasi semua dokumen (PDF)", icon: "📄", size: "~1.2 MB", color: "#22C55E" },
    { id: "keuangan", label: "Laporan Keuangan", desc: "Ringkasan keuangan bulanan (XLSX)", icon: "💰", size: "~500 KB", color: "#8B5CF6" },
    { id: "statistik", label: "Statistik Lengkap", desc: "Semua data analitik website (JSON)", icon: "📊", size: "~3.1 MB", color: COLORS.merah },
  ];

  const handleExport = (id) => {
    setExporting(id);
    setTimeout(() => {
      setExporting(null);
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: `📥 Data berhasil diekspor!`, type: "success" } }));
    }, 2000);
  };

  return (
    <div>
      <h3 style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 18, margin: "0 0 0.5rem" }}>Export Data</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        Download data sistem KONI dalam berbagai format untuk kebutuhan laporan dan analisis.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {exports.map(e => (
          <div key={e.id} style={{
            background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 10, padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", gap: 14,
            transition: "background 0.2s",
          }}
            onMouseEnter={el => el.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onMouseLeave={el => el.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${e.color}15`, border: `1px solid ${e.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {e.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{e.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{e.desc} · {e.size}</div>
            </div>
            <button onClick={() => handleExport(e.id)} disabled={!!exporting} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: exporting === e.id ? "rgba(255,255,255,0.06)" : `${e.color}15`,
              border: `1px solid ${e.color}30`,
              borderRadius: 8, padding: "7px 14px",
              color: e.color, fontSize: 11, fontWeight: 700, cursor: exporting ? "default" : "pointer",
              flexShrink: 0, transition: "all 0.2s",
            }}>
              {exporting === e.id
                ? <><RefreshCw size={11} style={{ animation: "spin 1s linear infinite" }} /> Mengekspor...</>
                : <><Download size={11} /> Download</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── EVENT ADMIN ─────────────────────────────────────────────────────────────
function EventAdmin() {
  const [events, setEvents] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-events") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ nama:"", tanggal:"", lokasi:"", cabor:"", kapasitas:"" });
  const [search, setSearch] = React.useState("");

  const statusColor = { "Open":"#22C55E", "Upcoming":COLORS.gold, "Selesai":"rgba(255,255,255,0.3)", "Ditutup":COLORS.merah };
  const filtered = events.filter(e => e.nama.toLowerCase().includes(search.toLowerCase()) || e.cabor.toLowerCase().includes(search.toLowerCase()));

  const saveEvents = (data) => { setEvents(data); localStorage.setItem("koni-events", JSON.stringify(data)); };

  const addEvent = () => {
    if (!form.nama || !form.tanggal) return;
    const newEvent = { id: Date.now(), ...form, status:"Upcoming", peserta:0, kapasitas: parseInt(form.kapasitas)||100 };
    saveEvents([...events, newEvent]);
    setForm({ nama:"", tanggal:"", lokasi:"", cabor:"", kapasitas:"" });
    setShowForm(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"✅ Event berhasil ditambahkan!", type:"success" } }));
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter(e => e.id !== id));
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"🗑️ Event dihapus", type:"info" } }));
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem", flexWrap:"wrap", gap:10 }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Manajemen Event</h3>
        <button onClick={() => setShowForm(p=>!p)} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {showForm ? "✕ Batal" : "+ Tambah Event"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"0.75rem" }}>
            {[
              { label:"Nama Event", key:"nama", placeholder:"Nama kompetisi" },
              { label:"Tanggal", key:"tanggal", placeholder:"15 Jul 2026" },
              { label:"Lokasi", key:"lokasi", placeholder:"GOR / Kota" },
              { label:"Cabor", key:"cabor", placeholder:"Bulutangkis / Multi-Cabor" },
              { label:"Kapasitas Peserta", key:"kapasitas", placeholder:"200" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
              </div>
            ))}
          </div>
          <button onClick={addEvent} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            Simpan Event
          </button>
        </div>
      )}

      <div style={{ display:"flex", gap:8, marginBottom:"1rem" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari event..."
          style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit" }} />
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"3rem", color:"rgba(255,255,255,0.35)", fontSize:13 }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📅</div>
            {search ? "Tidak ditemukan." : "Belum ada event. Klik \"+ Tambah Event\" untuk menambahkan."}
          </div>
        ) : filtered.map(e => (
          <div key={e.id} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"0.9rem 1.1rem", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{e.nama}</span>
                <span style={{ fontSize:9, background:`${statusColor[e.status]}20`, border:`1px solid ${statusColor[e.status]}40`, color:statusColor[e.status], borderRadius:100, padding:"2px 8px", fontWeight:700, letterSpacing:"0.08em" }}>{e.status}</span>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>📅 {e.tanggal} · 📍 {e.lokasi} · 🏅 {e.cabor}</div>
            </div>
            <div style={{ textAlign:"center", minWidth:80 }}>
              <div style={{ fontSize:13, fontWeight:700, color:COLORS.gold }}>{e.peserta}/{e.kapasitas}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Peserta</div>
              <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:99, marginTop:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min((e.peserta/e.kapasitas)*100,100)}%`, background:`linear-gradient(90deg, ${COLORS.merah}, ${COLORS.gold})`, borderRadius:99 }} />
              </div>
            </div>
            <button onClick={()=>deleteEvent(e.id)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:6, color:"#f87171", cursor:"pointer", padding:"6px 10px", fontSize:11 }}>
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CABOR ADMIN ─────────────────────────────────────────────────────────────
function CaborAdmin() {
  const DEFAULT_CABORS = [
    { id:1, nama:"Bulutangkis", icon:"🏸", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"BWF", pembina:"PBSI" },
    { id:2, nama:"Angkat Besi", icon:"🏋️", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"IWF", pembina:"PAWBI" },
    { id:3, nama:"Pencak Silat", icon:"🥋", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"PERSILAT", pembina:"IPSI" },
    { id:4, nama:"Atletik", icon:"🏃", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"World Athletics", pembina:"PASI" },
    { id:5, nama:"Renang", icon:"🏊", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"FINA", pembina:"PRSI" },
    { id:6, nama:"Panahan", icon:"🏹", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"World Archery", pembina:"Perpani" },
    { id:7, nama:"Sepak Bola", icon:"⚽", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"FIFA/AFC", pembina:"PSSI" },
    { id:8, nama:"Voli", icon:"🏐", pelatih:"", atlet:0, medali:0, status:"Aktif", federasi:"FIVB", pembina:"PBVSI" },
  ];
  const [cabors, setCabors] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-cabors") || "null") || DEFAULT_CABORS; } catch { return DEFAULT_CABORS; }
  });
  const [selected, setSelected] = React.useState(null);
  const [editPelatih, setEditPelatih] = React.useState("");

  const savePelatih = (id) => {
    const updated = cabors.map(c => c.id === id ? {...c, pelatih: editPelatih} : c);
    setCabors(updated);
    localStorage.setItem("koni-cabors", JSON.stringify(updated));
    setSelected(null);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"✅ Data pelatih diperbarui!", type:"success" } }));
  };

  return (
    <div>
      <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:"0 0 1.25rem" }}>Manajemen Cabang Olahraga</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
        {cabors.map(c => (
          <div key={c.id} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:12, padding:"1.1rem", transition:"all 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:28, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:`${COLORS.merah}15`, borderRadius:8 }}>{c.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{c.nama}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>{c.pembina} · {c.federasi}</div>
              </div>
              <span style={{ fontSize:9, background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.3)", color:"#4ADE80", borderRadius:100, padding:"2px 8px", fontWeight:700 }}>{c.status}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
              {[{l:"Atlet",v:c.atlet,col:"#60A5FA"},{l:"Medali",v:c.medali,col:COLORS.gold},{l:"Pelatih",v:1,col:"#22C55E"}].map(s=>(
                <div key={s.l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"6px 8px", textAlign:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:s.col }}>{s.v}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            {selected === c.id ? (
              <div style={{ display:"flex", gap:6 }}>
                <input value={editPelatih} onChange={e=>setEditPelatih(e.target.value)} placeholder="Nama pelatih baru"
                  style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:11, outline:"none", fontFamily:"inherit" }} />
                <button onClick={()=>savePelatih(c.id)} style={{ background:`${COLORS.gold}20`, border:`1px solid ${COLORS.gold}40`, borderRadius:6, color:COLORS.gold, cursor:"pointer", padding:"6px 10px", fontSize:11, fontWeight:700 }}>✓</button>
                <button onClick={()=>setSelected(null)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, color:"rgba(255,255,255,0.5)", cursor:"pointer", padding:"6px 10px", fontSize:11 }}>✕</button>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>👨‍🏫 {c.pelatih}</span>
                <button onClick={()=>{ setSelected(c.id); setEditPelatih(c.pelatih); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, color:"rgba(255,255,255,0.5)", cursor:"pointer", padding:"4px 8px", fontSize:10 }}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BROADCAST ADMIN ─────────────────────────────────────────────────────────
function BroadcastAdmin() {
  const [judul, setJudul] = React.useState("");
  const [isi, setIsi] = React.useState("");
  const [target, setTarget] = React.useState("semua");
  const [tipe, setTipe] = React.useState("info");
  const [sending, setSending] = React.useState(false);
  const [history, setHistory] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-broadcast-history") || "[]"); } catch { return []; }
  });

  const targetOpts = [
    { val:"semua", label:"Semua Anggota", icon:"👥" },
    { val:"atlet", label:"Hanya Atlet", icon:"🏃" },
    { val:"pelatih", label:"Hanya Pelatih", icon:"🧑‍🏫" },
    { val:"provinsi", label:"Per Provinsi", icon:"🗺️" },
  ];
  const tipeOpts = [
    { val:"info", label:"Informasi", color:"#3B82F6" },
    { val:"success", label:"Prestasi", color:"#22C55E" },
    { val:"warning", label:"Peringatan", color:"#F59E0B" },
    { val:"urgent", label:"Urgent", color:COLORS.merah },
  ];
  const tipeColor = tipeOpts.find(t=>t.val===tipe)?.color || "#3B82F6";

  const kirim = () => {
    if (!judul.trim() || !isi.trim()) {
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"Isi judul dan pesan terlebih dahulu!", type:"error" } }));
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      const trg = targetOpts.find(t=>t.val===target);
      const newEntry = { id:Date.now(), judul, target:trg?.label||"Semua", tipe, waktu:"Baru saja", terkirim: 0 };
      const updated = [newEntry, ...history];
      setHistory(updated);
      localStorage.setItem("koni-broadcast-history", JSON.stringify(updated));
      setJudul(""); setIsi("");
      window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:`📣 Pengumuman berhasil disimpan!`, type:"success" } }));
    }, 1800);
  };

  return (
    <div>
      <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:"0 0 1.5rem" }}>Broadcast Pengumuman</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
        {/* Compose */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>📝 Buat Pengumuman</div>
          <div style={{ marginBottom:"0.75rem" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Judul</div>
            <input value={judul} onChange={e=>setJudul(e.target.value)} placeholder="Judul pengumuman..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"0.75rem" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Isi Pesan</div>
            <textarea value={isi} onChange={e=>setIsi(e.target.value)} placeholder="Tulis pesan pengumuman..." rows={4}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 12px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"0.75rem" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Tipe</div>
            <div style={{ display:"flex", gap:6 }}>
              {tipeOpts.map(t => (
                <button key={t.val} onClick={()=>setTipe(t.val)} style={{ flex:1, padding:"6px 0", borderRadius:6, background:tipe===t.val?`${t.color}20`:"rgba(255,255,255,0.04)", border:`1px solid ${tipe===t.val?t.color+"50":"rgba(255,255,255,0.08)"}`, color:tipe===t.val?t.color:"rgba(255,255,255,0.4)", fontSize:10, fontWeight:600, cursor:"pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Target Penerima</div>
            {targetOpts.map(t => (
              <button key={t.val} onClick={()=>setTarget(t.val)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", borderRadius:8, background:target===t.val?`${tipeColor}10`:"transparent", border:`1px solid ${target===t.val?tipeColor+"40":"transparent"}`, color:target===t.val?"#fff":"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer", marginBottom:4, transition:"all 0.15s" }}>
                <span>{t.icon}</span> {t.label}
                {target===t.val && <span style={{ marginLeft:"auto", fontSize:12 }}>●</span>}
              </button>
            ))}
          </div>
          <button onClick={kirim} disabled={sending} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:sending?"rgba(255,255,255,0.06)":`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:10, padding:"12px", color:"#fff", fontSize:13, fontWeight:700, cursor:sending?"default":"pointer", boxShadow:sending?"none":"0 4px 16px rgba(204,0,0,0.3)", transition:"all 0.2s" }}>
            {sending ? "📣 Mengirim..." : "📣 Kirim Sekarang"}
          </button>
        </div>
        {/* History */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>📋 Riwayat Pengumuman</div>
          {history.map(h => {
            const tc = tipeOpts.find(t=>t.val===h.tipe)?.color||"#3B82F6";
            return (
              <div key={h.id} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${tc}20`, borderLeft:`3px solid ${tc}`, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:3 }}>{h.judul}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>👥 {h.target} · {h.waktu}</span>
                  <span style={{ fontSize:10, color:tc, fontWeight:700 }}>✓ {h.terkirim.toLocaleString("id-ID")} terkirim</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PELATIH ADMIN ────────────────────────────────────────────────────────────
function PelatihAdmin() {
  const [pelatih, setPelatih] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-pelatih") || "[]"); } catch { return []; }
  });
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ nama:"", cabor:"", icon:"🏅", lisensi:"Level B", atlet:"", status:"Aktif", pengalaman:"", hp:"" });

  const savePelatih = (data) => { setPelatih(data); localStorage.setItem("koni-pelatih", JSON.stringify(data)); };

  const tambah = () => {
    if (!form.nama.trim()) return;
    savePelatih([...pelatih, { ...form, id: Date.now(), atlet: parseInt(form.atlet) || 0 }]);
    setForm({ nama:"", cabor:"", icon:"🏅", lisensi:"Level B", atlet:"", status:"Aktif", pengalaman:"", hp:"" });
    setShowForm(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg: "🧑‍🏫 Pelatih berhasil ditambahkan!", type: "success" } }));
  };

  const hapus = (id) => savePelatih(pelatih.filter(p => p.id !== id));

  const filtered = pelatih.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()) || p.cabor.toLowerCase().includes(search.toLowerCase()));
  const lisensiColor = { "Level S": COLORS.gold, "Level A":"#22C55E", "Level B":"#60A5FA", "Level C":"rgba(255,255,255,0.4)" };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Manajemen Pelatih</h3>
        <button onClick={() => setShowForm(p => !p)} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {showForm ? "✕ Batal" : "+ Tambah Pelatih"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            {[
              { label:"Nama Pelatih *", key:"nama", placeholder:"Nama lengkap" },
              { label:"Cabang Olahraga", key:"cabor", placeholder:"Bulutangkis" },
              { label:"No. HP", key:"hp", placeholder:"0812-xxxx-xxxx" },
              { label:"Pengalaman", key:"pengalaman", placeholder:"10 tahun" },
              { label:"Jumlah Atlet", key:"atlet", placeholder:"0" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Lisensi</div>
              <select value={form.lisensi} onChange={e => setForm(p=>({...p, lisensi:e.target.value}))}
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none" }}>
                {["Level S","Level A","Level B","Level C"].map(l => <option key={l} value={l} style={{background:"#0A1628"}}>{l}</option>)}
              </select>
            </div>
          </div>
          <button onClick={tambah} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            ✓ Simpan Pelatih
          </button>
        </div>
      )}

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pelatih atau cabor..."
        style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 14px", color:"#fff", fontSize:12, outline:"none", fontFamily:"inherit", marginBottom:"1rem", boxSizing:"border-box" }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"rgba(255,255,255,0.35)", fontSize:13 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🧑‍🏫</div>
          {search ? "Tidak ditemukan." : "Belum ada pelatih terdaftar. Klik \"+ Tambah Pelatih\" untuk menambahkan."}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {filtered.map(p => (
            <div key={p.id} onClick={()=>setSelected(selected===p.id?null:p.id)}
              style={{ background: selected===p.id?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.04)", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:12, padding:"1rem 1.25rem", cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:`${COLORS.merah}15`, border:`1px solid ${COLORS.merah}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{p.icon || "🏅"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{p.nama}</span>
                    <span style={{ fontSize:9, background:`${lisensiColor[p.lisensi] || "#60A5FA"}15`, border:`1px solid ${lisensiColor[p.lisensi] || "#60A5FA"}40`, color:lisensiColor[p.lisensi] || "#60A5FA", borderRadius:100, padding:"1px 7px", fontWeight:700 }}>{p.lisensi}</span>
                    <span style={{ fontSize:9, background:p.status==="Aktif"?"rgba(34,197,94,0.12)":"rgba(251,191,36,0.12)", color:p.status==="Aktif"?"#4ADE80":"#FCD34D", borderRadius:100, padding:"1px 7px", fontWeight:700 }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{p.cabor}{p.atlet ? ` · ${p.atlet} atlet binaan` : ""}{p.pengalaman ? ` · Exp: ${p.pengalaman}` : ""}</div>
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>{selected===p.id?"▲":"▼"}</div>
              </div>
              {selected===p.id && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                  {p.hp && <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>📞 {p.hp}</div>}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={e => { e.stopPropagation(); hapus(p.id); }} style={{ flex:1, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"7px", color:"#f87171", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑️ Hapus</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AUDIT TRAIL ─────────────────────────────────────────────────────────────
function AuditTrail() {
  const [filter, setFilter] = React.useState("semua");
  const [logs] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-audit-logs") || "[]"); } catch { return []; }
  });
  const tipeColor = { create:"#22C55E", edit:COLORS.gold, delete:"#EF4444", verify:"#60A5FA", system:"rgba(255,255,255,0.4)", broadcast:"#8B5CF6" };
  const filtered = filter==="semua" ? logs : logs.filter(l=>l.tipe===filter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Audit Trail</h3>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Semua aktivitas admin tercatat otomatis</div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
        {["semua","create","edit","delete","verify","system","broadcast"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"5px 12px", borderRadius:100, background:filter===f?`${tipeColor[f]||COLORS.merah}20`:"rgba(255,255,255,0.05)", border:`1px solid ${filter===f?tipeColor[f]||COLORS.merah+"50":"rgba(255,255,255,0.1)"}`, color:filter===f?tipeColor[f]||"#fff":"rgba(255,255,255,0.45)", fontSize:10, fontWeight:600, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"rgba(255,255,255,0.35)", fontSize:13 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
          Belum ada aktivitas yang tercatat{filter !== "semua" ? ` untuk filter "${filter}"` : ""}.
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"100px 90px 1fr 80px", padding:"8px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.04)" }}>
            {["Waktu","Admin","Aktivitas","IP"].map(h=>(
              <div key={h} style={{ fontSize:9, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>{h}</div>
            ))}
          </div>
          {filtered.map((log,i)=>(
            <div key={log.id} style={{ display:"grid", gridTemplateColumns:"100px 90px 1fr 80px", padding:"10px 14px", borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.04)":"none", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"monospace" }}>{log.waktu}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", fontWeight:600 }}>{log.user}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:9, background:`${tipeColor[log.tipe]}15`, border:`1px solid ${tipeColor[log.tipe]}30`, color:tipeColor[log.tipe], borderRadius:100, padding:"2px 7px", fontWeight:700, letterSpacing:"0.08em", flexShrink:0 }}>{log.aksi}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>{log.target}</span>
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", fontFamily:"monospace" }}>{log.ip}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROLE & PERMISSION ────────────────────────────────────────────────────────
function RolePermission() {
  const PERMISSIONS = ["Lihat Anggota","Tambah Anggota","Edit Anggota","Hapus Anggota","Kelola Berita","Kelola Event","Broadcast","Export Data","Verifikasi Dokumen","Pengaturan Sistem","Audit Trail","Laporan"];
  const [roles, setRoles] = React.useState({
    "Super Admin": { color:COLORS.gold, perms: PERMISSIONS.reduce((a,p)=>({...a,[p]:true}),{}) },
    "Admin Provinsi": { color:"#60A5FA", perms: PERMISSIONS.reduce((a,p)=>({...a,[p]:["Lihat Anggota","Edit Anggota","Kelola Berita","Verifikasi Dokumen","Laporan"].includes(p)}),{}) },
    "Pelatih": { color:"#22C55E", perms: PERMISSIONS.reduce((a,p)=>({...a,[p]:["Lihat Anggota"].includes(p)}),{}) },
    "Atlet": { color:"#8B5CF6", perms: PERMISSIONS.reduce((a,p)=>({...a,[p]:false}),{}) },
  });
  const [activeRole, setActiveRole] = React.useState("Admin Provinsi");
  const togglePerm = (perm) => {
    if (activeRole==="Super Admin") return;
    setRoles(p=>({...p,[activeRole]:{...p[activeRole],perms:{...p[activeRole].perms,[perm]:!p[activeRole].perms[perm]}}}));
  };
  const save = () => window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"✅ Permission berhasil disimpan!", type:"success" } }));

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Role & Permission</h3>
        <button onClick={save} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>💾 Simpan</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:"1rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {Object.entries(roles).map(([name, role])=>(
            <button key={name} onClick={()=>setActiveRole(name)} style={{ padding:"10px 14px", borderRadius:10, background:activeRole===name?`${role.color}15`:"rgba(255,255,255,0.04)", border:`1px solid ${activeRole===name?role.color+"50":"rgba(255,255,255,0.08)"}`, color:activeRole===name?"#fff":"rgba(255,255,255,0.55)", fontSize:12, fontWeight:activeRole===name?700:400, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:role.color, flexShrink:0 }} />
              {name}
              {name==="Super Admin" && <span style={{ marginLeft:"auto", fontSize:9, color:COLORS.gold }}>🔒</span>}
            </button>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:roles[activeRole]?.color, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            Hak Akses: {activeRole}
            {activeRole==="Super Admin" && <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:400, marginLeft:8, fontSize:10 }}>— tidak bisa diubah</span>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {PERMISSIONS.map(perm=>{
              const on = roles[activeRole]?.perms[perm];
              const locked = activeRole==="Super Admin";
              return (
                <div key={perm} onClick={()=>togglePerm(perm)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, background:on?"rgba(34,197,94,0.08)":"rgba(255,255,255,0.03)", border:`1px solid ${on?"rgba(34,197,94,0.25)":"rgba(255,255,255,0.07)"}`, cursor:locked?"default":"pointer", transition:"all 0.15s" }}>
                  <div style={{ width:16, height:16, borderRadius:4, background:on?"#22C55E":"rgba(255,255,255,0.1)", border:`1px solid ${on?"#22C55E":"rgba(255,255,255,0.15)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10 }}>
                    {on && "✓"}
                  </div>
                  <span style={{ fontSize:11, color:on?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.4)" }}>{perm}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KEUANGAN ADMIN ───────────────────────────────────────────────────────────
function KeuanganAdmin() {
  const [transaksi, setTransaksi] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("koni-keuangan") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ tipe:"masuk", ket:"", jumlah:"", tgl: new Date().toLocaleDateString("id-ID") });

  const saveTransaksi = (data) => { setTransaksi(data); localStorage.setItem("koni-keuangan", JSON.stringify(data)); };

  const tambah = () => {
    if (!form.ket.trim() || !form.jumlah) return;
    saveTransaksi([{ id: Date.now(), ...form, jumlah: parseInt(form.jumlah.replace(/\D/g, "")) || 0 }, ...transaksi]);
    setForm({ tipe:"masuk", ket:"", jumlah:"", tgl: new Date().toLocaleDateString("id-ID") });
    setShowForm(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"💰 Transaksi dicatat!", type:"success" } }));
  };

  const hapus = (id) => saveTransaksi(transaksi.filter(t => t.id !== id));

  const fmt = (n) => "Rp " + (n >= 1000000 ? (n/1000000).toFixed(0) + " jt" : n.toLocaleString("id-ID"));

  const totalMasuk = transaksi.filter(t => t.tipe === "masuk").reduce((a, b) => a + (b.jumlah||0), 0);
  const totalKeluar = transaksi.filter(t => t.tipe === "keluar").reduce((a, b) => a + (b.jumlah||0), 0);
  const saldo = totalMasuk - totalKeluar;

  // Build monthly cashflow from transactions
  const byBulan = {};
  transaksi.forEach(t => {
    const bln = t.tgl?.split(" ").slice(-2, -1)[0] || t.tgl?.split("/")[1] || "?";
    if (!byBulan[bln]) byBulan[bln] = { bln, masuk:0, keluar:0 };
    if (t.tipe === "masuk") byBulan[bln].masuk += (t.jumlah||0) / 1000000;
    else byBulan[bln].keluar += (t.jumlah||0) / 1000000;
  });
  const cashflow = Object.values(byBulan).slice(-6);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Dashboard Keuangan</h3>
        <button onClick={() => setShowForm(p => !p)} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {showForm ? "✕ Batal" : "+ Catat Transaksi"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"1.25rem", marginBottom:"1.5rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Tipe</div>
              <select value={form.tipe} onChange={e => setForm(p=>({...p, tipe:e.target.value}))}
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none" }}>
                <option value="masuk" style={{background:"#0A1628"}}>⬆ Pemasukan</option>
                <option value="keluar" style={{background:"#0A1628"}}>⬇ Pengeluaran</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Tanggal</div>
              <input value={form.tgl} onChange={e => setForm(p=>({...p, tgl:e.target.value}))} placeholder="01 Jun 2026"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Keterangan *</div>
              <input value={form.ket} onChange={e => setForm(p=>({...p, ket:e.target.value}))} placeholder="Iuran anggota Mei 2026"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Jumlah (Rp) *</div>
              <input value={form.jumlah} onChange={e => setForm(p=>({...p, jumlah:e.target.value}))} placeholder="168000000"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
            </div>
          </div>
          <button onClick={tambah} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            ✓ Simpan Transaksi
          </button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
        {[
          { label:"Total Pemasukan", val: fmt(totalMasuk), color:"#22C55E" },
          { label:"Total Pengeluaran", val: fmt(totalKeluar), color:COLORS.merah },
          { label:"Saldo Bersih", val: fmt(saldo), color: saldo >= 0 ? COLORS.gold : "#EF4444" },
        ].map((s,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${s.color}25`, borderRadius:10, padding:"1rem", borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:18, fontWeight:700, color:s.color, fontFamily:"Georgia, serif", marginBottom:2 }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: cashflow.length > 0 ? "1fr 1fr" : "1fr", gap:"1rem" }}>
        {cashflow.length > 0 && (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
            <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>📊 Cashflow (Juta Rp)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={cashflow}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <XAxis dataKey="bln" tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:"rgba(255,255,255,0.4)",fontSize:10}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:"rgba(10,22,40,0.95)",border:`1px solid ${COLORS.border}`,borderRadius:8,fontSize:11,color:"#fff"}} />
                <Bar dataKey="masuk" name="Pemasukan" fill="#22C55E" radius={[3,3,0,0]} />
                <Bar dataKey="keluar" name="Pengeluaran" fill={COLORS.merah} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"1.25rem" }}>
          <div style={{ fontSize:11, color:COLORS.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>📋 Riwayat Transaksi</div>
          {transaksi.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2rem", color:"rgba(255,255,255,0.3)", fontSize:12 }}>Belum ada transaksi. Klik "+ Catat Transaksi".</div>
          ) : transaksi.slice(0, 8).map((t,i) => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<Math.min(transaksi.length,8)-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
              <div style={{ width:28, height:28, borderRadius:6, background:t.tipe==="masuk"?"rgba(34,197,94,0.12)":"rgba(204,0,0,0.12)", border:`1px solid ${t.tipe==="masuk"?"rgba(34,197,94,0.25)":"rgba(204,0,0,0.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                {t.tipe==="masuk"?"↑":"↓"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.ket}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{t.tgl}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:t.tipe==="masuk"?"#4ADE80":"#f87171", flexShrink:0 }}>
                {t.tipe==="masuk"?"+":"-"}{fmt(t.jumlah||0)}
              </div>
              <button onClick={() => hapus(t.id)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:4, padding:"3px 7px", color:"#f87171", fontSize:10, cursor:"pointer", flexShrink:0 }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PENGUMUMAN ATLET (connected to broadcast admin) ──────────────────────────
function PengumumanAtlet({ user }) {
  const broadcasts = (() => { try { return JSON.parse(localStorage.getItem("koni-broadcast-history") || "[]"); } catch { return []; } })();
  const tipeColor = { info:"#3B82F6", success:"#22C55E", warning:"#F59E0B", urgent:COLORS.merah };
  const tipeIcon = { info:"📢", success:"✅", warning:"⚠️", urgent:"🚨" };
  const [filter, setFilter] = useState("semua");

  const filtered = filter === "semua" ? broadcasts : broadcasts.filter(b => b.tipe === filter);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:"0 0 4px" }}>Pengumuman Resmi KONI</h3>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", margin:0 }}>Semua pengumuman langsung dari admin KONI</p>
        </div>
        {broadcasts.length > 0 && (
          <div style={{ background:`${COLORS.gold}15`, border:`1px solid ${COLORS.gold}30`, borderRadius:100, padding:"4px 12px", fontSize:11, color:COLORS.gold, fontWeight:700 }}>
            {broadcasts.length} pengumuman
          </div>
        )}
      </div>

      {/* Filter */}
      {broadcasts.length > 0 && (
        <div style={{ display:"flex", gap:6, marginBottom:"1.25rem", flexWrap:"wrap" }}>
          {["semua","info","success","warning","urgent"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"5px 12px", borderRadius:100, cursor:"pointer",
              background: filter===f ? `${tipeColor[f]||COLORS.gold}20` : "rgba(255,255,255,0.05)",
              border: `1px solid ${filter===f ? tipeColor[f]||COLORS.gold+"50" : "rgba(255,255,255,0.1)"}`,
              color: filter===f ? tipeColor[f]||COLORS.gold : "rgba(255,255,255,0.45)",
              fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em",
            }}>
              {tipeIcon[f] || "📋"} {f}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem 2rem", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📢</div>
          <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Belum ada pengumuman</div>
          <div style={{ fontSize:12 }}>Pengumuman dari admin KONI akan muncul di sini secara otomatis.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {filtered.map((b, i) => (
            <div key={b.id || i} style={{
              background:"rgba(255,255,255,0.04)",
              border:`1px solid ${tipeColor[b.tipe]||"rgba(255,255,255,0.08)"}30`,
              borderLeft:`4px solid ${tipeColor[b.tipe]||"rgba(255,255,255,0.2)"}`,
              borderRadius:10, padding:"1rem 1.25rem",
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ fontSize:22, flexShrink:0 }}>{tipeIcon[b.tipe] || "📢"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ fontSize:14, color:"#fff", fontWeight:700 }}>{b.judul}</div>
                    <span style={{
                      fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:100,
                      background:`${tipeColor[b.tipe]||"#60A5FA"}15`,
                      border:`1px solid ${tipeColor[b.tipe]||"#60A5FA"}30`,
                      color: tipeColor[b.tipe] || "#60A5FA",
                      textTransform:"uppercase", letterSpacing:"0.08em",
                    }}>{b.tipe || "info"}</span>
                  </div>
                  {b.isi && <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.6, marginBottom:8 }}>{b.isi}</div>}
                  <div style={{ display:"flex", gap:12, fontSize:10, color:"rgba(255,255,255,0.3)" }}>
                    <span>🕐 {b.waktu}</span>
                    {b.target && <span>👥 {b.target}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── INBOX ATLET (pesan dari admin & balas) ─────────────────────────────────
function InboxAtlet({ user }) {
  const userId = user?.id || user?.email || "guest";
  const storageKey = `koni-inbox-${userId}`;

  const [msgs, setMsgs] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; } });
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ subject:"", body:"" });

  const saveMsgs = (data) => { setMsgs(data); localStorage.setItem(storageKey, JSON.stringify(data)); };

  const markRead = (id) => saveMsgs(msgs.map(m => m.id === id ? { ...m, read: true } : m));

  const selectMsg = (m) => {
    setSelected(m.id === selected?.id ? null : m);
    if (!m.read) markRead(m.id);
    setReplyText("");
  };

  const sendReply = () => {
    if (!replyText.trim() || !selected) return;
    const updated = msgs.map(m => m.id === selected.id ? {
      ...m,
      replies: [...(m.replies || []), { from: user?.name || "Saya", text: replyText, waktu: new Date().toLocaleString("id-ID") }]
    } : m);
    saveMsgs(updated);
    setSelected(updated.find(m => m.id === selected.id));
    setReplyText("");
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"✉️ Balasan terkirim!", type:"success" } }));
  };

  const sendCompose = () => {
    if (!compose.subject.trim()) return;
    // Save to admin inbox (shared)
    const adminMsgs = (() => { try { return JSON.parse(localStorage.getItem("koni-admin-notifs") || "[]"); } catch { return []; } })();
    const newNotif = { id: Date.now(), tipe:"anggota", msg:`Pesan dari ${user?.name}: ${compose.subject}`, isi: compose.body, waktu:"Baru saja", read:false, color:"#60A5FA", dari: user?.name, userId };
    localStorage.setItem("koni-admin-notifs", JSON.stringify([newNotif, ...adminMsgs]));
    setCompose({ subject:"", body:"" });
    setShowCompose(false);
    window.dispatchEvent(new CustomEvent("koni-toast", { detail: { msg:"✉️ Pesan terkirim ke admin!", type:"success" } }));
  };

  const hapus = (id) => { saveMsgs(msgs.filter(m => m.id !== id)); if (selected?.id === id) setSelected(null); };

  const unread = msgs.filter(m => !m.read).length;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#fff", fontSize:18, margin:0 }}>Pesan & Inbox</h3>
          {unread > 0 && (
            <div style={{ background:`${COLORS.merah}20`, border:`1px solid ${COLORS.merah}40`, borderRadius:100, padding:"3px 10px", fontSize:11, color:COLORS.merah, fontWeight:700 }}>
              {unread} belum dibaca
            </div>
          )}
        </div>
        <button onClick={() => setShowCompose(p => !p)} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {showCompose ? "✕ Batal" : "✉️ Kirim Pesan ke Admin"}
        </button>
      </div>

      {/* Compose form */}
      {showCompose && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ fontSize:13, color:COLORS.gold, fontWeight:700, marginBottom:"1rem" }}>✉️ Pesan Baru ke Admin KONI</div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Subjek *</div>
            <input value={compose.subject} onChange={e => setCompose(p=>({...p, subject:e.target.value}))} placeholder="Perihal pesan Anda..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Isi Pesan</div>
            <textarea value={compose.body} onChange={e => setCompose(p=>({...p, body:e.target.value}))} rows={4} placeholder="Tulis pesan Anda di sini..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", resize:"vertical", lineHeight:1.6, boxSizing:"border-box" }} />
          </div>
          <button onClick={sendCompose} disabled={!compose.subject.trim()} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:8, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", opacity: compose.subject.trim() ? 1 : 0.5 }}>
            📤 Kirim Pesan
          </button>
        </div>
      )}

      {msgs.length === 0 ? (
        <div style={{ textAlign:"center", padding:"4rem 2rem", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Inbox kosong</div>
          <div style={{ fontSize:12 }}>Pesan dari admin KONI akan muncul di sini.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {msgs.map(m => (
            <div key={m.id}>
              <div onClick={() => selectMsg(m)} style={{
                background: selected?.id === m.id ? "rgba(255,255,255,0.07)" : m.read ? "rgba(255,255,255,0.03)" : "rgba(184,150,12,0.08)",
                border: `1px solid ${selected?.id === m.id ? "rgba(255,255,255,0.15)" : m.read ? "rgba(255,255,255,0.07)" : `${COLORS.gold}40`}`,
                borderLeft: `3px solid ${m.read ? "rgba(255,255,255,0.1)" : COLORS.gold}`,
                borderRadius:10, padding:"0.9rem 1.1rem", cursor:"pointer", transition:"all 0.2s",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:`${COLORS.merah}20`, border:`1px solid ${COLORS.merah}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {m.from === "Admin KONI" ? "🏛️" : "👤"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:m.read?500:700, color:"#fff" }}>{m.from || "Admin KONI"}</span>
                      {!m.read && <span style={{ width:7, height:7, borderRadius:"50%", background:COLORS.gold, flexShrink:0, display:"inline-block" }} />}
                    </div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontWeight:m.read?400:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.subject}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:4 }}>{m.waktu}</div>
                    {m.replies?.length > 0 && <div style={{ fontSize:9, color:"#60A5FA" }}>💬 {m.replies.length}</div>}
                  </div>
                </div>
              </div>

              {/* Expanded thread */}
              {selected?.id === m.id && (
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"0 0 10px 10px", padding:"1rem 1.1rem", borderTop:"none" }}>
                  {/* Original message */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"0.85rem 1rem", marginBottom:"0.75rem" }}>
                    <div style={{ fontSize:10, color:COLORS.gold, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Dari Admin KONI · {m.waktu}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.7 }}>{m.body || m.subject}</div>
                  </div>
                  {/* Replies */}
                  {(m.replies || []).map((r, ri) => (
                    <div key={ri} style={{ background:`${COLORS.merah}10`, border:`1px solid ${COLORS.merah}20`, borderRadius:8, padding:"0.75rem 1rem", marginBottom:"0.5rem" }}>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>Anda · {r.waktu}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{r.text}</div>
                    </div>
                  ))}
                  {/* Reply box */}
                  <div style={{ marginTop:"0.75rem" }}>
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2} placeholder="Tulis balasan..."
                      style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", resize:"none", lineHeight:1.6, boxSizing:"border-box", marginBottom:8 }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={sendReply} disabled={!replyText.trim()} style={{ background:`linear-gradient(135deg, ${COLORS.merah}, #8B0000)`, border:"none", borderRadius:6, padding:"7px 16px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", opacity:replyText.trim()?1:0.5 }}>↩ Balas</button>
                      <button onClick={() => hapus(m.id)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:6, padding:"7px 12px", color:"#f87171", fontSize:11, cursor:"pointer" }}>🗑️ Hapus</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ onClose }) {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const menuItems = isAdmin
    ? [adminMenu[0], adminMenu[1], ...adminFeatureMenu, adminMenu[2], adminMenu[3]]
    : memberMenu;

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const handleViewAsUser = () => {
    onClose?.(); // Close dashboard to show normal website view
  };

  const renderContent = () => {
    if (isAdmin) {
      switch (active) {
        case "overview": return <AdminOverview user={user} />;
        case "anggota": return <MemberManagement />;
        case "berita": return <NewsManagement />;
        case "pesan": return <MessageInbox />;
        case "dokumen-admin": return <DocumentVerification />;
        case "laporan": return <Reports />;
        case "pengaturan": return <Settings />;
        case "notif-admin":   return <NotifAdmin />;
        case "event-admin":   return <EventAdmin />;
        case "cabor-admin":   return <CaborAdmin />;
        case "broadcast":     return <BroadcastAdmin />;
        case "pelatih-admin": return <PelatihAdmin />;
        case "audit-trail":   return <AuditTrail />;
        case "role-mgmt":     return <RolePermission />;
        case "keuangan":      return <KeuanganAdmin />;
        case "export-admin":  return <ExportData />;
        default: return <AdminOverview user={user} />;
      }
    }

    if (editMode && active === "profil") {
      return <EditProfil user={user} onClose={() => setEditMode(false)} />;
    }

    switch (active) {
      case "overview": return <Overview user={user} />;
      case "profil": return <ProfilSaya user={user} onEdit={() => setEditMode(true)} />;
      case "prestasi": return <Prestasi user={user} />;
      case "kartu": return <KartuAnggotaView user={user} />;
      case "jadwal": return <Jadwal user={user} />;
      case "performa": return <AnalitikaPerforma user={user} />;
      case "target": return <TargetGoal user={user} />;
      case "dokumen": return <Dokumen user={user} />;
      case "pengumuman": return <PengumumanAtlet user={user} />;
      case "inbox-atlet": return <InboxAtlet user={user} />;
      default: return null;
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(5,10,20,0.9)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        animation: "fadeInOverlay 0.25s ease",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 860, maxHeight: "90vh",
        background: `linear-gradient(160deg, ${COLORS.navyMid} 0%, ${COLORS.navy} 100%)`,
        borderRadius: 16, border: `1px solid ${COLORS.border}`,
        display: "flex", overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
        animation: "slideUpModal 0.3s ease",
      }}>
        {/* Sidebar */}
        <div style={{
          width: 210, flexShrink: 0,
          background: "rgba(0,0,0,0.3)",
          borderRight: `1px solid rgba(255,255,255,0.06)`,
          padding: "1.5rem 0",
          display: "flex", flexDirection: "column",
        }}>
          {/* Logo */}
          <div style={{ padding: "0 1.25rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                border: `1.5px solid ${COLORS.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>🏆</div>
              <div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#fff", fontWeight: 700 }}>KONI PUSAT</div>
                <div style={{ fontSize: 8, color: COLORS.gold, letterSpacing: "0.08em" }}>{isAdmin ? 'PORTAL ADMIN' : 'PORTAL ANGGOTA'}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "0.75rem 0" }}>
            {menuItems.map((item) => {
              const isInbox = item.id === "inbox-atlet";
              const userId2 = user?.id || user?.email || "guest";
              const unreadCount = isInbox ? (() => { try { return JSON.parse(localStorage.getItem(`koni-inbox-${userId2}`) || "[]").filter(m => !m.read).length; } catch { return 0; } })() : 0;
              return (
                <button key={item.id} onClick={() => setActive(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 1.25rem",
                  background: active === item.id ? "rgba(204,0,0,0.15)" : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${active === item.id ? COLORS.merah : "transparent"}`,
                  color: active === item.id ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: 13, fontWeight: active === item.id ? 600 : 400,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                  justifyContent: "space-between",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    {item.label}
                  </div>
                  {unreadCount > 0 && (
                    <span style={{ background:COLORS.merah, borderRadius:100, padding:"1px 7px", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* View as User (Admin only) */}
          {isAdmin && (
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={handleViewAsUser} style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "9px 12px",
                background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 6, color: "#60a5fa", fontSize: 12, fontWeight: 600,
                cursor: "pointer",
              }}>
                <span>👁️</span> Lihat Tampilan
              </button>
            </div>
          )}

          {/* Logout */}
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: 8,
              width: "100%", padding: "9px 12px",
              background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.2)",
              borderRadius: 6, color: "#f87171", fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}>
              <span>🚪</span> Keluar
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.75rem" }}>
          {/* Top bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "1.5rem",
          }}>
            <div>
              <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
                Portal Anggota KONI
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>
                {menuItems.find(m => m.id === active)?.label}
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", width: 32, height: 32,
              borderRadius: 8, cursor: "pointer", fontSize: 14,
            }}>✕</button>
          </div>

          {renderContent()}
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpModal { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
