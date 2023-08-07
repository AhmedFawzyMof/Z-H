const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "database-1.cnf0bsmcldvz.eu-central-1.rds.amazonaws.com",
  user: "ahmedfawzi",
  password: "Ahmedfawzi20",
  database: "zhmarket",
  insecureAuth: true,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  ssl: "Amazon RDS",
});

module.exports = connection;
