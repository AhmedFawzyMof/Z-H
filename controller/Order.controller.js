const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const promisePool = db.promise();
const os = require("os-utils");

const controller = {
  addOne: async (req, res) => {
    const {
      city,
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
      method,
      amount,
      discount,
    } = req.body;
    const id = uuidv4();
    const localTime = new Date().toLocaleString("en-US", {
      timeZone: "Egypt",
    });
    const date = new Date(localTime);
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
        "INSERT INTO TheOrders (`id`, `user`, `addrSt`, `addrB`, `addrF`, `phone`, `spare_phone`, `delivered`, `paid`, `total`, `date`, `cart`, `where`, `discount`, `city`, `method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          city,
          method,
        ]
      );
      switch (method) {
        case "cashback":
          const [rows3, fields3] = await promisePool.query(
            `UPDATE Users SET cashback=cashback-${amount} WHERE id ='${user}' `
          );
          break;
        default:
          const [rows1, fields1] = await promisePool.query(
            `UPDATE Users SET coupons='${JSON.stringify(
              coupons
            )}' WHERE id='${user}'`
          );
          break;
      }

      const d = new Date();
      const hour = d.getHours();
      const minute = d.getUTCMinutes();

      console.log(hour, minute);
      if (hour >= 2 && minute >= 1) {
        res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/successam");
          </script>`);
      } else if (hour >= 9 && minute >= 1) {
        res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/success");
          </script>`);
      } else {
        res.send(`
        <script>
          localStorage.setItem("cart","[]")
          localStorage.removeItem("coupon")
          localStorage.removeItem("disCount")
          location.replace("/pay/info/success");
        </script>`);
      }
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
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  editPaid: async (req, res) => {
    const { id, isPaid, total, user, method } = req.body;

    const backCash = Math.floor(total * 0.02);
    const [rows, fields] = await promisePool.query(
      "UPDATE TheOrders SET `paid` = ? WHERE TheOrders.`id` = ?",
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
  getSuccessAf: (req, res) => {
    res.render("Checkout/successA2am");
  },
};

module.exports = controller;
