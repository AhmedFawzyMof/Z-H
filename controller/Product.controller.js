const db = require("../db/index");
const fs = require("fs");
const controller = {
  addOne: (req, res) => {
    const { category, subcategory, name_ar, dis_ar, price, image } = req.body;
    // const images = "/img/product/" + name_ar + ".png";
    // let base64Image = image.split(";base64,").pop();
    // fs.writeFile(
    //   `public/img/product/${name_ar}.png`,
    //   base64Image,
    //   { encoding: "base64" },
    //   function (err) {
    //     console.log("File created");
    //   }
    // );
    db.query(
      "INSERT INTO `Products`(`name`, `description`, `category`, `compony`, `price`, `image`) VALUES ( ?, ?, ?, ?, ?, ?)",
      [name_ar, dis_ar, category, subcategory, price, image],
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
  addOffer: (req, res) => {
    const { product, image } = req.body;
    // const images = "/img/offer/" + product + ".png";
    // let base64Image = image.split(";base64,").pop();
    // fs.writeFile(
    //   `public/${images}`,
    //   base64Image,
    //   { encoding: "base64" },
    //   function (err) {
    //     console.log("File created");
    //   }
    // );
    db.query(
      "INSERT INTO `Offer` ( `product`,  `image` ) VALUES (?,?)",
      [product, image],
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
  getOne: (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM `Products` WHERE id = ?", id, (err, result) => {
      if (err) throw err;

      res.render("Product/id", {
        product: result[0],
      });
    });
  },
  getCode: (req, res) => {
    const { code, id } = req.body;
    const Id = JSON.parse(id);
    if (code !== "") {
      db.query(
        "SELECT coupons FROM `Users` WHERE id = ?",
        [Id],
        (err, result) => {
          if (err) throw err;
          const ress = JSON.parse(result[0].coupons);
          const coupon = {};
          ress.forEach((Tcode) => {
            if (Tcode.code === code.toLowerCase()) {
              Object.assign(coupon, Tcode);
            }
          });
          if (result.length > 0) {
            res.send(`
           <script>
           localStorage.setItem('disCount', '${coupon.value}')
           window.location.replace("/cart/show/items");
           </script>
           `);
          }
        }
      );
    } else {
      res.send(`
          <script>
          localStorage.setItem('disCount', '0')
          window.location.replace("/cart/show/items");
          </script>
          `);
    }
  },
  getCart: (req, res) => {
    res.render("cart.ejs");
  },
  searchProduct: (req, res) => {
    const Searchquery = req.body.search;
    db.query(
      `SELECT * FROM Products WHERE name LIKE '%${Searchquery}%'`,
      (err, result) => {
        if (err) throw err;
        res.render("Product/search", {
          SearchedProduct: result,
          search: Searchquery,
        });
      }
    );
  },
  editProduct: (req, res) => {
    const body = req.body;
    const id = req.body.productid;
    if (body.price !== undefined) {
      const price = req.body.price;
      db.query(
        "UPDATE `Products` SET `price` = ? WHERE `Products`.`id` = ?",
        [price, id],
        (err, result) => {
          if (err) throw err;
          res.send(`
      <script>
        window.history.back();
        location.reload();
      </script>`);
        }
      );
    }
    if (body.available !== undefined) {
      const available = req.body.available;
      db.query(
        "UPDATE `Products` SET `available` = ? WHERE `Products`.`id` = ?",
        [available, id],
        (err, result) => {
          if (err) throw err;
          res.send(`
      <script>
        window.history.back();
        location.reload();
      </script>`);
        }
      );
    }
  },
  editOffer: (req, res) => {
    const { id, product } = req.body;
    db.query(
      "UPDATE `Offer` SET `product` = ? WHERE `Offer`.`id` = ?",
      [image, product, id],
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
  editPromo: (req, res) => {
    const { id, code, value } = req.body;
    db.query(
      "UPDATE `PromoCode` SET `code` = ?, `value` = ? WHERE `PromoCode`.`id` = ?",
      [code, value, id],
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
