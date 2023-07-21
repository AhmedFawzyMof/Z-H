const db = require("../db/index");
const fs = require("fs");

const controller = {
  addOne: (req, res) => {
    const { name_ar, imageName, image } = req.body;

    fs.writeFile(
      `public/img/category/${imageName}`,
      image.split("base64,")[1],
      { encoding: "base64" },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(`${imageName} is created`);
        }
      }
    );
    const imageUrl = `/img/category/${imageName}`;
    db.query(
      "INSERT INTO `category` ( `image`, `name_ar`) VALUES ( ?, ?)",
      [imageUrl, name_ar],
      (err, result) => {
        if (err) throw err;
        res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
      }
    );
  },
  getProducts: (req, res) => {
    const subcategory = req.params.subcategory;
    db.query(
      "SELECT * FROM `Products` WHERE compony = ?; SELECT * FROM `Categories`",
      [subcategory],
      (err, result) => {
        if (err) throw err;
        if (result[0].length > 0) {
          res.render("Product", {
            products: result[0],
            subcate: subcategory,
            categories: result[1],
          });
        } else {
          res.render("Product", {
            products: [],
            subcate: subcategory,
            categories: result[1],
          });
        }
      }
    );
  },
  getProductsByCate: (req, res) => {
    const { compony, category } = req.body;
    db.query(
      "SELECT * FROM `Products` WHERE (compony, category) = (?, ?); SELECT * FROM `Categories`",
      [compony, category],
      (err, result) => {
        if (err) throw err;
        if (result[0].length > 0) {
          res.render("Product", {
            products: result[0],
            subcate: compony,
            categories: result[1],
          });
        } else {
          res.render("Product", {
            products: [],
            subcate: compony,
            categories: result[1],
          });
        }
      }
    );
  },
  getAll: (req, res) => {
    db.query(
      "SELECT * FROM `Componies`;SELECT * FROM `Offer`;SELECT * FROM Categories",
      (err, result) => {
        if (err) throw err;
        res.render("index", {
          categories: result[2],
          category: result[0],
          offers: result[1],
        });
      }
    );
  },
  editCategory: (req, res) => {
    const { categoryid, name } = req.body;
    console.log(req.body);
    db.query(
      "UPDATE `category` SET  `name_ar` = ? WHERE `category`.`id` = ?",
      [name, categoryid],
      (err, result) => {
        if (err) throw err;
        res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
      }
    );
  },
  getCategory: (req, res) => {
    const category = req.body.category;
    db.query(
      "SELECT * FROM `Products` WHERE category = ?;SELECT * FROM `Offer`;SELECT * FROM Categories",
      [category],
      (err, result) => {
        if (err) throw err;
        res.render("category", {
          categories: result[2],
          category: result[0],
          offers: result[1],
        });
      }
    );
  },
};

module.exports = controller;
