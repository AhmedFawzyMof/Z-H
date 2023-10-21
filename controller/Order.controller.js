const db = require("../db/index");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const promisePool = db.promise();
const os = require("os-utils");

async function checkUser(userdata) {
  let spare_phone;

  if (userdata.spare_phone !== "") {
    spare_phone = userdata.spare_phone;
  }

  const [user, _] = await promisePool.query(
    "SELECT * FROM Users WHERE phone=? OR spare_phone=?",
    [userdata.phone, spare_phone]
  );

  if (user.length > 0) {
    const [update, _] = await promisePool.query(
      "UPDATE Users SET `phone`=?, `spare_phone`=?, `street`=?, `building`=?, `floor`=? WHERE id=?",
      [
        userdata.phone,
        userdata.spare_phone,
        userdata.street,
        userdata.building,
        userdata.floor,
        user[0].id,
      ]
    );
    return user[0].id;
  } else {
    const id = uuidv4();
    const coupons = [
      { code: "13102019", value: 10 },
      { code: "80402002", value: 15 },
      { code: "29072002", value: 20 },
    ];
    const [insert, _] = await promisePool.query(
      "INSERT INTO `Users` (`id`, `name`, `phone`, `Admin`, `Stuff`, `coupons`, `spare_phone`, `street`, `building`, `floor`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        userdata.name,
        userdata.phone,
        0,
        0,
        JSON.stringify(coupons),
        userdata.spare_phone,
        userdata.street,
        userdata.building,
        userdata.floor,
      ]
    );
    return id;
  }
}
async function checkCoupons(discount, userId) {
  const disCount = JSON.parse(discount);
  const [user, _] = await promisePool.query(
    "SELECT coupons FROM Users WHERE id=?",
    [userId]
  );
  let TheCoupon;
  user[0].coupons.forEach((coupon, i) => {
    if (coupon.code === disCount.code) {
      TheCoupon = coupon;
      user[0].coupons.splice(i, 1);
    }
  });
  console.log(user[0].coupons, disCount);
  if (TheCoupon !== undefined) {
    const [updateuser, _] = await promisePool.query(
      "UPDATE Users SET coupons=? WHERE id=?",
      [JSON.stringify(user[0].coupons), userId]
    );
  }
  if (TheCoupon === undefined) {
    const [coupon, _] = await promisePool.query(
      "SELECT * FROM `Coupons` WHERE code=?",
      [TheCoupon.code]
    );

    if (coupon.length > 0) {
      const [update, _] = await promisePool.query(
        "UPDATE Coupons SET usersUsed=? WHERE id=?",
        [JSON.stringify(coupon[0].usersUsed.push(userId)), userId]
      );
    }
  }
}
async function createOrder(orderdata) {
  const [order, _] = await promisePool.query(
    "INSERT INTO `Orders` (`id`, `user`, `delivered`, `paid`, `date`, `where`, `discount`, `city`, `method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      orderdata.id,
      orderdata.user,
      orderdata.delivered,
      orderdata.paid,
      orderdata.date,
      orderdata.where,
      orderdata.discount,
      orderdata.city,
      orderdata.method,
    ]
  );
  if (orderdata.method === "cashback") {
    const [data, _] = await promisePool.query(
      `UPDATE Users SET cashback=cashback-${amount} WHERE id ='${user}' `
    );
  }
  return orderdata.id;
}
async function insertOrderProduct(products, orderId) {
  products.forEach(async (product) => {
    const [pro, _] = await promisePool.query(
      "INSERT INTO `OrderProducts` (`product`, `order`, `quantity`) VALUES (?, ?, ?)",
      [parseInt(product.id), orderId, product.quantity]
    );
  });
}

const controller = {
  addOne: async (req, res) => {
    const {
      name,
      city,
      where,
      addrSt,
      addrB,
      addrF,
      phone,
      phone2,
      method,
      user,
      cart,
      discount,
    } = req.body;
    let token;
    if (user === "noToken") {
      const users = {
        name: name,
        city: city,
        phone: phone,
        spare_phone: phone2,
        street: addrSt,
        building: addrB,
        floor: addrF,
      };
      token = await checkUser(users);
    } else {
      token = user;
    }
    const order = {
      id: uuidv4(),
      user: token,
      delivered: 0,
      paid: 0,
      date: new Date(),
      where: where,
      discount: discount,
      city: city,
      method: method,
    };
    if (JSON.parse(discount).code !== "") {
      await checkCoupons(discount, token);
    }
    const OrderId = await createOrder(order);

    await insertOrderProduct(JSON.parse(cart), OrderId);

    res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.setItem("Token","${token}")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/success");
          </script>`);
  },
  getSuccess: (req, res) => {
    res.render("Checkout/success");
  },
  getOrderHistory: async (req, res) => {
    const userId = req.params.userId;
    const [r1, f1] = await promisePool.query(
      "SELECT `name`, `phone`, `spare_phone`, `street`, `building`, `floor` FROM Users WHERE id = ?",
      [userId]
    );
    const [r2, f2] = await promisePool.query(
      "SELECT * FROM `Orders` WHERE user = ?",
      [userId]
    );
    if (r2.length > 0) {
      const orders_id = r2.map((or) => {
        return or.id;
      });
      const [r3, _] = await promisePool.query(
        "SELECT OrderProducts.product, OrderProducts.quantity, OrderProducts.`order`, Products.name, Products.image, Products.price  FROM OrderProducts INNER JOIN Products ON OrderProducts.product=Products.id  WHERE `order` IN (?)",
        [orders_id]
      );

      r2.forEach((order) => {
        let total = 0;
        Object.assign(order, { cart: [], total: total });

        r3.forEach((ord) => {
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
      });
    }
    res.render("Checkout/orderhistory", {
      orders: r2,
      name: r1[0],
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  getCash: (req, res) => {
    res.render("Checkout/cash.ejs");
  },
  editDelivered: async (req, res) => {
    const { id, isDelivered } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE `Orders` SET `delivered` = ? WHERE `Orders`.`id` = ?",
      [isDelivered, id]
    );

    res.send(
      `
        <script>
          window.history.back();
          location.reload()
        </script>
      `
    );
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  editPaid: async (req, res) => {
    const { id, isPaid, total, user, method } = req.body;
    const withoutShiping = total - 20;
    const backCash = Math.floor(withoutShiping * 0.02);
    const [rows, fields] = await promisePool.query(
      "UPDATE `Orders` SET `paid` = ? WHERE `Orders`.`id` = ?",
      [isPaid, id]
    );
    if (method !== "cashback") {
      const [rows, fields] = await promisePool.query(
        "UPDATE Users SET cashback=cashback+? WHERE id=?",
        [backCash, user]
      );
    }

    res.send(
      `
        <script>
          window.history.back();
          location.reload()
        </script>
      `
    );
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  getCreditCard: (req, res) => {
    res.render("Checkout/credit-card");
  },
  getCreditCard: (req, res) => {
    res.render("Checkout/credit-card");
  },
  getCashBack: async (req, res) => {
    const user = req.params.user;
    const [rows, fields] = await promisePool.query(
      "SELECT cashback FROM Users WHERE id = ?",
      [user]
    );
    res.render("Checkout/cashback", { cashback: rows[0].cashback });
  },
};

module.exports = controller;
