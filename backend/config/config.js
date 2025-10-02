const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,   // database name
  process.env.PG_USER,       // username
  process.env.PG_PASSWORD,   // password
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
