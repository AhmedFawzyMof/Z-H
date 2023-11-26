const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const promisePool = db.promise();

const UserIsRegisterd = async (userdata) => {
  const [user, _] = await promisePool.query(
    "SELECT * FROM Users WHERE phone=? OR spare_phone=?",
    [userdata.phone, userdata.spare_phone]
  );

  if (user.length == 0) {
    const id = uuidv4();
    const coupons = [
      { code: "13102019", value: 10 },
      { code: "80402002", value: 15 },
      { code: "دعم فلسطين", value: 0 },
    ];
    const [__, _] = await promisePool.query(
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
  const [__, ___] = await promisePool.query(
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
};
const CouponsIsUsed = async (discount, userId) => {
  const coupon = { code: "", value: 0 };

  const [user, __] = await promisePool.query(
    "SELECT coupons FROM Users WHERE id=?",
    [userId]
  );
  const coupons = user[0].coupons;
  if (coupons.length == 0) {
    return coupon;
  }

  const disCount = JSON.parse(discount);
  let used = false;
  var TheCoupon;
  // delete the used coupon from the user
  for (let i = 0; i < coupons.length; i++) {
    if (coupons[i].code === disCount.code) {
      used = true;
      TheCoupon = coupons[i];
      coupons.splice(i, 1);
    }
  }
  if (used) {
    const [__, _] = await promisePool.query(
      "UPDATE Users SET coupons=? WHERE id=?",
      [JSON.stringify(coupons), userId]
    );
    return TheCoupon;
  }
  const [coupoN, _] = await promisePool.query(
    "SELECT * FROM `Coupons` WHERE code=?",
    [disCount.code]
  );
  if (coupoN.length > 0) {
    TheCoupon = { code: coupoN[0].code, value: coupoN[0].value };

    const [__, _] = await promisePool.query(
      "UPDATE Coupons SET usersUsed=? WHERE id=?",
      [JSON.stringify(coupoN[0].usersUsed.push(userId)), userId]
    );
    return TheCoupon;
  }

  return coupon;
};
const CreateOrder = async (orderdata) => {
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
      `UPDATE Users SET cashback=cashback-${parseInt(
        orderdata.amount
      )} WHERE id ='${orderdata.user}' `
    );
  }
  return orderdata.id;
};
const InsertOrderProduct = async (products, orderId) => {
  products.forEach(async (product) => {
    const [pro, _] = await promisePool.query(
      "INSERT INTO `OrderProducts` (`product`, `order`, `quantity`) VALUES (?, ?, ?)",
      [parseInt(product.id), orderId, product.quantity]
    );
  });
};

const controller = {
  OrderHistory: async (req, res) => {
    const id = req.params.userId;
    const [address, _] = await promisePool.query(
      "SELECT `name`, `phone`, `spare_phone`, `street`, `building`, `floor` FROM Users WHERE id = ?",
      [id]
    );
    const [orders, __] = await promisePool.query(
      "SELECT * FROM `Orders` WHERE user = ?",
      [id]
    );

    if (orders.length > 0) {
      const orderIds = [];
      for (let i = 0; i < orders.length; i++) {
        const orderId = orders[i].id;
        orderIds.push(orderId);
      }
      const [order_products, _] = await promisePool.query(
        "SELECT OrderProducts.product, OrderProducts.quantity, OrderProducts.`order`, Products.name, Products.image, Products.price  FROM OrderProducts INNER JOIN Products ON OrderProducts.product=Products.id  WHERE `order` IN (?)",
        [orderIds]
      );
      let total = 0;
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        order["cart"] = [];
        for (let i = 0; i < order_products.length; i++) {
          const product = order_products[i];
          if (product.order == order.id) {
            order.cart.push(product);
            total += product.price * product.quantity;
          }
        }
        if (order.city == "الشروق" && order.where == "المنزل") {
          total += 20;
        }
        if (order.city !== "الشروق" && order.where == "المنزل") {
          total += 40;
        }
      }
      res.render("Checkout/orderhistory", {
        orders: orders,
        name: address[0],
      });
      console.log(orders);
    }
  },
  Delivered: async (req, res) => {
    const { id, isDelivered } = req.body;
    const [_, __] = await promisePool.query(
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
  },
  Paid: async (req, res) => {
    const { id, isPaid, user, method } = req.body;

    const [_, __] = await promisePool.query(
      "UPDATE `Orders` SET `paid` = ? WHERE `Orders`.`id` = ?",
      [isPaid, id]
    );

    let paid = true;
    if (isPaid === "1") {
      paid = false;
    }
    console.log(paid);

    const [products, ___] = await promisePool.query(
      "SELECT Products.price, OrderProducts.product, OrderProducts.quantity FROM OrderProducts INNER JOIN Products ON product = Products.id WHERE `order` = ?",
      [id]
    );

    let total = 0;
    let cashback = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      total += product.price;
    }

    cashback = Math.floor(total * 0.01);

    if (!paid) {
      if (method !== "cashvack") {
        const [_, __] = await promisePool.query(
          "UPDATE Users SET cashback=cashback+? WHERE id=?",
          [cashback, user]
        );
      }
    }
  },
  EditOrder: async (req, res) => {
    const admin = req.body.admin;
    const user = req.body.userId;
    const order = req.body.orderId;
    const products = req.body.productId;
    const quantities = req.body.quantity;
    const product = req.body.productAdd;
    const quantity = req.body.quantityAdd;
    const orderProduct = req.body.opid;

    if (products.length > 1) {
      let values = "";
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        if (i == 0) {
          values += `(${orderProduct[i]}, ${p}, '${order}', ${quantities[i]})`;
        } else {
          values += `,(${orderProduct[i]}, ${p}, '${order}', ${quantities[i]})`;
        }
      }
      let stmt =
        "INSERT INTO OrderProducts (id, product,`order`, quantity) VALUES ? ON DUPLICATE KEY UPDATE product=VALUES(product),`order`=VALUES(`order`), quantity=VALUES(quantity)";
      const sql = stmt.replace("?", values);

      const [_, __] = await promisePool.query(sql);
    } else {
      const [_, __] = await promisePool.query(
        "UPDATE OrderProducts SET product=?, `order`=?, quantity=? WHERE id =?",
        [products, order, quantities, orderProduct]
      );
    }

    if (user != "") {
      const [edit, _] = await promisePool.query(
        "UPDATE Orders SET user=? WHERE id=?",
        [user, order]
      );
    }
    if (product != "") {
      const [add, _] = await promisePool.query(
        "INSERT INTO OrderProducts (product, `order`, quantity) VALUES (?, ?, ?)",
        [product, order, quantity]
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
  },
  Order: async (req, res) => {
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
      amount,
    } = req.body;

    var userId;
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
      userId = await UserIsRegisterd(users);
    } else {
      const [__, _] = await promisePool.query(
        "UPDATE Users SET `phone`=?, `spare_phone`=?, `street`=?, `building`=?, `floor`=? WHERE id=?",
        [phone, phone2, addrSt, addrB, addrF, user]
      );
      userId = user;
    }
    var Coupon = { code: "", value: 0 };
    if (JSON.parse(discount).code !== "") {
      Coupon = await CouponsIsUsed(discount, token);
    }
    const order = {
      id: uuidv4(),
      user: userId,
      delivered: 0,
      paid: 0,
      date: new Date(),
      where: where,
      discount: JSON.stringify(Coupon),
      city: city,
      method: method,
      amount: amount,
    };

    const OrderId = await CreateOrder(order);

    await InsertOrderProduct(JSON.parse(cart), OrderId);

    res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.setItem("Token","${userId}")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/success");
          </script>`);
  },
};

module.exports = controller;
