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
      "SELECT id,image,name_ar,price FROM `product` WHERE subcategory = ?",
      [subcategory],
      (err, result) => {
        if (err) throw err;

        res.render("Product", {
          products: result,
          subcate: subcategory,
        });
      }
    );
  },
  getAll: (req, res) => {
    db.query(
      "SELECT * FROM `subcategory`; SELECT * FROM `offer`",
      (err, result) => {
        if (err) throw err;
        res.render("index", {
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
};

module.exports = controller;
