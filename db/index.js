const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.HOSTDB,
  user: process.env.USERNAME,
  password: process.env.PASSDB,
  database: process.env.THEDB,
  insecureAuth: true,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  // ssl: "Amazon RDS",
});

console.log(process.env.HOSTDB);
console.log(process.env.USERNAME);
console.log(process.env.PASSDB);
console.log(process.env.THEDB);

module.exports = connection;
