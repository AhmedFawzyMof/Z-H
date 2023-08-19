const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const promisePool = db.promise();

const controller = {
  addOne: async (req, res) => {
    const {
      where,
      addrSt,
      addrB,
      addrF,
      phone,
      phone2,
      user,
      total,
      cart,
      delivered,
      paid,
      discount,
    } = req.body;
    const id = uuidv4();
    const date = new Date();
    const ph = phone.toString();
    const sph = phone2.toString();
    if (JSON.parse(cart).length > 0) {
      const [rows, fields] = await promisePool.query(
        "SELECT coupons FROM Users WHERE id = ?",
        [user]
      );
      let coupons = rows[0].coupons;

      coupons.forEach((coupon, index) => {
        if (JSON.stringify(coupon) === discount) {
          coupons.splice(index, 1);
        }
      });
      const [rows2, fields2] = await promisePool.query(
        "INSERT INTO TheOrders (`id`, `user`, `addrSt`, `addrB`, `addrF`, `phone`, `spare_phone`, `delivered`, `paid`, `total`, `date`, `cart`, `where`, `discount`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          user,
          addrSt,
          addrB,
          addrF,
          ph,
          sph,
          delivered,
          paid,
          total,
          date,
          JSON.stringify(JSON.parse(cart)),
          where,
          discount,
        ]
      );
      const [rows3, fields3] = await promisePool.query(
        "UPDATE `Users` SET `coupons`= ? WHERE id = ?",
        [JSON.stringify(coupons), user]
      );

      res.send(`
        <script>
          localStorage.setItem("cart","[]")
          localStorage.removeItem("coupon")
          localStorage.removeItem("disCount")
          location.replace("/pay/info/success");
        </script>`);
    } else {
      res.redirect("/");
    }
  },

  getSuccess: (req, res) => {
    res.render("Checkout/success");
  },
  getOrderHistory: async (req, res) => {
    const userId = req.params.userId;
    const name = {};
    const [r1, f1] = await promisePool.query(
      "SELECT username,email FROM Users WHERE id = ?",
      [userId]
    );
    Object.assign(name, r1[0]);
    const [r2, f2] = await promisePool.query(
      "SELECT * FROM TheOrders WHERE user = ?",
      [userId]
    );

    res.render("Checkout/orderhistory", {
      orders: r2,
      name: name,
    });
  },
  getCash: (req, res) => {
    res.render("Checkout/cash.ejs");
  },
  editDelivered: async (req, res) => {
    const { id, isDelivered } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE TheOrders SET `delivered` = ? WHERE TheOrders.`id` = ?",
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
  editPaid: async (req, res) => {
    const { id, isPaid } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE TheOrders SET `delivered` = ? WHERE TheOrders.`id` = ?",
      [isPaid, id]
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
  // getCreditCard: (req, res) => {
  //   res.render("Checkout/paypal", {
  //     paypalClientId: process.env.PAYPAL_CLIENT_ID,
  //   });
  // },
  postPaypal: (req, res) => {
    console.log(req);
  },
};

module.exports = controller;
