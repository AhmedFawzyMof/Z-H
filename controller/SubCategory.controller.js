const db = require("../db/index");
const fs = require("fs");

const controller = {
  addOne: (req, res) => {
    const { name_ar, image } = req.body;
    const images = "/img/compony/" + name_ar + ".png";
    let base64Image = image.split(";base64,").pop();
    fs.writeFile(
      `public/img/compony/${name_ar}.png`,
      base64Image,
      { encoding: "base64" },
      function (err) {
        console.log("File created");
      }
    );
    db.query(
      "INSERT INTO `Componies` (`name`, `image`) VALUES (?, ?)",
      [name_ar, images],
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
    const { subcategoryid, name } = req.body;
    db.query(
      "UPDATE `Componies` SET `name` = ? WHERE `Componies`.`id` = ?",
      [name, subcategoryid],
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
