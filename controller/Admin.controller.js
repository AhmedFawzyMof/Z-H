const db = require("../db/index");

const controller = {
  //! GET {
  getProducut: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin == 1) {
        db.query("SELECT * FROM Products", (err, result) => {
          if (err) throw err;
          res.render("admin/products", {
            products: result,
          });
        });
      } else {
        res.redirect("/");
      }
    });
  },
  getOrders: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin === 1) {
        db.query(
          "SELECT * FROM `Order` ORDER BY paid, delivered ASC LIMIT 0,50",
          (err, result) => {
            if (err) throw err;
            res.render("admin/orders", { orders: result });
          }
        );
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
        db.query("SELECT * FROM Categories", (err, result) => {
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
        db.query("SELECT * FROM Componies;", (err, result) => {
          if (err) throw err;
          res.render("admin/subcategory", {
            subcategory: result,
          });
        });
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
        db.query(" SELECT * FROM `PromoCode`", (err, result) => {
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
        db.query("SELECT * FROM `Offer`", (err, result) => {
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
      if (result[0].Admin === 1) {
        res.render("admin/users");
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
          const mappedItems = result
            .map((user, index) => {
              function manger() {
                if (user.Admin === 1) {
                  return `نعم`;
                } else {
                  return `لا`;
                }
              }
              return `
                      <div class="userRec" key=${index}>
                        <form action='/delete/user' method='post'>
                          <input type='hidden' name='userid' value='${
                            user.id
                          }'/>
                          <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                        </form>
                        <p>معرف المستخدم: ${user.id.substr(24, 25)}</p>
                        <p>اسم المستخدم: ${user.username}</p>
                        <div class='manger'>المستخدم مدير: ${manger()} 
                        <form action='/edit/user' method='post'>
                        <input type='hidden' name='id' value='${user.id}'/>
                        <select name="isManger">
                          <option value="0" selected>لا</option>
                          <option value="1" >نعم</option>
                        </select>
                        <button type='submit'>تغيير</button>
                      </form>
                      </div>
                        <p>البريد الالكتروني: ${user.email}</p>
                      </div>`;
            })
            .join("");
          res.json({
            data: mappedItems,
          });
        }
      );
    }
  },
  searchProduct: (req, res) => {
    const Searchquery = req.body.searchProducts;
    console.log(req.body);
    db.query(
      `SELECT * FROM Products WHERE name LIKE '%${Searchquery}%'`,
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
      `SELECT * FROM Order WHERE id OR user LIKE '%${Searchquery}%' LIMIT 0,50 ORDER BY paid, delivered ASC`,
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
      "DELETE FROM `Users` WHERE `Users`.`id` = ?",
      [id],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
      }
    );
  },
  deleteProduct: (req, res) => {
    const id = req.body.productid;
    db.query(
      "DELETE FROM `Products` WHERE `Products`.`id` = ?",
      [id],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
      }
    );
  },
  deleteCategory: (req, res) => {
    const id = req.body.categoryid;
    db.query(
      "DELETE FROM `Categories` WHERE `Categories`.`id` = ?",
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
      "DELETE FROM `Componies` WHERE `Componies`.`id` = ?",
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
      "DELETE FROM `Order` WHERE `Order`.`id` = ?",
      [id],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
      }
    );
  },
  deleteOffer: (req, res) => {
    const id = req.body.id;
    db.query(
      "DELETE FROM `Offer` WHERE `Offer`.`id` = ?",
      [id],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
      }
    );
  },
  deletePromo: (req, res) => {
    const id = req.body.id;
    db.query(
      "DELETE FROM `PromoCode` WHERE `PromoCode`.`id` = ?",
      [id],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
      }
    );
  },
  //! }
};

module.exports = controller;
