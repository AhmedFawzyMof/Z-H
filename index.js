const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const compression = require("compression");
//* express use {
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/favicon.ico", express.static("public/img/favicon.ico"));

//* }

//? headers {

const corsOptions = {
  origin: "*",
};
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

<<<<<<< HEAD
app.listen(80);
=======
app.listen(3000);
>>>>>>> 0d56f1f (cashback page)
