const db = require("../db/index");
const promisePool = db.promise();
const os = require("os-utils");

const controller = {
  editManger: async (req, res) => {
    const { id, isManger } = req.body;
    const [rows, fields] = await promisePool.query(
      "UPDATE `Users` SET `Admin` = ? WHERE `Users`.`id` = ?",
      [isManger, id]
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
  about: (req, res) => {
    res.render("about");
  },
  contactus: (req, res) => {
    res.render("contactus");
  },
  contact: async (req, res) => {
    const { name, email, phone, message } = req.body;
    const date = new Date();
    console.log(date);
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `Contact` (`name`, `email`, `phone`, `message`, `date`) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, message, date]
    );

    res.send(`
        <script>
        location.replace('/info/contact_us/success')
        </script>`);
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  contact_success: (req, res) => {
    res.render("contact_success");
  },
  getCoupon: async (req, res) => {
    const user = req.body.user;
    if (user !== "noToken") {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM Users WHERE id = ?",
        [user]
      );
      console.log(rows[0]);
      if (rows[0].coupons.length > 0) {
        res.json({
          success: rows[0].coupons.length,
          Admin: rows[0].Admin,
        });
        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
      } else {
        res.json({
          success: 0,
          Admin: rows[0].Admin,
        });
        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
      }
    } else {
      res.json({
        success: 0,
      });
    }
  },
  getCouponsPage: async (req, res) => {
    const user = req.params.user;
    const [rows, fields] = await promisePool.query(
      "SELECT coupons FROM Users WHERE id=?;",
      [user]
    );
    res.render("User/coupon", {
      coupons: rows,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  getTerms: (req, res) => {
    res.render("termandcondtions");
  },
  getDelUser: (req, res) => {
    res.render("delUser");
  },
  delUser: (req, res) => {
    const email = req.body.email;
    db.query("DELETE FROM Users WHERE email =?", [email], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.json({
          success: 1,
          message: "تم حذف حسابك بنجاح",
        });
      } else {
        res.json({
          success: 0,
          message: "آسف لا يوجد حساب مع هذا البريد الإلكتروني",
        });
      }
    });
  },
  getCashPoint: async (req, res) => {
    const user = req.params.user;
    if (user !== "noToken") {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM Users WHERE id = ?",
        [user]
      );
      res.render("User/cashbackpoints", { cashback: rows[0].cashback });
    } else {
      res.json({
        success: 0,
      });
    }
  },
};

module.exports = controller;
