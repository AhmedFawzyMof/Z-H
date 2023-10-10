const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const promisePool = db.promise();
const os = require("os-utils");
const nodeMailer = require("nodemailer");

const controller = {
  Register: async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const terms = req.body.terms;
    if (terms === "yes") {
      const coupons = [
        { code: "13102019", value: 10 },
        { code: "80402002", value: 15 },
        { code: "29072002", value: 20 },
      ];
      if (password != password2) {
        res.json({ success: 0, message: "كلمات السر لا تتطابق" });
      } else {
        const [rows, fields] = await promisePool.query(
          "SELECT * FROM `Users` WHERE email = ?",
          [email]
        );
        if (rows.length > 0) {
          res.json({
            success: 0,
            message: "البريد الإلكتروني مسجل بالفعل",
          });
          os.cpuUsage(function (v) {
            console.log("CPU USAGE (%): " + v);
          });
        } else {
          const pass = crypto.createHmac("sha256", password).digest("hex");
          const id = uuidv4();
          const [rows, fields] = await promisePool.query(
            "INSERT INTO `Users` (`id`, `username`, `email`, `password`, `coupons`) VALUES (?, ?, ?, ?, ?)",
            [id, name, email, pass, JSON.stringify(coupons)]
          );
          const [login, fi] = await promisePool.query(
            "SELECT id,Admin,Stuff,coupons FROM `Users` WHERE (`email`, `password`) = (?, ?)",
            [email, pass]
          );
          const Coupons = login[0].coupons;
          const Admin = login[0].Admin;
          const Stuff = login[0].Stuff;
          const ID = login[0].id;
          let stuff = false;
          if (Stuff !== 0) {
            stuff = true;
          }
          res.json({
            success: 1,
            Stuff: stuff,
            user: ID,
            StateM: Admin,
            code: Coupons.length,
          });

          os.cpuUsage(function (v) {
            console.log("CPU USAGE (%): " + v);
          });
        }
      }
    } else {
      res.json({
        success: 0,
        message: "لا يمكن التسجيل دون الموافقة على الشروط والأحكام",
      });
    }
  },
  Login: async (req, res) => {
    const { email, password } = req.body;
    const pass = crypto.createHmac("sha256", password).digest("hex");

    const [r1, _] = await promisePool.query(
      "SELECT id,Admin,Stuff,coupons FROM `Users` WHERE (`email`, `password`) = (?, ?)",
      [email, pass]
    );

    if (r1.length > 0) {
      const Coupons = r1[0].coupons;
      const Admin = r1[0].Admin;
      const Stuff = r1[0].Stuff;
      const ID = r1[0].id;
      let stuff = false;
      if (Stuff !== 0) {
        stuff = true;
      }
      res.json({
        success: 1,
        Stuff: stuff,
        user: ID,
        StateM: Admin,
        code: Coupons.length,
      });
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    } else {
      res.json({
        success: 0,
        message: "لا يمكن تسجيل الدخول بالمعلومات المقدمة",
      });
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    }
  },
  getLogin: (req, res) => {
    res.render("User/login.ejs");
  },
  getRegister: (req, res) => {
    res.render("User/register");
  },
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
  getProfile: async (req, res) => {
    const userId = req.params.userId;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM Users WHERE id = ?",
      [userId]
    );
    res.render("User/profile", { profile: rows[0] });
  },
  editProfile: async (req, res) => {
    const { id, name, email, password } = req.body;
    const pass = crypto.createHmac("sha256", password).digest("hex");
    if (id === "") {
      console.log(req.body.id);
    } else if (name === "") {
      res.render("Err/profile", { err: "الاسم مفقود" });
    } else if (email === "") {
      res.render("Err/profile", {
        err: "البريد الإلكتروني مفقود",
      });
    } else if (password === "") {
      res.render("Err/profile", { err: "كلمة المرور مفقودة" });
    } else {
      console.log("ok");
      const [rows, fields] = await promisePool.query(
        "UPDATE `Users` SET `username` = ?, `email` = ?, `password` = ? WHERE `Users`.`id` = ?",
        [name, email, pass, id]
      );
      res.send(`
      <script>
        window.history.back();
        location.reload()
      </script>`);
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    }
  },
  getCoupon: async (req, res) => {
    const user = req.body.user;
    if (user !== "noToken") {
      const [rows, fields] = await promisePool.query(
        "SELECT * FROM Users WHERE id = ?",
        [user]
      );
      if (rows[0].coupons.length > 0) {
        res.json({
          success: rows[0].coupons.length,
        });
        os.cpuUsage(function (v) {
          console.log("CPU USAGE (%): " + v);
        });
      } else {
        res.json({
          success: 0,
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
  getforgetEmail: (req, res) => {
    res.render("User/forget");
  },
};

module.exports = controller;
