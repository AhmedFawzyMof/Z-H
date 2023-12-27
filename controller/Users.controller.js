const db = require("../db/index");
const promisePool = db.promise();

const controller = {
  EditUser: async (req, res) => {
    const { id, isManger } = req.body;
    const [_, __] = await promisePool.query(
      "UPDATE `Users` SET `Admin` = ? WHERE `Users`.`id` = ?",
      [isManger, id],
    );
    res.send(
      `
        <script>
          window.history.back();
          location.reload()
        </script>
      `,
    );
  },
  GetCoupons: async (req, res) => {
    const user = req.body.user;
    if (user === "noToken") {
      res.json({
        success: 0,
      });
      return;
    }
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM Users WHERE id = ?",
      user,
    );
    const UsersCoupons = rows[0].coupons;
    const UsersAdmin = rows[0].Admin;
    const couponsLen = rows[0].coupons.length;
    if (UsersCoupons.length != 0) {
      res.json({
        success: couponsLen,
        Admin: UsersAdmin,
      });
      return;
    }
    res.json({
      success: 0,
    });
  },
  UserCoupons: async (req, res) => {
    const user = req.params.user;
    const [coupons, _] = await promisePool.query(
      "SELECT coupons FROM Users WHERE id=?;",
      [user],
    );
    res.render("User/coupon", {
      coupons: coupons,
    });
  },
  CashBackBlance: async (req, res) => {
    const user = req.params.user;

    const [rows, fields] = await promisePool.query(
      "SELECT * FROM Users WHERE id = ?",
      [user],
    );
    const CashBackBlance = rows[0].cashback;
    res.render("User/cashbackpoints", { cashback: CashBackBlance });
  },
};

module.exports = controller;
