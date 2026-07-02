require("dotenv").config();

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

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

// Cek API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running 🚀",
  });
});

// Koneksi database
sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

module.exports = app;
module.exports.handler = serverless(app);
