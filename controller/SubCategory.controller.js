const db = require("../db/index");

const controller = {
  addOne: (req, res) => {
    const { category, name_ar, image } = req.body;
    db.query(
      "INSERT INTO `subcategory` (`category`,  `name_ar`, `image`) VALUES (?, ?, ?)",
      [category, name_ar, image],
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
  editSubcategory: (req, res) => {
    const { subcategoryid, category, name, image } = req.body;
    db.query(
      "UPDATE `subcategory` SET `category` = ?, `name_ar` = ?, `image` = ? WHERE `subcategory`.`id` = ?",
      [category, name, image, subcategoryid],
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
};

module.exports = controller;
