const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const controller = {
  Register: (req, res) => {
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
        db.query(
          "SELECT * FROM `Users` WHERE email = ?",
          [email],
          (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
              res.json({
                success: 0,
                message: "البريد الإلكتروني مسجل بالفعل",
              });
            } else {
              const pass = crypto.createHmac("sha256", password).digest("hex");
              const id = uuidv4();
              db.query(
                "INSERT INTO `Users` (`id`, `username`, `email`, `password`, `coupons`) VALUES (?, ?, ?, ?, ?)",
                [id, name, email, pass, JSON.stringify(coupons)],
                (err, result) => {
                  if (err) throw err;
                  res.json({
                    success: 1,
                  });
                }
              );
            }
          }
        );
      }
    } else {
      res.json({
        success: 0,
        message: "لا يمكن التسجيل دون الموافقة على الشروط والأحكام",
      });
    }
  },
  Login: (req, res) => {
    const { email, password, code } = req.body;
    console.log(req.body);
    const pass = crypto.createHmac("sha256", password).digest("hex");
    db.query(
      "SELECT id,Admin,Stuff,coupons FROM `Users` WHERE (`email`, `password`) = (?, ?)",
      [email, pass],
      (err, result) => {
        if (err) throw err;
        let stuff = false;
        if (result.length > 0) {
          const coupons = result[0].coupons;
          const id = result[0].id;
          const TheUser = result[0];
          if (result[0].Stuff !== 0) {
            stuff = true;
          }
          if (code !== "") {
            db.query(
              "SELECT * FROM `Referral_Link` WHERE code=?",
              [code],
              (err, result) => {
                if (err) throw err;
                const value = result[0].value;
                const CodeUser = result[0].user;
                if (CodeUser == id) {
                  res.json({
                    success: 1,
                    Stuff: stuff,
                    user: TheUser.id,
                    StateM: TheUser.Admin,
                    code: coupons.length,
                  });
                } else if (result[0].users == null) {
                  users = [];
                  users.push(id);
                  db.query(
                    "SELECT coupons FROM `Users` WHERE id=?",
                    [result[0].user],
                    (err, result) => {
                      result[0].coupons.push({ code: code, value: value });
                      db.query(
                        "UPDATE `Users` SET `coupons`=? WHERE id=?",
                        [JSON.stringify(result[0].coupons), CodeUser],
                        (err, result) => {
                          return;
                        }
                      );
                      db.query(
                        "UPDATE `Users` SET `coupons`=? WHERE id=?",
                        [JSON.stringify(result[0].coupons), id],
                        (err, result) => {
                          return;
                        }
                      );
                    }
                  );
                  db.query(
                    "UPDATE `Referral_Link` SET `users`=? WHERE code =?",
                    [JSON.stringify(users), code],
                    (err, result) => {
                      if (err) throw err;
                      res.json({
                        success: 1,
                        Stuff: stuff,
                        user: TheUser.id,
                        StateM: TheUser.Admin,
                        code: coupons.length,
                      });
                    }
                  );
                } else if (result[0].users.length > 0) {
                  users = result[0].users;
                  const theUser = [];
                  users.forEach((use) => {
                    if (use == id) {
                      theUser.push(use);
                    }
                  });
                  if (theUser[0] == id) {
                    console.log(theUser);
                    console.log();
                    res.json({
                      success: 1,
                      Stuff: stuff,
                      user: TheUser.id,
                      StateM: TheUser.Admin,
                      code: coupons.length,
                    });
                  } else {
                    db.query(
                      "SELECT coupons FROM `Users` WHERE id=?",
                      [result[0].user],
                      (err, result) => {
                        result[0].coupons.push({ code: code, value: value });
                        db.query(
                          "UPDATE `Users` SET `coupons`=? WHERE id=?",
                          [JSON.stringify(result[0].coupons), id],
                          (err, result) => {
                            return;
                          }
                        );
                        res.json({
                          success: 1,
                          Stuff: stuff,
                          user: TheUser.id,
                          StateM: TheUser.Admin,
                          code: coupons.length,
                        });
                      }
                    );
                  }
                }
              }
            );
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
      }
    );
  },
  getLogin: (req, res) => {
    res.render("User/login.ejs");
  },
  getRegister: (req, res) => {
    res.render("User/register");
  },
  editManger: (req, res) => {
    const { id, isManger } = req.body;
    db.query(
      "UPDATE `Users` SET `Admin` = ? WHERE `Users`.`id` = ?",
      [isManger, id],
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
  about: (req, res) => {
    res.render("about");
  },
  contactus: (req, res) => {
    res.render("contactus");
  },
  contact: (req, res) => {
    const { name, email, phone, message } = req.body;
    db.query(
      "INSERT INTO `Contact` (`name`, `email`, `phone`, `message`) VALUES (?, ?, ?, ?)",
      [name, email, phone, message],
      (err, result) => {
        if (err) throw err;
        res.send(`
        <script>
        location.replace('/info/contact_us/success')
        </script>`);
      }
    );
  },
  contact_success: (req, res) => {
    res.render("contact_success");
  },
  getProfile: (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM Users WHERE id = ?", [userId], (err, result) => {
      if (err) throw err;
      res.render("User/profile", { profile: result[0] });
    });
  },
  editProfile: (req, res) => {
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
      db.query(
        "UPDATE `Users` SET `username` = ?, `email` = ?, `password` = ? WHERE `Users`.`id` = ?",
        [name, email, pass, id],
        (err, result) => {
          if (err) throw err;
          res.send(`
          <script>
            window.history.back();
            location.reload()
          </script>`);
        }
      );
    }
  },
  getCoupon: (req, res) => {
    const user = req.body.user;
    if (user !== "noToken") {
      db.query("SELECT * FROM Users WHERE id = ?", [user], (err, result) => {
        if (err) throw err;
        if (result[0].coupons.length > 0) {
          res.json({
            success: result[0].coupons.length,
          });
        } else {
          res.json({
            success: 0,
          });
        }
      });
    } else {
      res.json({
        success: 0,
      });
    }
  },
  getCouponsPage: (req, res) => {
    const user = req.params.user;
    db.query(
      "SELECT coupons FROM Users WHERE id=?;",
      [user, user],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render("User/coupon", {
          coupons: result,
        });
      }
    );
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
