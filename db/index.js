const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
  insecureAuth: true,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  // ssl: "Amazon RDS",
});

module.exports = connection;
