const db = require("../db/index");
const resultsPerPage = 25;
const promisePool = db.promise();

const productsdeleted = [
  {
    id: 10000,
    name: "2 جلاش السلام 500جم + سمبوسك موكي 500جم بسعر 45 بدلا من 55",
    price: 45,
    compony: "عروض التوفير",
    quantity: [1, 1],
    buingPrice: 37.38,
  },
  {
    id: 10001,
    name: "فرانكس برجر دجاج بسعر 120 بدلا من 135",
    price: 120,
    compony: "عروض التوفير",
    quantity: [1, 1],
    buingPrice: 105.84,
  },
  {
    id: 10002,
    name: "جاست فروزن كباب مشكل بسعر 170 بدلا من 185",
    price: 170,
    compony: "عروض التوفير",
    quantity: [1, 1],
    buingPrice: 173.25,
  },
  {
    id: 10003,
    name: "فورك سجق 1ك بسعر 140 بدلا من 170",
    price: 140,
    compony: "عروض التوفير",
    quantity: [1, 1, 1],
    buingPrice: 128.1,
  },
];

const controller = {
  //! GET {
  getProducut: async (req, res) => {
    const token = req.params.admin;
    const [rows, fields] = await promisePool.query(
      "SELECT Admin,id FROM Users WHERE id=?",
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
      const [sql, fields1] = await promisePool.query(
        "SELECT * FROM Products LIMIT ?,?;SELECT name FROM Categories;SELECT name FROM Componies;",
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
      res.render("admin/products", {
        products: sql[0],
        categories: sql[1],
        componies: sql[2],
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
      if (rows.length > 0) {
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
            "/admin/panle/orders/" +
              userId +
              "/?page=" +
              encodeURIComponent("1")
          );
        }
        const startingLimit = (page - 1) * resultsPerPage;
        const [sql, fields1] = await promisePool.query(
          "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, TheOrders.city, TheOrders.method, TheOrders.where,TheOrders.discount,Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ?,?",
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
        res.render("admin/orders", {
          orders: rows,
          page: 1,
          iterator: 1,
          endingLink: 1,
          numberOfPages: 1,
          userId,
        });
      }
    } else if (rows[0].Stuff === 1) {
      const [rows, fields] = await promisePool.query("SELECT * FROM TheOrders");
      if (rows.length > 0) {
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
            "/admin/panle/orders/" +
              userId +
              "/?page=" +
              encodeURIComponent("1")
          );
        }
        const startingLimit = (page - 1) * resultsPerPage;
        const [sql, fields1] = await promisePool.query(
          "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, TheOrders.city, TheOrders.method, TheOrders.where,TheOrders.discount,Users.email FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id ORDER BY delivered ASC LIMIT ?,?",
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
        res.render("admin/orders", {
          orders: rows,
          page: 1,
          iterator: 1,
          endingLink: 1,
          numberOfPages: 1,
          userId,
        });
      }
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
        "SELECT * FROM Componies",
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
        "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, TheOrders.city, TheOrders.method, TheOrders.where, TheOrders.discount, Users.username FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id WHERE `TheOrders`.`id` = ?",
        [order]
      );
      res.render("admin/orders/id", { order: orders[0] });
    } else if (user[0].Stuff === 1) {
      const [orders, fields] = await promisePool.query(
        "SELECT TheOrders.id, TheOrders.user, TheOrders.addrSt, TheOrders.addrB, TheOrders.addrF, TheOrders.phone, TheOrders.spare_phone, TheOrders.delivered, TheOrders.paid, TheOrders.total, TheOrders.date, TheOrders.cart, TheOrders.city, TheOrders.method, TheOrders.where, TheOrders.discount, Users.username FROM TheOrders INNER JOIN Users ON TheOrders.user = Users.id WHERE `TheOrders`.`id` = ?",
        [order]
      );
      res.render("admin/orders/id", { order: orders[0] });
    } else {
      res.redirect("/");
    }
  },
  getTotalSales: async (req, res) => {
    const token = req.params.admin;

    const [rows, fields] = await promisePool.query(
      "SELECT Admin,Stuff,id FROM Users WHERE id=?;",
      [token]
    );
    const [orders, _] = await promisePool.query(
      "SELECT `where`,`total`,`cart`,`city` FROM `TheOrders` WHERE delivered = 1"
    );

    let [product, __] = await promisePool.query(
      "SELECT `id`,`name`,`price`,`compony`,`buingPrice` FROM `Products`"
    );

    const sum = orders.reduce((p, c) => {
      const Far3 = () => {
        if (c.where === "الفرع") {
          return p + c.total;
        }
        if (c.city !== "الشروق") {
          return p + c.total - 40;
        } else {
          return p + c.total - 20;
        }
      };
      return Far3();
    }, 0);
    const productSales = [];
    orders.forEach((order) => {
      order.cart.forEach((pro) => {
        product.forEach((p) => {
          if (pro.id == p.id) {
            Object.assign(p, { quantity: [pro.quantity] });
            productSales.push(p);
          }
        });
      });
    });
    const unique = [];
    for (const item of productSales) {
      const isDuplicate = unique.find((obj) => obj.id === item.id);
      if (!isDuplicate) {
        unique.push(item);
      } else {
        item.quantity.push(isDuplicate.quantity[0]);
      }
    }

    productsdeleted.forEach((p) => {
      unique.push(p);
    });
    unique.sort(function (a, b) {
      return a.compony.localeCompare(b.compony, ["ar"]);
    });
    unique.forEach((p) => {
      const quantity = p.quantity.reduce((acc, curr) => {
        return acc + curr;
      }, 0);

      let safy = 0;
      if (p.buingPrice !== null) {
        safy = p.price - p.buingPrice;
      }

      Object.assign(p, { total: safy * quantity });
    });

    let profit = 0;

    unique.forEach((p) => {
      profit += p.total;
    });
    if (rows[0].Admin == 1) {
      res.render("admin/totalSales/index.ejs", {
        orderslen: orders.length,
        total: sum,
        totalS: profit,
        product: unique,
      });
    } else if (rows[0].Stuff == 1) {
      res.redirect("/admin/panle/orders/" + row1.id);
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
    const token = req.params.token;
    const compony = req.params.compony;
    const [rows, fields] = await promisePool.query(
      "SELECT Admin,id FROM Users WHERE id=?",
      [token]
    );
    const userId = rows[0].id;
    if (rows[0].Admin === 1) {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM Products WHERE compony=?",
        [compony]
      );
      const numOfResults = rows.length;
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
      const [sql, fields1] = await promisePool.query(
        "SELECT * FROM Products WHERE compony=? LIMIT ?,?;SELECT name FROM Categories;SELECT name FROM Componies;",
        [compony, startingLimit, resultsPerPage]
      );
      let iterator = page - 5 < 1 ? 1 : page - 5;
      let endingLink =
        iterator + 9 < numberOfPages
          ? iterator + 9
          : page + (numberOfPages - page);

      if (endingLink < page + 4) {
        iterator -= page + 4 - numberOfPages;
      }
      res.render("admin/products", {
        products: sql[0],
        categories: sql[1],
        componies: sql[2],
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
