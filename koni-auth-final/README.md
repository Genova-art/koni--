# 🏆 Website KONI Pusat

Website resmi Komite Olahraga Nasional Indonesia — dibangun dengan React 18 + Vite.

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v16+
- PostgreSQL (untuk backend)

### 1. Jalankan Backend dulu

```bash
cd backend
npm install
```

Salin file konfigurasi:
```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi database & email kamu, lalu:

```bash
node create-db.js    # Buat database
node seed.js         # Isi data awal (admin, atlet, official)
npm start            # Jalankan server di port 5000
```

**Akun default setelah seed:**
| Email | Password | Role |
|-------|----------|------|
| admin@koni.or.id | AdminKoni2026! | Admin |
| atlet@koni.or.id | Koni2026! | Atlet |
| official@koni.or.id | Koni2026! | Official |

### 2. Jalankan Frontend

```bash
cd koni-auth-final
npm install
npm run dev
```

Buka browser: http://localhost:5173

## ✨ Fitur Utama

- 🔐 Autentikasi lengkap (Login, Register, Verifikasi Email, Reset Password)
- 🤖 AI Chatbot KONI (fallback FAQ tersedia tanpa API key)
- 📊 Visualisasi data: Grafik, HeatMap, Bar Race Chart, Podium 3D
- 🗺️ Peta Indonesia interaktif
- 🎮 Gamifikasi: Kuis, Spin Wheel, Leaderboard, Badge
- 📱 PWA — bisa diinstal & akses offline
- 🌐 Multi bahasa, Dark/Light mode, Responsive

## 🛠️ Teknologi

| Frontend | Backend |
|----------|---------|
| React 18 + Vite | Node.js + Express |
| Context API | Sequelize + PostgreSQL |
| Recharts | JWT Auth |
| Lucide React | Nodemailer |
| PWA / Service Worker | Bcryptjs |

## 📁 Struktur Project

```
koni-auth-final/     ← Frontend React
├── src/
│   ├── components/  ← 55+ komponen
│   ├── context/     ← Auth, Theme, Toast, Bookmark
│   ├── services/    ← API & Auth service
│   └── data/        ← Data konstanta
├── public/
│   ├── images/      ← Gambar hero lokal
│   ├── sw.js        ← Service Worker PWA
│   └── manifest.json

backend/             ← Backend Express
├── controllers/     ← Logic autentikasi & user
├── models/          ← Sequelize model
├── routes/          ← Route API
├── middleware/       ← JWT auth middleware
└── utils/           ← JWT, hash, email helper
```
