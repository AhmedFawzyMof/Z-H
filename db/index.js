const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.HOSTDB,
  user: "ahmedfawzi",
  password: process.env.PASSDB,
  database: process.env.THEDB,
  insecureAuth: true,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  ssl: "Amazon RDS",
});

module.exports = connection;
