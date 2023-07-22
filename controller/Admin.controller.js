const db = require("../db/index");

const controller = {
  //! GET {
  getProducut: (req, res) => {
    const token = req.params.admin;
    db.query("SELECT Admin FROM Users WHERE id=?", [token], (err, result) => {
      if (err) throw err;
      if (result[0].Admin === 1) {
        db.query(
          "SELECT * FROM Products; SELECT name FROM Categories; SELECT name FROM Componies",
          (err, result) => {
            if (err) throw err;
            res.render("admin/products", {
              products: result[0],
              categories: result[1],
              componies: result[2],
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
    db.query(
      "SELECT Admin,Stuff FROM Users WHERE id=?",
      [token],
      (err, result) => {
        if (err) throw err;
        if (result[0].Admin === 1) {
          db.query(
            "SELECT `Order`.id, `Order`.`user`, `Order`.`address`, `Order`.`phone`, `Order`.`spare_phone`, `Order`.`delivered`, `Order`.`paid`, `Order`.`total`, `Order`.`date`, `Order`.`cart`, `Users`.email FROM `Order` INNER JOIN Users ON `Order`.user = Users.id ORDER BY paid, delivered ASC LIMIT 0,50",
            (err, result) => {
              if (err) throw err;
              res.render("admin/orders", { orders: result });
            }
          );
        } else if (result[0].Stuff === 1) {
          db.query(
            "SELECT `Order`.id, `Order`.`user`, `Order`.`address`, `Order`.`phone`, `Order`.`spare_phone`, `Order`.`delivered`, `Order`.`paid`, `Order`.`total`, `Order`.`date`, `Order`.`cart`, `Users`.email FROM `Order` INNER JOIN Users ON `Order`.user = Users.id ORDER BY paid, delivered ASC LIMIT 0,50",
            (err, result) => {
              if (err) throw err;
              res.render("admin/orders", { orders: result });
            }
          );
        } else {
          res.redirect("/");
        }
      }
    );
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
    db.query(
      "SELECT Admin FROM Users WHERE id=? LIMIT 0,50",
      [token],
      (err, result) => {
        if (err) throw err;
        if (result[0].Admin === 1) {
          db.query("SELECT * FROM Users", [token], (err, result) => {
            res.render("admin/users", { users: result });
          });
        } else {
          res.redirect("/");
        }
      }
    );
  },
  getAdmin: (req, res) => {
    const token = req.params.admin;
    db.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?",
      [token],
      (err, result) => {
        if (err) throw err;
        if (result[0].Admin == 1) {
          res.render("admin");
        } else if (result[0].Stuff == 1) {
          res.redirect("/admin/panle/orders/" + result[0].id);
        } else {
          res.redirect("/");
        }
      }
    );
  },
  orderPage: (req, res) => {
    const { admin, order } = req.params;
    db.query(
      "SELECT Admin,Stuff FROM Users WHERE id=?",
      [admin],
      (err, result) => {
        if (err) throw err;
        if (result[0].Admin === 1) {
          db.query(
            "SELECT `Order`.id, `Order`.`user`, `Order`.`address`, `Order`.`phone`, `Order`.`spare_phone`, `Order`.`delivered`, `Order`.`paid`, `Order`.`total`, `Order`.`date`, `Order`.`cart`, `Users`.email FROM `Order` INNER JOIN Users ON `Order`.user = Users.id WHERE `Order`.`id` = ?",
            [order],
            (err, result) => {
              if (err) throw err;
              res.render("admin/orders/id", { order: result[0] });
            }
          );
        } else if (result[0].Stuff === 1) {
          db.query(
            "SELECT `Order`.id, `Order`.`user`, `Order`.`address`, `Order`.`phone`, `Order`.`spare_phone`, `Order`.`delivered`, `Order`.`paid`, `Order`.`total`, `Order`.`date`, `Order`.`cart`, `Users`.email FROM `Order` INNER JOIN Users ON `Order`.user = Users.id WHERE `Order`.`id` = ?",
            [order],
            (err, result) => {
              if (err) throw err;
              res.render("admin/orders/id", { order: result[0] });
            }
          );
        } else {
          res.redirect("/");
        }
      }
    );
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
    if (Searchquery !== "") {
      const search = "%" + `${Searchquery}` + "%";
      db.query(
        "SELECT `Order`.`id`, `Order`.`user`, `Order`.`address`, `Order`.`phone`, `Order`.`spare_phone`, `Order`.`delivered`, `Order`.`paid`, `Order`.`total`, `Order`.`date`, `Order`.`cart`, `Users`.`email` FROM `Order` INNER JOIN `Users` ON `Order`.`user` = `Users`.`id` WHERE `Order`.`id` LIKE ?",
        [search],
        (err, result) => {
          if (err) throw err;
          console.log(JSON.parse(result[0].cart));
          const mappedItems = result
            .map((order, index) => {
              function Delivered() {
                if (order.delivered === 1) {
                  return `نعم`;
                } else {
                  return `لا`;
                }
              }
              function Paid() {
                if (order.paid === 1) {
                  return `نعم`;
                } else {
                  return `لا`;
                }
              }
              let items = "";
              JSON.parse(order.cart).forEach((item) => {
                items += ` 
                  <div class="orderitem">
                  <img src="${item.image}" alt="${item.name}" />
                  <div class="itemInfo">
                    <p>${item.name}</p>
                    <p>الكمية: ${item.quantity}</p>
                    <p>السعر: ${item.price} ج</p>
                    <p>السعر الإجمالي للطلب: ${item.price * item.quantity} ج</p>
                  </div>
                </div>
                `;
              });
              return `
                    <div class="orderRec" key=${index}>
                      <form action='/delete/order' method='post'>
                        <input type='hidden' name='orderid' value='${
                          order.id
                        }'/>
                        <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                      </form>
                      <p>معرف الطلب: ${order.id.substr(24, 25)}</p>
                      <p>تاريخ الطلب: ${order.date}</p>
                      <p>العنوان: ${order.address}</p>
                      <p>المستخدم: ${order.email}</p>
                      <p>رقم الهاتف:  ${order.phone}</p>
                      <p>هاتف احتياطي: ${order.spare_phone}</p>
                      <p>المجموع: ${order.total} ج</p>
                      ${items}
                      <div class='Delivered'>تسليم الطلب: ${Delivered()}
                        <form action='/edit/order/delivered' method='post'>
                      <input type='hidden' name='id' value='${order.id}'/>
                      <select name="isDelivered">
                        <option value="0" selected>لا</option>
                        <option value="1" >نعم</option>
                      </select>
                      <button type='submit'>تغيير</button>
                    </form>
                    </div>
                    <div class='Paid'>تم الدفع: ${Paid()}
                    <form action='/edit/order/paid' method='post'>
                        <input type='hidden' name='id' value='${order.id}'/>
                        <select name="isPaid">
                            <option value="0" selected>لا</option>
                            <option value="1" >نعم</option>
                        </select>
                        <button type='submit'>تغيير</button>
                    </form>
                    </div>
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
