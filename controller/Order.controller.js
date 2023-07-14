const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");

const controller = {
  addOne: (req, res) => {
    const { address, phone, phone2, user, total, cart, delivered, paid } =
      req.body;

    const id = uuidv4();
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (JSON.parse(cart).length > 0) {
      db.query("SELECT * FROM Users WHERE id = ?", [user], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          db.query(
            "INSERT INTO `Order` (`id`, `user`, `address`, `phone`, `spare phone`, `delivered`, `paid`, `total`, `date`, `cart`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            ],
            (err, result) => {
              if (err) throw err;
              res.send(`
          <script>
            localStorage.setItem("cart","[]")
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
      "SELECT username FROM Users WHERE id = ?",
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
  getCitysOrders: (req, res) => {
    const city = req.body.city;
    db.query(
      "SELECT * FROM `orders` WHERE City = ? LIMIT 0,50",
      [city],
      (err, result) => {
        if (err) throw err;
        res.json({
          data: result,
        });
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
