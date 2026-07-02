require("dotenv").config();
const { Sequelize } = require("sequelize");

// Pastikan kita tahu persis apa isi DATABASE_URL saat runtime di Vercel
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  console.error(
    "Kritis: DATABASE_URL tidak terdeteksi di lingkungan produksi/Vercel!",
  );
}

const connectionString =
  databaseUrl || "postgresql://postgres:080605@localhost:5432/2403040052_db";

// Inisialisasi menggunakan opsi dialek yang aman untuk cloud database (seperti Supabase/Neon/Render)
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false, // Diperlukan untuk kebanyakan cloud database di Vercel
          }
        : false,
  },
});

module.exports = sequelize;
