const db = require("../db/index");
const fs = require("fs");
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
        break;
      default:
        res.render("Product", {
          products: rows,
          subcate: compony,
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
        break;
      default:
        products = rows[0];
        categories = rows[1];
        res.render("Product", {
          products: products,
          subcate: compony,
          categories: categories,
        });
        break;
    }
  },
  getAll: async (req, res) => {
    const [rows, fields] = await promisePool.query(
      "SELECT name,image,soon FROM `Componies` ORDER BY soon ASC;SELECT * FROM `Offer`;SELECT name FROM Categories;"
    );
    const companies = rows[0];
    const categories = rows[2];
    const offers = rows[1];

    res.render("index", {
      categories: categories,
      category: companies,
      offers: offers,
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
  },
};

module.exports = controller;
