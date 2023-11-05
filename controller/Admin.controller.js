const db = require("../db/index");
const resultsPerPage = 25;
const promisePool = db.promise();

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
      const [rows, fields] = await promisePool.query("SELECT * FROM `Orders`");
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
          "SELECT `Orders`.`id`, `Orders`.`user`, `Orders`.`delivered`, `Orders`.`paid`, `Orders`.`date`, `Orders`.`where`, `Orders`.`discount`, `Orders`.`city`, `Orders`.`method`, `Users`.`name`, `Users`.`phone`, `Users`.`spare_phone`, `Users`.`street`, `Users`.`building`, `Users`.`floor` FROM `Orders` INNER JOIN `Users` ON `Orders`.`user` = `Users`.`id`  WHERE `date` > '2023-10-6' ORDER BY `delivered` ASC LIMIT ?,?",
          [startingLimit, resultsPerPage]
        );

        const OrdersIds = [];

        sql.forEach((orderId) => {
          OrdersIds.push(orderId.id);
        });

        const [products, _] = await promisePool.query(
          "SELECT OrderProducts.product, OrderProducts.quantity, OrderProducts.`order`, Products.name, Products.image, Products.price  FROM OrderProducts INNER JOIN Products ON OrderProducts.product=Products.id  WHERE `order` IN (?)",
          [OrdersIds]
        );
        sql.forEach((order) => {
          let total = 0;
          Object.assign(order, { cart: [] });

          products.forEach((ord) => {
            if (ord.order === order.id) {
              order.cart.push(ord);
              return order;
            }
          });
          total = order.cart.reduce((arr, cur) => {
            return arr + cur.price * cur.quantity;
          }, 0);
          if (JSON.parse(order.discount).value > 0) {
            total -= JSON.parse(order.discount).value;
          }
          if (order.city == "الشروق" && order.where == "المنزل") {
            total += 20;
          }
          if (order.city !== "الشروق") {
            total += 40;
          }
          Object.assign(order, { total: total });
        });
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
      "SELECT COUNT(*) as 'OrdersLen' FROM `Orders` WHERE delivered = 0;"
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
        "SELECT Orders.id, Orders.user, Orders.delivered, Orders.paid, Orders.date, Orders.where, Orders.discount, Orders.city, Orders.method, Users.name, Users.phone, Users.spare_phone, Users.street, Users.building, Users.floor FROM `Orders` INNER JOIN Users ON Orders.user = Users.id WHERE `Orders`.`id` = ?",
        [order]
      );
      const OrdersIds = [];

      orders.forEach((orderId) => {
        OrdersIds.push(orderId.id);
      });

      const [products, _] = await promisePool.query(
        "SELECT OrderProducts.product, OrderProducts.quantity, OrderProducts.`order`, Products.name, Products.image, Products.price  FROM OrderProducts INNER JOIN Products ON OrderProducts.product=Products.id  WHERE `order` IN (?)",
        [OrdersIds]
      );
      orders.forEach((order) => {
        let total = 0;
        Object.assign(order, { cart: [] });

        products.forEach((ord) => {
          if (ord.order === order.id) {
            order.cart.push(ord);
            return order;
          }
        });
        total = order.cart.reduce((arr, cur) => {
          return arr + cur.price * cur.quantity;
        }, 0);
        if (JSON.parse(order.discount).value > 0) {
          total -= JSON.parse(order.discount).value;
        }
        if (order.city == "الشروق" && order.where == "المنزل") {
          total += 20;
        }
        if (order.city !== "الشروق") {
          total += 40;
        }
        Object.assign(order, { total: total });
      });
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

    const [ordersLen, _] = await promisePool.query(
      "SELECT count(id) AS orders_len FROM zhmarket.Orders WHERE date > '2023-10-6' AND delivered = 1"
    );

    const [product, __] = await promisePool.query(
      "SELECT Products.name, Products.price, Products.compony, Products.buingPrice, OrderProducts.product, SUM(OrderProducts.quantity) AS quantity, Orders.date FROM OrderProducts INNER JOIN Products ON OrderProducts.product = Products.id INNER JOIN Orders ON Orders.id = OrderProducts.order WHERE Orders.delivered = 1 AND Orders.date > '2023-10-6' GROUP BY Products.name ORDER BY quantity DESC"
    );

    const [discounts, ___] = await promisePool.query(
      "SELECT discount FROM zhmarket.Orders WHERE date > '2023-10-6' AND delivered = 1"
    );

    let totalProfit = 0;
    let totalDiscounts = 0;
    let totalRevenues = 0;
    let totalSales = 0;
    let totalProducts = 0;

    product.forEach((p) => {
      totalSales += p.price * p.quantity;
      totalProducts += parseInt(p.quantity);
      if (p.buingPrice !== 0 && p.buingPrice !== null) {
        totalProfit += (p.price - p.buingPrice) * p.quantity;
      }
    });

    discounts.forEach((discount) => {
      const disCount = JSON.parse(discount.discount);
      if (disCount.value > 0) {
        totalDiscounts += disCount.value;
      }
    });
    totalRevenues = totalSales - totalDiscounts;
    if (rows[0].Admin == 1) {
      res.render("admin/totalSales/index.ejs", {
        orderslen: ordersLen[0].orders_len,
        totalRevenues: totalRevenues,
        totalSales: totalSales,
        totalDiscounts: totalDiscounts,
        totalProfit: totalProfit.toFixed(2),
        totalProducts: totalProducts,
        product: product,
      });
    } else if (rows[0].Stuff == 1) {
      res.redirect("/admin/panle/orders/" + row1.id);
    } else {
      res.redirect("/");
    }
  },

  getNew: async (req, res) => {
    const [orders, _] = await promisePool.query(
      "SELECT * FROM `Orders` WHERE delivered = 0"
    );
    let New = false;
    if (orders.length > 0) {
      New = true;
    }
    res.json({
      new: New,
      len: orders.length,
    });
  },
  //! }
  //! SEARCH {
  searchUsers: async (req, res) => {
    const Searchquery = req.body.searchUser;
    if (Searchquery !== "") {
      const search = "%" + Searchquery + "%";
      const [rows, fields] = await promisePool.query(
        `SELECT * FROM Users WHERE id LIKE ? OR phone LIKE ?`,
        [search, search]
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
                    <p>اسم المستخدم: ${user.name}</p>
                    <p>رقم الهاتف المستخدم: ${user.phone}</p>
                    <p>هاتف احتياطي للمستخدم: ${user.spare_phone}</p>
                    <p>رصيد كاش باك للمستخدم: ${user.cashback}</p>
                    <p>
                      عنوان المستخدم:${user.street}, ${user.building}, ${
            user.floor
          }
                    </p>
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
        "SELECT Orders.id, Orders.user, Orders.delivered, Orders.paid, Orders.date, Orders.where, Orders.discount, Orders.city, Orders.method, Users.name, Users.phone, Users.spare_phone, Users.street, Users.building, Users.floor FROM `Orders` INNER JOIN Users ON Orders.user = Users.id  WHERE Orders.id LIKE ? OR Orders.date LIKE ?",
        [search, search]
      );
console.log(rows)

      const OrdersIds = [];

      rows.forEach((orderId) => {
        OrdersIds.push(orderId.id);
      });

      const [products, _] = await promisePool.query(
        "SELECT OrderProducts.product, OrderProducts.quantity, OrderProducts.`order`, Products.name, Products.image, Products.price  FROM OrderProducts INNER JOIN Products ON OrderProducts.product=Products.id  WHERE `order` IN (?)",
        [OrdersIds]
      );
      rows.forEach((order) => {
        let total = 0;
        Object.assign(order, { cart: [] });

        products.forEach((ord) => {
          if (ord.order === order.id) {
            order.cart.push(ord);
            return order;
          }
        });
        total = order.cart.reduce((arr, cur) => {
          return arr + cur.price * cur.quantity;
        }, 0);
        if (JSON.parse(order.discount).value > 0) {
          total -= JSON.parse(order.discount).value;
        }
        if (order.city == "الشروق" && order.where == "المنزل") {
          total += 20;
        }
        if (order.city !== "الشروق") {
          total += 40;
        }
        Object.assign(order, { total: total });
      });

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
                      <p>شارع: ${order.street}</p>
                      <p>عماره: ${order.building}</p>
                      <p>طابق: ${order.floor}</p>
                      <p>المستخدم: ${order.name}</p>
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
      "DELETE FROM `Orders` WHERE `Orders`.`id` = ?",
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
