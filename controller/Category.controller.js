const db = require("../db/index");
// const fs = require("fs");
const os = require("os-utils");
const promisePool = db.promise();

const controller = {
  addOne: async (req, res) => {
    const { name } = req.body;
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `Categories` (`name`) VALUES (?)",
      [name]
    );

    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  getProducts: async (req, res) => {
    const compony = req.params.subcategory;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Products` WHERE compony = ?;",
      [compony]
    );
    switch (rows.length) {
      case 0:
        res.render("Product", {
          products: [],
          subcate: compony,
        });
        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
        break;
      default:
        res.render("Product", {
          products: rows,
          subcate: compony,
        });
        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
        break;
    }
  },
  getProductsByCate: async (req, res) => {
    const { compony, category } = req.body;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Products` WHERE (compony, category) = (?, ?); SELECT * FROM `Categories`",
      [compony, category]
    );
    let products = [];
    let categories = [];
    switch (rows[0].length) {
      case 0:
        categories = rows[1];
        res.render("Product", {
          products: products,
          subcate: compony,
          categories: categories,
        });

        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
        break;
      default:
        products = rows[0];
        categories = rows[1];
        res.render("Product", {
          products: products,
          subcate: compony,
          categories: categories,
        });

        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
        break;
    }
  },
  getAll: async (req, res) => {
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Componies` ORDER BY na DESC;SELECT * FROM `Offer`;SELECT name FROM Categories;"
    );
    const companies = rows[0];
    const categories = rows[2];
    const offers = rows[1];

    res.render("index", {
      categories: categories,
      category: companies,
      offers: offers,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  editCategory: async (req, res) => {
    const { categoryid, name } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE `category` SET  `name_ar` = ? WHERE `category`.`id` = ?",
      [name, categoryid]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  getCategory: async (req, res) => {
    const category = req.body.category;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Products` WHERE category = ?;SELECT * FROM `Offer`;SELECT name FROM Categories;",
      [category]
    );
    const products = rows[0];
    const categories = rows[2];
    const offers = rows[1];

    res.render("category", {
      categories: categories,
      category: products,
      offers: offers,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
};

module.exports = controller;
