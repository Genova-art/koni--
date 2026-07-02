require("dotenv").config();
const { Sequelize } = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:080605@localhost:5432/2403040052_db";

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

module.exports = sequelize;
