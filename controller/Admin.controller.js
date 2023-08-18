const db = require("../db/index");
const resultsPerPage = 25;
const promisePool = db.promise();
const controller = {
  //! GET {
  getProducut: async (req, res) => {
    const token = req.params.admin;

    const [rows, fields] = await promisePool.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?",
      [token]
    );
    const userId = rows[0].id;

    if (rows[0].Admin === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM Products");
      const numOfResults = rows.length;
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
          "/admin/panle/orders/" + userId + "/?page=" + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      const [sql, fields1] = await promisePool.query(
        "SELECT * FROM Products LIMIT ?,?",
        [startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/orders", {
        orders: sql,
        page,
        iterator,
        endingLink,
        numberOfPages,
        userId,
      });
    } else if (rows[0].Stuff === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM TheOrders");
      const numOfResults = rows.length;
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
          "/admin/panle/orders/" + userId + "/?page=" + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      const [sql, fields1] = await promisePool.query(
        "SELECT * FROM Products LIMIT ?,?",
        [startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/orders", {
        orders: sql,
        page,
        iterator,
        endingLink,
        numberOfPages,
        userId,
      });
    } else {
      res.redirect("/");
    }
  },
  getOrders: async (req, res) => {
    const token = req.params.admin;
    const [rows, fields] = await promisePool.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?",
      [token]
    );
    const userId = rows[0].id;

    if (rows[0].Admin === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM TheOrders");
      const numOfResults = rows.length;
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
          "/admin/panle/orders/" + userId + "/?page=" + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      const [sql, fields1] = await promisePool.query(
        "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ?,?",
        [startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/orders", {
        orders: sql,
        page,
        iterator,
        endingLink,
        numberOfPages,
        userId,
      });
    } else if (rows[0].Stuff === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM TheOrders");
      const numOfResults = rows.length;
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
          "/admin/panle/orders/" + userId + "/?page=" + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      const [sql, fields1] = await promisePool.query(
        "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ?,?",
        [startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/orders", {
        orders: sql,
        page,
        iterator,
        endingLink,
        numberOfPages,
        userId,
      });
    } else {
      res.redirect("/");
    }
  },
  getCategory: async (req, res) => {
    const token = req.params.admin;

    const [rows, fields] = await promisePool.query(
      "SELECT Admin FROM Users WHERE id=?",
      [token]
    );

    if (rows[0].Admin == 1) {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM Categories"
      );
      res.render("admin/category", { category: rows });
    } else {
      res.redirect("/");
    }
  },
  getSubCategory: async (req, res) => {
    const token = req.params.admin;

    const [rows, fields] = await promisePool.query(
      "SELECT Admin FROM Users WHERE id=?",
      [token]
    );
    if (rows[0].Admin == 1) {
      const [rows, fields] = await promisePool.query(
        "SELECT Admin FROM Users WHERE id=?",
        [token]
      );
      res.render("admin/subcategory", {
        subcategory: rows,
      });
    } else {
      res.redirect("/");
    }
  },
  getOffer: async (req, res) => {
    const token = req.params.admin;
    const [rows, fields] = await promisePool.query(
      "SELECT Admin FROM Users WHERE id=?",
      [token]
    );
    if (rows[0].Admin == 1) {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM `Offer`;SELECT * FROM Componies"
      );
      res.render("admin/offer", {
        offer: rows[0],
        componies: rows[1],
      });
    } else {
      res.redirect("/");
    }
  },
  getUser: async (req, res) => {
    const token = req.params.admin;
    const [rows, fields] = await promisePool.query(
      "SELECT Admin,id FROM Users WHERE id=?",
      [token]
    );
    const userId = rows[0].id;

    if (rows[0].Admin === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM Users");
      const numOfResults = rows.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      if (page > numberOfPages) {
        res.redirect(
          "/admin/panle/users/" +
            userId +
            "/?page=" +
            encodeURIComponent(numberOfPages)
        );
      } else if (page < 1) {
        res.redirect(
          "/admin/panle/users/" + userId + "/?page=" + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      const [limit, fieldss] = await promisePool.query(
        "SELECT * FROM Users LIMIT ?,?",
        [startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/users", {
        users: limit,
        page,
        iterator,
        endingLink,
        numberOfPages,
        userId,
      });
    } else {
      res.redirect("/");
    }
  },
  getContactUs: async (req, res) => {
    const token = req.params.admin;
    const [user, fields] = await promisePool.query(
      "SELECT Admin FROM Users WHERE id=?",
      [token]
    );
    if (user[0].Admin === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM Contact", [
        token,
      ]);

      res.render("admin/contactus", { users: rows });
    } else {
      res.redirect("/");
    }
  },
  getAdmin: async (req, res) => {
    const token = req.params.admin;

    const [rows1, fields] = await promisePool.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?;",
      [token]
    );
    const [rows2, fields2] = await promisePool.query(
      "SELECT COUNT(*) as 'OrdersLen' FROM `TheOrders` WHERE delivered = 0;"
    );
    const [rows3, fields3] = await promisePool.query(
      "SELECT COUNT(*) as 'ContactLen' FROM `Contact` WHERE seen = 0;"
    );
    const row1 = rows1[0];
    const row2 = rows2[0];
    const row3 = rows3[0];

    if (row1.Admin == 1) {
      res.render("admin/index.ejs", {
        orderslen: row2.OrdersLen,
        contactlen: row3.ContactLen,
      });
    } else if (row1.Stuff == 1) {
      res.redirect("/admin/panle/orders/" + row1.id);
    } else {
      res.redirect("/");
    }
  },
  orderPage: async (req, res) => {
    const { admin, order } = req.params;
    const [user, fields] = await promisePool.query(
      "SELECT Admin,Stuff FROM Users WHERE id=?",
      [admin]
    );
    if (user[0].Admin === 1) {
      const [orders, fields] = await promisePool.query(
        "SELECT `TheOrders`.id, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.username FROM `TheOrders` INNER JOIN Users ON `TheOrders`.user = Users.id WHERE `TheOrders`.`id` = ?",
        [order]
      );
      res.render("admin/orders/id", { order: orders[0] });
    } else if (user[0].Stuff === 1) {
      const [orders, fields] = await promisePool.query(
        "SELECT `TheOrders`.id, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.username FROM `TheOrders` INNER JOIN Users ON `TheOrders`.user = Users.id WHERE `TheOrders`.`id` = ?",
        [order]
      );
      res.render("admin/orders/id", { order: orders[0] });
    } else {
      res.redirect("/");
    }
  },
  //! }
  //! SEARCH {
  searchUsers: async (req, res) => {
    const Searchquery = req.body.searchUser;
    if (Searchquery !== "") {
      const search = "%" + Searchquery + "%";
      const [rows, fields] = await promisePool.query(
        `SELECT * FROM Users WHERE email LIKE ?`,
        [search]
      );
      function manger(user) {
        if (user.Admin === 1) {
          return `نعم`;
        } else {
          return `لا`;
        }
      }
      const mappedItems = rows
        .map((user, index) => {
          return `
                  <div class="userRec" key=${index}>
                    <form action='/delete/user' method='post'>
                      <input type='hidden' name='userid' value='${user.id}'/>
                      <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                    </form>
                    <p>معرف المستخدم: ${user.id.substr(24, 25)}</p>
                    <p>اسم المستخدم: ${user.username}</p>
                    <div class='manger'>المستخدم مدير: ${manger(user)} 
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
  },
  searchProduct: async (req, res) => {
    const Searchquery = req.body.searchProduct;

    const search = "%" + Searchquery + "%";

    const [products, fields] = await promisePool.query(
      `SELECT * FROM Products WHERE name LIKE ?`,
      [search]
    );

    const [categories, fields1] = await promisePool.query(
      "SELECT * FROM Categories"
    );

    const [componies, fields2] = await promisePool.query(
      "SELECT name FROM Componies"
    );

    let componiesOpt = ``;
    componies.forEach((compony) => {
      componiesOpt += `<option value="${compony.name}">${compony.name}</option>`;
    });

    let categoriesOpt = ``;
    categories.forEach((category) => {
      categoriesOpt += `<option value="${category.name}">${category.name}</option>`;
    });

    const available = () => {
      if (products[0].available) {
        return "نعم";
      } else {
        return "ﻻ";
      }
    };

    let Product = ``;

    products.forEach((product) => {
      Product += `<div class="product">
        <form action="/delete/product" method="post" id="delete">
          <input type="hidden" name="productid" value="${product.id}" />
          <button class="delete" type="submit">
            <i class="bx bx-trash"></i>
          </button>
        </form>
        <p>${product.id}</p>
        <p>اسم :${product.name}</p>
        <p>الوصف :${product.description}</p>
        <p>السعر :${product.price}</p>
        <form action="/edit/product" method="post" id="edit">
          <input type="hidden" name="productid" value="${product.id}" />
          <input type="number" name="price" required placeholder="السعر" />
          <button class="delete" type="submit">تأكيد</button>
        </form>
        <div>
          <p>شركة :${product.compony}</p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="compony" required>
              <option value="${product.compony}" selected disabled>
                ${product.compony}
              </option>
              ${componiesOpt}
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
          <p>فئة :${product.category}</p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="cate" required>
              <option value="${product.category}" selected disabled>
                ${product.category}
              </option>
              ${categoriesOpt}
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
          <p>
            متاح : ${available()}
          </p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="available" required>
              <option value="1">نعم</option>
              <option value="0">لا</option>
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
        </div>
        <img src="${product.image}" />
      </div>`;
    });
    res.json({
      data: Product,
    });
  },
  searchOrders: async (req, res) => {
    const Searchquery = req.body.searchUser;

    if (Searchquery !== "") {
      const search = "%" + `${Searchquery}` + "%";
      const [rows, fields] = await promisePool.query(
        "SELECT `TheOrders`.`id`, `TheOrders`.`user`, `TheOrders`.`addrSt`, `TheOrders`.`addrB`, `TheOrders`.`addrF`,`TheOrders`.`phone`, `TheOrders`.`spare_phone`, `TheOrders`.`delivered`, `TheOrders`.`paid`, `TheOrders`.`total`, `TheOrders`.`date`, `TheOrders`.`cart`, `Users`.`email` FROM `TheOrders` INNER JOIN `Users` ON `TheOrders`.`user` = `Users`.`id` WHERE `TheOrders`.`id` LIKE ?",
        [search]
      );

      console.log(rows[0].cart);

      const mappedItems = rows
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
          order.cart.forEach((item) => {
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
                      <p>شارع: ${order.addrSt}</p>
                      <p>عماره: ${order.addrB}</p>
                      <p>طابق: ${order.addrF}</p>
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
  },
  filterProduct: async (req, res) => {
    const compony = req.body.compony;
    const [componies, fields1] = await promisePool.query(
      "SELECT name FROM Componies"
    );

    const [categories, fields2] = await promisePool.query(
      "SELECT * FROM Categories"
    );

    const [products, fields3] = await promisePool.query(
      "SELECT * FROM `Products` WHERE compony = ?",
      [compony]
    );

    let componiesOpt = ``;

    componies.forEach((compony) => {
      componiesOpt += `<option value="${compony.name}">${compony.name}</option>`;
    });

    let categoriesOpt = ``;

    categories.forEach((category) => {
      categoriesOpt += `<option value="${category.name}">${category.name}</option>`;
    });

    let Product = ``;

    products.forEach((product) => {
      Product += ` <div class="product">
        <form action="/delete/product" method="post" id="delete">
          <input type="hidden" name="productid" value="${product.id}" />
          <button class="delete" type="submit">
            <i class="bx bx-trash"></i>
          </button>
        </form>
        <p>${product.id}</p>
        <p>اسم :${product.name}</p>
        <p>الوصف :${product.description}</p>
        <p>السعر :${product.price}</p>
        <form action="/edit/product" method="post" id="edit">
          <input type="hidden" name="productid" value="${product.id}" />
          <input type="number" name="price" required placeholder="السعر" />
          <button class="delete" type="submit">تأكيد</button>
        </form>
        <div>
          <p>شركة :${product.compony}</p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="compony" required>
              <option value="${product.compony}" selected disabled>
                ${product.compony}
              </option>
              ${componiesOpt}            
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
          <p>فئة :${product.category}</p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="cate" required>
              <option value="${product.category}" selected disabled>
                ${product.category}
              </option>
              ${categoriesOpt}
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
          <p>
            متاح : 
          </p>
          <form action="/edit/product" method="post" id="edit">
            <input type="hidden" name="productid" value="${product.id}" />
            <select name="available" required>
              <option value="1">نعم</option>
              <option value="0">لا</option>
            </select>
            <button class="delete" type="submit">تأكيد</button>
          </form>
        </div>
        <img src="${product.image}" />
      </div>`;
    });

    res.json({
      products: Product,
    });
  },
  //!}
  //! DELETE {
  deleteUser: async (req, res) => {
    const id = req.body.userid;
    const [rows, fields] = promisePool.query(
      "DELETE FROM `Users` WHERE `Users`.`id` = ?",
      [id]
    );
    res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
  },
  deleteProduct: async (req, res) => {
    const id = req.body.productid;
    const [rows, fields] = await promisePool.query(
      "DELETE FROM `Products` WHERE `Products`.`id` = ?",
      [id]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload();
    </script>`);
  },
  deleteCategory: async (req, res) => {
    const id = req.body.categoryid;
    const [rows, fields] = await promisePool.query(
      "DELETE FROM `Categories` WHERE `Categories`.`id` = ?",
      [id]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  deleteSubcategory: async (req, res) => {
    const id = req.body.subcategoryid;
    const [rows, fields] = await promisePool.query(
      "DELETE FROM `Componies` WHERE `Componies`.`id` = ?",
      [id]
    );

    res.send(`
        <script>
          window.history.back();
          location.reload()
        </script>`);
  },
  deleteOrder: async (req, res) => {
    const id = req.body.orderid;
    const [rows, fields] = await promisePool.query(
      "DELETE FROM `TheOrders` WHERE `TheOrders`.`id` = ?",
      [id]
    );

    res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
  },
  deleteOffer: async (req, res) => {
    const id = req.body.id;

    const [rows, fields] = await promisePool.query(
      "DELETE FROM `Offer` WHERE `Offer`.`id` = ?",
      [id]
    );
    res.send(`
        <script>
          window.history.back();
          location.reload();
        </script>`);
  },
  seen: async (req, res) => {
    const { seen, id } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE `Contact` SET `seen`=? WHERE id=?",
      [seen, id]
    );

    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  //! }
};

module.exports = controller;
