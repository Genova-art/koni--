require("dotenv").config();
const { Sequelize } = require("sequelize");

// Ambil URL database dari env
const databaseUrl = process.env.DATABASE_URL;

// Buat connection string cadangan yang aman untuk lokal
const fallbackUrl = "postgresql://postgres:080605@localhost:5432/2403040052_db";

// Tentukan string mana yang akan dipakai
const targetConnectionString = databaseUrl || fallbackUrl;

let sequelize;

// Menggunakan teknik penanganan eror instansiasi agar Sequelize tidak crash null ('replace')
try {
  if (databaseUrl) {
    // Jika di cloud/Vercel (Membaca langsung dari string URL)
    sequelize = new Sequelize(targetConnectionString, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Wajib untuk cloud DB seperti Supabase agar tidak ditolak SSL-nya
        },
      },
    });
  } else {
    // Jika di lokal (Menggunakan parameter terpisah agar Sequelize 100% aman dari error parsing string kosong)
    console.warn(
      "Peringatan: process.env.DATABASE_URL tidak terbaca di server. Menggunakan database lokal.",
    );
    sequelize = new Sequelize("2403040052_db", "postgres", "080605", {
      host: "localhost",
      port: 5432,
      dialect: "postgres",
      logging: false,
    });
  }
} catch (error) {
  console.error("Gagal menginisialisasi Sequelize:", error.message);
}

module.exports = sequelize;
