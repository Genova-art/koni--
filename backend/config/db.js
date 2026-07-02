require("dotenv").config();
const { Sequelize } = require("sequelize");

// Ambil URL database dari env
const databaseUrl = process.env.DATABASE_URL;

// Buat fallback yang aman. Jika di Vercel kosong, berikan string kosong agar Sequelize memberikan error yang jelas, bukan crash null.
const connectionString =
  databaseUrl || "postgresql://postgres:080605@localhost:5432/2403040052_db";

if (!databaseUrl) {
  console.warn(
    "Peringatan: process.env.DATABASE_URL tidak terbaca. Menggunakan database lokal.",
  );
}

// Inisialisasi Sequelize
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      databaseUrl &&
      (databaseUrl.includes("supabase") || databaseUrl.includes("pooler"))
        ? {
            require: true,
            rejectUnauthorized: false, // Wajib untuk cloud DB seperti Supabase agar tidak ditolak SSL-nya
          }
        : false,
  },
});

module.exports = sequelize;
