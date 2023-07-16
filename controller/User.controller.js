const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const controller = {
  Register: (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    if (password != password2) {
      res.json({ success: 0, message: "كلمات السر لا تتطابق" });
    } else {
      db.query(
        "SELECT * FROM `Users` WHERE email = ?",
        [email],
        (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.json({ success: 0, message: "البريد الإلكتروني مسجل بالفعل" });
          } else {
            const pass = crypto.createHmac("sha256", password).digest("hex");
            const id = uuidv4();
            db.query(
              "INSERT INTO `Users` (`id`, `username`, `email`, `password`) VALUES (?, ?, ?, ?)",
              [id, name, email, pass],
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
  },
  Login: (req, res) => {
    const { email, password } = req.body;
    const pass = crypto.createHmac("sha256", password).digest("hex");
    db.query(
      "SELECT id,Admin FROM `Users` WHERE (`email`, `password`) = (?, ?)",
      [email, pass],
      (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.json({
            success: 1,
            user: result[0].id,
            StateM: result[0].Admin,
          });
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
    }
    // db.query(
    //   "UPDATE `Users` SET `username` = ?, `email` = ?, `password` = ? WHERE `Users`.`id` = ?",
    //   [name, email, pass, id],
    //   (err, result) => {
    //     if (err) throw err;
    //     res.send(`
    //     <script>
    //       window.history.back();
    //       location.reload()
    //     </script>`);
    //   }
    // );
  },
};
module.exports = controller;
