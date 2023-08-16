const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const promisePool = db.promise();

const controller = {
  addOne: async (req, res) => {
    const where = req.body.where;
    const addrSt = req.body.addrSt;
    const addrB = req.body.addrB;
    const addrF = req.body.addrF;
    const phone = req.body.phone;
    const phone2 = req.body.phone2;
    const user = req.body.user;
    const total = req.body.total;
    const cart = req.body.cart;
    const delivered = req.body.delivered;
    const paid = req.body.paid;
    const discount = req.body.discount;
    const id = uuidv4();
    const date = new Date();
    const ph = phone.toString();
    const sph = phone2.toString();
    if (JSON.parse(cart).length > 0) {
      const [r1, f1] = await promisePool.query(
        "SELECT coupons FROM Users WHERE id = ?",
        [user]
      );

      console.log(r1);

      let coupons = r1[0].coupons;
      coupons.forEach((coupon, index) => {
        if (JSON.stringify(coupon) == discount) {
          coupons.splice(index, 1);
        }
      });
      const [r2, f2] = await promisePool.query(
        "INSERT INTO TheOrders (`id`, `user`, `addrSt`, `addrB`, `addrF`, `phone`, `spare_phone`, `delivered`, `paid`, `total`, `date`, `cart`, `where`, `discount`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
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
          cart,
          where,
          discount,
        ]
      );
      console.log(r2);

      const [r3, f3] = await promisePool.query(
        "UPDATE `Users` SET coupons= ? WHERE Users.id= ?",
        [JSON.stringify(coupons), user]
      );
      console.log(r3);

      res.send(
        `
          <script>
            localStorage.setItem("cart","[]")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/success");
            location.reload();
          </script>
        `
      );
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
    console.log(name);
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
