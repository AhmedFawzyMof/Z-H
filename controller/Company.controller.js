const db = require("../db/index");
const fs = require("fs");
const promisePool = db.promise();

function CreateImage(name, image) {
  fs.writeFileSync(`public/img/compony/${name}.png`, image, {
    encoding: "base64",
  });
  return "/img/compony/" + name + ".png";
}

const controller = {
  AddCompany: async (req, res) => {
    const name = req.body.name_ar;
    const image = req.body.image;
    const base64Image = image.split(";base64,").pop();
    const imagePath = CreateImage(name, base64Image);
    const [_, __] = await promisePool.query(
      "INSERT INTO `Componies` (`name`, `image`) VALUES (?, ?)",
      [name, imagePath]
    );
    res.send(`
        <script>
          window.history.back();
          location.reload()
        </script>`);
  },
  EditCompany: async (req, res) => {
    const companyName = req.body.name;
    const companyId = req.body.subcategoryid;

    const [_, __] = await promisePool.query(
      "UPDATE `Componies` SET `name` = ? WHERE `Componies`.`id` = ?",
      [companyName, companyId]
    );
  },
};

module.exports = controller;
