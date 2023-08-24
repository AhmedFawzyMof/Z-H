const db = require("../db/index");
// const fs = require("fs");
const promisePool = db.promise();

const controller = {
  addOne: async (req, res) => {
    const { name_ar, image } = req.body;
    // const images = "/img/compony/" + name_ar + ".png";
    // let base64Image = image.split(";base64,").pop();
    // fs.writeFile(
    //   `public/img/compony/${name_ar}.png`,
    //   base64Image,
    //   { encoding: "base64" },
    //   function (err) {
    //     console.log("File created");
    //   }
    // );

    const [rows, fields] = await promisePool.query(
      "INSERT INTO `Componies` (`name`, `image`) VALUES (?, ?)",
      [name_ar, image]
    );

    res.send(`
        <script>
          window.history.back();
          location.reload()
        </script>`);
  },
  editSubcategory: async (req, res) => {
    const { subcategoryid, name } = req.body;

    const [rows, fields] = await promisePool.query(
      "UPDATE `Componies` SET `name` = ? WHERE `Componies`.`id` = ?",
      [name, subcategoryid]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  share: (req, res) => {
    res.render("share");
  },
};

module.exports = controller;
