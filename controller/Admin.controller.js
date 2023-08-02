const db = require("../db/index");
const resultsPerPage = 25;
const controller = {
  //! GET {
  getProducut: (req, res) => {
    const token = req.params.admin;
    db.query(
      "SELECT Admin,id FROM Users WHERE id=?",
      [token],
      (err, result) => {
        if (err) throw err;
        const userId = result[0].id;
        if (result[0].Admin === 1) {
          db.query("SELECT * FROM Products", (err, result) => {
            if (err) throw err;
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if (page > numberOfPages) {
              res.redirect(
                "/admin/panle/products/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent(numberOfPages)
              );
            } else if (page < 1) {
              res.redirect(
                "/admin/panle/products/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent("1")
              );
            }
            const startingLimit = (page - 1) * resultsPerPage;
            const sql = `SELECT * FROM Products LIMIT ${startingLimit},${resultsPerPage}; SELECT name FROM Categories; SELECT name FROM Componies;`;
            db.query(sql, (err, result) => {
              if (err) throw err;
              let iterator = page - 5 < 1 ? 1 : page - 5;
              let endingLink =
                iterator + 9 < numberOfPages
                  ? iterator + 9
                  : page + (numberOfPages - page);

              if (endingLink < page + 4) {
                iterator -= page + 4 - numberOfPages;
              }
              res.render("admin/products", {
                products: result[0],
                categories: result[1],
                componies: result[2],
                page,
                iterator,
                endingLink,
                numberOfPages,
                userId,
              });
            });
          });
        } else {
          res.redirect("/");
        }
      }
    );
  },
  getOrders: (req, res) => {
    const token = req.params.admin;
    db.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?",
      [token],
      (err, result) => {
        if (err) throw err;
        const userId = result[0].id;
        if (result[0].Admin === 1) {
          db.query("SELECT * FROM TheOrders", (err, result) => {
            if (err) throw err;
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if (page > numberOfPages) {
              res.redirect(
                "/admin/panle/orders/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent(numberOfPages)
              );
            } else if (page < 1) {
              res.redirect(
                "/admin/panle/orders/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent("1")
              );
            }
            const startingLimit = (page - 1) * resultsPerPage;
            const sql = `SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ${startingLimit},${resultsPerPage}`;
            db.query(sql, (err, result) => {
              if (err) throw err;
              let iterator = page - 5 < 1 ? 1 : page - 5;
              let endingLink =
                iterator + 9 < numberOfPages
                  ? iterator + 9
                  : page + (numberOfPages - page);

              if (endingLink < page + 4) {
                iterator -= page + 4 - numberOfPages;
              }
              res.render("admin/orders", {
                orders: result,
                page,
                iterator,
                endingLink,
                numberOfPages,
                userId,
              });
            });
          });
        } else if (result[0].Stuff === 1) {
          db.query("SELECT * FROM TheOrders", (err, result) => {
            if (err) throw err;
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if (page > numberOfPages) {
              res.redirect(
                "/admin/panle/orders/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent(numberOfPages)
              );
            } else if (page < 1) {
              res.redirect(
                "/admin/panle/orders/" +
                  userId +
                  "/?page=" +
                  encodeURIComponent("1")
              );
            }
            const startingLimit = (page - 1) * resultsPerPage;
            const sql = `SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ${startingLimit},${resultsPerPage}`;
            db.query(sql, (err, result) => {
              if (err) throw err;
              let iterator = page - 5 < 1 ? 1 : page - 5;
              let endingLink =
                iterator + 9 < numberOfPages
                  ? iterator + 9
                  : page + (numberOfPages - page);

              if (endingLink < page + 4) {
                iterator -= page + 4 - numberOfPages;
              }
              res.render("admin/orders", {
                orders: result,
                page,
                iterator,
                endingLink,
                numberOfPages,
                userId,
              });
            });
          });
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
            "SELECT `TheOrders`.id, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.username FROM `TheOrders` INNER JOIN Users ON `TheOrders`.user = Users.id WHERE `TheOrders`.`id` = ?",
            [order],
            (err, result) => {
              if (err) throw err;
              res.render("admin/orders/id", { order: result[0] });
            }
          );
        } else if (result[0].Stuff === 1) {
          db.query(
            "SELECT `TheOrders`.id, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.username FROM `TheOrders` INNER JOIN Users ON `TheOrders`.user = Users.id WHERE `TheOrders`.`id` = ?",
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
        "SELECT `TheOrders`.`id`, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.`email` FROM `TheOrders` INNER JOIN `Users` ON `TheOrders`.`user` = `Users`.`id` WHERE `TheOrders`.`id` LIKE ?",
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
                      <p>شارع: <%=order.addrSt%></p>
                      <p>عماره: <%=order.addrB%></p>
                      <p>طابق: <%=order.addrF%></p>
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
      "DELETE FROM `TheOrders` WHERE `TheOrders`.`id` = ?",
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
