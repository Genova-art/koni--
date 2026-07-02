require("dotenv").config();

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const sequelize = require("./config/db");
require("./models/User"); // Daftarkan model User

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running 🚀",
  });
});

// Sinkronisasi database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database Connected & Tables Synced");
  })
  .catch((err) => {
    console.error("❌ Database Error:", err);
  });

module.exports = app;
module.exports.handler = serverless(app);
