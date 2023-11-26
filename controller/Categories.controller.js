const db = require("../db/index");
const fs = require("fs");
const os = require("os-utils");
const promisePool = db.promise();

const controller = {
  AddCategory: async (req, res) => {
    const { name } = req.body;
    const [_, __] = await promisePool.query(
      "INSERT INTO `Categories` (`name`) VALUES (?)",
      [name]
    );

    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  GetProducts: async (req, res) => {
    const compony = req.params.subcategory;

    const [Products, _] = await promisePool.query(
      "SELECT * FROM `Products` WHERE compony = ? ORDER BY available DESC",
      [compony]
    );
    res.render("Product", {
      products: Products,
      subcate: compony,
    });
  },
  GetProductsByCategory: async (req, res) => {
    const { compony, category } = req.body;
    const [Products, _] = await promisePool.query(
      "SELECT * FROM `Products` WHERE (compony, category) = (?, ?) ORDER BY available DESC; SELECT * FROM `Categories`",
      [compony, category]
    );
    res.render("Product", {
      products: Products[0],
      subcate: compony,
      categories: Products[1],
    });
  },
  GetAllCompanies: async (req, res) => {
    const [rows, _] = await promisePool.query(
      "SELECT * FROM `Componies` ORDER BY ranking DESC;SELECT * FROM `Offer`;SELECT name FROM Categories;"
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
  EditCategories: async (req, res) => {
    const { categoryid, name } = req.body;
    const [_, __] = await promisePool.query(
      "UPDATE `category` SET  `name_ar` = ? WHERE `category`.`id` = ?",
      [name, categoryid]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  GetCategories: async (req, res) => {
    const category = req.body.category;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Products` WHERE category = ? ORDER BY available DESC;SELECT * FROM `Offer`;SELECT name FROM Categories;",
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
