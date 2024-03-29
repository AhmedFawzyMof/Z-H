const express = require("express");
const app = express();
require("dotenv").config();
const compression = require("compression");
//* express use {
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/favicon.ico", express.static("public/img/favicon.ico"));
//* }


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors(corsOptions));
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);
//? }
//!const routes {
const IndexRoute = require("./routes/index.router");
//! }

//? use route {
app.use("/", IndexRoute);
//? }

app.listen(3000);
