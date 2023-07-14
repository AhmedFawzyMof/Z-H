const db = require("../db/index");

const controller = {
  //! GET {
  getProducut: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query(
          "SELECT name_ar FROM category; SELECT name_ar FROM subcategory",
          (err, result) => {
            if (err) throw err;
            res.render("admin/products", {
              category: result[0],
              subcategory: result[1],
            });
          }
        );
      } else {
        res.redirect("/");
      }
    });
  },
  getOrders: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query("SELECT * FROM `Order` LIMIT 0,50", (err, result) => {
          if (err) throw err;
          res.render("admin/orders", { orders: result });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getCategory: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query("SELECT * FROM category", (err, result) => {
          if (err) throw err;
          res.render("admin/category", { category: result });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getSubCategory: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query(
          "SELECT * FROM subcategory; SELECT name_ar FROM category",
          (err, result) => {
            if (err) throw err;
            res.render("admin/subcategory", {
              subcategory: result[0],
              category: result[1],
            });
          }
        );
      } else {
        res.redirect("/");
      }
    });
  },
  getPromocode: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query(" SELECT * FROM `promocode`", (err, result) => {
          if (err) throw err;
          res.render("admin/promo", {
            Promocode: result,
          });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getOffer: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query("SELECT * FROM `offer`", (err, result) => {
          if (err) throw err;
          res.render("admin/offer", {
            offer: result,
          });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getUser: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query("SELECT * FROM Users", (err, result) => {
          if (err) throw err;
          res.render("admin/users", { users: result });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getAdmin: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        res.render("admin");
      } else {
        res.redirect("/");
      }
    });
  },
  //! }
  //! SEARCH {
  searchUsers: (req, res) => {
    const Searchquery = req.body.searchUser;
    if (Searchquery !== "") {
      db.query(
        `SELECT * FROM Users WHERE email LIKE '%${Searchquery}%'`,
        (err, result) => {
          if (err) throw err;
          res.json({
            data: result,
          });
        }
      );
    }
  },
  searchProduct: (req, res) => {
    const Searchquery = req.body.searchProducts;
    console.log(req.body);
    db.query(
      `SELECT * FROM product WHERE name_ar LIKE '%${Searchquery}%'`,
      (err, result) => {
        if (err) throw err;
        res.json({
          data: result,
        });
      }
    );
  },
  searchOrders: (req, res) => {
    const Searchquery = req.body.searchUser;
    db.query(
      `SELECT * FROM orders WHERE id OR users LIKE '%${Searchquery}%' LIMIT 0,50`,
      (err, result) => {
        if (err) throw err;
        res.json({
          data: result,
        });
      }
    );
  },
  //!}
  //! DELETE {
  deleteUser: (req, res) => {
    const id = req.body.userid;
    db.query(
      "DELETE FROM `users` WHERE `users`.`id` = ?",
      [id],
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
  deleteProduct: (req, res) => {
    const id = req.body.productid;
    db.query(
      "DELETE FROM `product` WHERE `product`.`id` = ?",
      [id],
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
  deleteCategory: (req, res) => {
    const id = req.body.categoryid;
    db.query(
      "DELETE FROM `category` WHERE `category`.`id` = ?",
      [id],
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
  deleteSubcategory: (req, res) => {
    const id = req.body.subcategoryid;
    db.query(
      "DELETE FROM `subcategory` WHERE `subcategory`.`id` = ?",
      [id],
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
  deleteOrder: (req, res) => {
    const id = req.body.orderid;
    db.query(
      "DELETE FROM `orders` WHERE `orders`.`id` = ?",
      [id],
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
  deleteOffer: (req, res) => {
    const id = req.body.id;
    db.query(
      "DELETE FROM `offer` WHERE `offer`.`id` = ?",
      [id],
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
  deletePromo: (req, res) => {
    const id = req.body.id;
    db.query(
      "DELETE FROM `promocode` WHERE `promocode`.`id` = ?",
      [id],
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
  //! }
};

module.exports = controller;
