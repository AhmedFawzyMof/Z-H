const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const promisePool = db.promise();

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
        } else {
          const pass = crypto.createHmac("sha256", password).digest("hex");
          const id = uuidv4();
          const [rows, fields] = await promisePool.query(
            "INSERT INTO `Users` (`id`, `username`, `email`, `password`, `coupons`) VALUES (?, ?, ?, ?, ?)",
            [id, name, email, pass, JSON.stringify(coupons)]
          );
          res.json({
            success: 1,
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
    const { email, password, code } = req.body;
    const pass = crypto.createHmac("sha256", password).digest("hex");

    const [r1, f1] = await promisePool.query(
      "SELECT id,Admin,Stuff,coupons FROM `Users` WHERE (`email`, `password`) = (?, ?)",
      [email, pass]
    );
    if (r1.length > 0) {
      let stuff = false;
      let coupons = r1[0].coupons;
      const id = r1[0].id;
      const TheUser = r1[0];
      let users = [];
      if (r1[0].Stuff !== 0) {
        stuff = true;
      }
      if (code !== "") {
        const [r2, f2] = await promisePool.query(
          "SELECT * FROM `Referral_Link` WHERE code=?",
          [code]
        );
        const value = r2[0].value;
        const CodeUser = r2[0].user;
        if (CodeUser == id) {
          res.json({
            success: 1,
            Stuff: stuff,
            user: TheUser.id,
            StateM: TheUser.Admin,
            code: coupons.length,
          });
        }
        if (r2[0].users == null) {
          users.push(id);
          const [r3, f3] = await promisePool.query(
            "SELECT coupons FROM `Users` WHERE id=?",
            [CodeUser]
          );

          r3[0].coupons.push({ code: code, value: value });
          const [r4, f4] = await promisePool.query(
            db.query("UPDATE `Users` SET `coupons`=? WHERE id=?", [
              JSON.stringify(r3[0].coupons),
              CodeUser,
            ])
          );

          coupons.push({ code: code, value: value });
          const [r5, f5] = await promisePool.query(
            "UPDATE `Users` SET `coupons`=? WHERE id=?",
            [JSON.stringify(coupons), id]
          );

          const [r6, f6] = await promisePool.query(
            "UPDATE `Referral_Link` SET `users`=? WHERE code =?",
            [JSON.stringify(users), code]
          );

          res.json({
            success: 1,
            Stuff: stuff,
            user: TheUser.id,
            StateM: TheUser.Admin,
            code: coupons.length,
          });
        }
        if (result[0].users.length > 0) {
          users = result[0].users;
          const theUser = [];
          users.forEach((use) => {
            if (use == id) {
              theUser.push(use);
            }
          });
          if (theUser[0] == id) {
            res.json({
              success: 1,
              Stuff: stuff,
              user: TheUser.id,
              StateM: TheUser.Admin,
              code: coupons.length,
            });
          } else {
            const [r7, f7] = await promisePool.query(
              "SELECT coupons FROM `Users` WHERE id=?",
              [id]
            );
            r7[0].coupons.push({ code: code, value: value });
            const [r8, f8] = await promisePool.query(
              "UPDATE `Users` SET `coupons`=? WHERE id=?",
              [JSON.stringify(r7[0].coupons), id]
            );

            res.json({
              success: 1,
              Stuff: stuff,
              user: TheUser.id,
              StateM: TheUser.Admin,
              code: coupons.length,
            });
          }
        }
      } else {
        res.json({
          success: 1,
          Stuff: stuff,
          user: TheUser.id,
          StateM: TheUser.Admin,
          code: coupons.length,
        });
      }
    } else {
      res.json({
        success: 0,
        message: "لا يمكن تسجيل الدخول بالمعلومات المقدمة",
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
  },
  about: (req, res) => {
    res.render("about");
  },
  contactus: (req, res) => {
    res.render("contactus");
  },
  contact: async (req, res) => {
    const { name, email, phone, message } = req.body;

    const [rows, fields] = await promisePool.query(
      "INSERT INTO `Contact` (`name`, `email`, `phone`, `message`) VALUES (?, ?, ?, ?)",
      [name, email, phone, message]
    );

    res.send(`
        <script>
        location.replace('/info/contact_us/success')
        </script>`);
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
      } else {
        res.json({
          success: 0,
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
  },
  makeRef: (req, res) => {
    const user = req.body.user;
    const userId = user.slice(0, 8);
    const random = Math.floor(Math.random() * 1000000);
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const discountCode = userId + "_" + random;
    const year = new Date().getUTCFullYear();
    const month = new Date().getUTCMonth();
    const day = new Date().getUTCDate();
    const date = new Date(`${year}-${months[month]}-${day}`);
    db.query(
      "SELECT user FROM `Referral_Link` WHERE user=?",
      [user],
      (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.json({
            refCode: "",
          });
        } else {
          db.query(
            "INSERT INTO `Referral_Link`(`user`, `created_at`, `code`, `value`) VALUES (?,?,?,?)",
            [user, date, discountCode, 10],
            (err, result) => {
              if (err) throw err;
              res.json({
                refCode: discountCode,
              });
            }
          );
        }
      }
    );
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
};
module.exports = controller;
