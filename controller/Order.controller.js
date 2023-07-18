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
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (JSON.parse(cart).length > 0) {
      db.query("SELECT * FROM Users WHERE id = ?", [user], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          db.query(
            "UPDATE `Users` SET code='', value='0' WHERE Users.id= ?",
            [user],
            (err, result) => {
              if (err) throw err;
              console.log(result);
            }
          );
          db.query(
            "INSERT INTO `Order` (`id`, `user`, `address`, `phone`, `spare_phone`, `delivered`, `paid`, `total`, `date`, `cart`, `where`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              id,
              user,
              address,
              phone,
              phone2,
              delivered,
              paid,
              total,
              date,
              cart,
              where,
            ],
            (err, result) => {
              if (err) throw err;
              res.send(`
          <script>
            localStorage.setItem("cart","[]")
            localStorage.removeItem("coupon")
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
            "SELECT * FROM `Order` WHERE user = ?",
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
      "UPDATE `orders` SET `delivered` = ? WHERE `orders`.`id` = ?",
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
      "UPDATE `orders` SET `paid` = ? WHERE `orders`.`id` = ?",
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
