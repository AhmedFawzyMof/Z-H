const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");

const controller = {
  addOne: (req, res) => {
    const {
      where,
      address,
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
    console.log(total);
    if (JSON.parse(cart).length > 0) {
      db.query("SELECT * FROM Users WHERE id = ?", [user], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          const coupons = JSON.parse(result[0].coupons);
          coupons.forEach((coupon, index) => {
            if (coupon.value === JSON.parse(discount)) {
              coupons.splice(index, 1);
            }
          });
          db.query(
            "INSERT INTO TheOrders (`id`, `user`, `address`, `phone`, `spare_phone`, `delivered`, `paid`, `total`, `date`, `cart`, `where`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);UPDATE `Users` SET coupons= ? WHERE Users.id= ?",
            [
              id,
              user,
              address,
              phone.toString(),
              phone2.toString(),
              delivered,
              paid,
              total,
              date,
              cart,
              where,
              JSON.stringify(coupons),
              user,
            ],
            (err, result) => {
              if (err) throw err;
              res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.removeItem("coupon")
            localStorage.removeItem("disCount")
            location.replace("/pay/info/success");
          </script>`);
            }
          );
        }
      });
    } else {
      res.redirect("/");
    }
  },
  getSuccess: (req, res) => {
    res.render("Checkout/success");
  },
  getOrderHistory: (req, res) => {
    const userId = req.params.userId;
    const name = {};
    db.query(
      "SELECT username,email FROM Users WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          Object.assign(name, result[0]);
          db.query(
            "SELECT * FROM TheOrders WHERE user = ?",
            [userId],
            (err, result) => {
              if (err) throw err;

              res.render("Checkout/orderhistory", {
                orders: result,
                name: name,
              });
            }
          );
        }
      }
    );
  },
  getCash: (req, res) => {
    res.render("Checkout/cash.ejs");
  },
  editDelivered: (req, res) => {
    const { id, isDelivered } = req.body;
    db.query(
      "UPDATE TheOrders SET `delivered` = ? WHERE TheOrders.`id` = ?",
      [isDelivered, id],
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
  editPaid: (req, res) => {
    const { id, isPaid } = req.body;
    db.query(
      "UPDATE TheOrders SET `paid` = ? WHERE TheOrders.`id` = ?",
      [isPaid, id],
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
  getCreditCard: (req, res) => {
    res.render("Checkout/paypal", {
      paypalClientId: process.env.PAYPAL_CLIENT_ID,
    });
  },
  postPaypal: (req, res) => {
    console.log(req);
  },
};

module.exports = controller;
