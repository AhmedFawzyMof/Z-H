const db = require("../db/index");
const promisePool = db.promise();
const fs = require("fs");
const os = require("os-utils");

const controller = {
  addOne: async (req, res) => {
    const {
      category,
      subcategory,
      name_ar,
      dis_ar,
      price,
      image,
      available,
      offer,
      buingprice,
    } = req.body;
    const images = "/img/product/" + name_ar + ".png";
    let base64Image = image.split(";base64,").pop();
    fs.writeFile(
      `public/img/product/${name_ar}.png`,
      base64Image,
      { encoding: "base64" },
      function (err) {
        console.log("File created");
      }
    );
    const [rows, fields] = await promisePool.query(
      "INSERT INTO `Products`(`name`, `description`, `category`, `compony`, `price`, `image`, `available`,`offer`,`buingprice`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name_ar,
        dis_ar,
        category,
        subcategory,
        price,
        images,
        available,
        offer,
        buingprice,
      ]
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
  addOffer: async (req, res) => {
    const body = req.body;
    // const images = "/img/offer/" + body.product + ".png";
    // let base64Image = body.image.split(";base64,").pop();
    // fs.writeFile(
    //   `public/${images}`,
    //   base64Image,
    //   { encoding: "base64" },
    //   function (err) {
    //     console.log("File created");
    //   }
    // );
    if (body.product !== "") {
      const [rows, fields] = await promisePool.query(
        "INSERT INTO `Offer` ( `product`,  `image` ) VALUES (?,?)",
        [body.product, body.image]
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
    }
    if (body.compony !== "") {
      db.query(
        "INSERT INTO `Offer` (`image`, `company`) VALUES (?,?)",
        [body.image, body.compony],
        (err, result) => {
          if (err) throw err;
          res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
        }
      );
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await promisePool.query(
      "SELECT * FROM `Products` WHERE id = ?",
      [id]
    );

    const product = rows[0];
    console.log(product);
    res.render("Product/id", {
      product: product,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  getCode: async (req, res) => {
    const { code, id } = req.body;

    if (code !== "") {
      const [Thecoupon, _] = await promisePool.query(
        "SELECT * FROM Coupons WHERE code = ?",
        [code]
      );

      if (Thecoupon.length == 0) {
        const [rows, fields] = await promisePool.query(
          "SELECT coupons FROM `Users` WHERE id = ?",
          [JSON.parse(id)]
        );
        const coupons = rows[0].coupons;

        coupons.forEach((r) => {
          delete r.index;
        });

        let coupon = coupons.find((coupon) => {
          return coupon.code == code;
        });

        const dis = { code: "", value: 0 };
        if (coupon !== undefined) {
          res.send(`
           <script>
           localStorage.setItem('disCount', '${JSON.stringify(coupon)}')
           window.history.back();
           </script>
           `);
          os.cpuUsage(function (v) {
            console.log("CPU USAGE (%): " + v);
          });
        } else {
          res.send(`
            <script>
            localStorage.setItem('disCount', '${JSON.stringify(dis)}')
            window.history.back();
            </script>
            `);
          os.cpuUsage(function (v) {
            console.log("CPU USAGE (%): " + v);
          });
        }
      } else {
        let used = false;
        if (Thecoupon[0].usersUsed.length > 0) {
          Thecoupon[0].usersUsed.forEach((user) => {
            if (user === JSON.parse(id)) {
              used = true;
            } else {
              Thecoupon[0].usersUsed.push(JSON.parse(id));
            }
          });
        } else {
          Thecoupon[0].usersUsed.push(JSON.parse(id));
        }
        const coupon = { code: Thecoupon[0].code, value: Thecoupon[0].value };
        const [update, f] = await promisePool.query(
          "UPDATE Coupons SET usersUsed=? WHERE id=?",
          [JSON.stringify(Thecoupon[0].usersUsed), Thecoupon[0].id]
        );
        if (!used) {
          res.send(`
        <script>
        localStorage.setItem('disCount', '${JSON.stringify(coupon)}')
        window.history.back();
        </script>
        `);
        } else {
          res.send(`
        <script>
        localStorage.removeItem('disCount', '${JSON.stringify(coupon)}')
        window.history.back();
        </script>
        `);
        }
      }
    } else {
      res.send(`
          <script>
          localStorage.setItem('disCount', '${JSON.stringify(dis)}')
          window.history.back();
          </script>
          `);
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    }
  },
  getCart: (req, res) => {
    res.render("cart.ejs");
  },
  searchProduct: async (req, res) => {
    const Searchquery = req.body.search;
    const [rows, fields] = await promisePool.query(
      `SELECT * FROM Products WHERE name LIKE '%${Searchquery}%'`
    );
    res.render("Product/search", {
      SearchedProduct: rows,
      search: Searchquery,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  editProduct: async (req, res) => {
    const body = req.body;
    const id = req.body.productid;
    if (body.price !== undefined) {
      const price = req.body.price;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `price` = ? WHERE `Products`.`id` = ?",
        [price, id]
      );
      res.send(`
      <script>
        window.history.back();
        location.reload();
      </script>`);
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    }
    if (body.available !== undefined) {
      const available = req.body.available;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `available` = ? WHERE `Products`.`id` = ?",
        [available, id]
      );
      res.send(`
      <script>
        window.history.back();
        location.reload();
      </script>`);
    }
    if (body.cate !== undefined) {
      const cate = req.body.cate;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `category` = ? WHERE `Products`.`id` = ?",
        [cate, id]
      );
      res.send(
        `
          <script>
            window.history.back();
            location.reload();
          </script>
        `
      );
    }
    if (body.compony !== undefined) {
      const compony = req.body.compony;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `compony` = ? WHERE `Products`.`id` = ?",
        [compony, id]
      );
      res.send(`
      <script>
        window.history.back();
        location.reload();
      </script>`);
    }
    if (body.stock !== undefined) {
      const stock = req.body.stock;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `inStock` = ? WHERE `Products`.`id` = ?",
        [stock, id]
      );
      res.send(
        `
          <script>
            window.history.back();
            location.reload();
          </script>
        `
      );
    }
    if (body.buingPrice !== undefined) {
      const buingPrice = req.body.buingPrice;
      const [rows, fields] = await promisePool.query(
        "UPDATE `Products` SET `buingPrice` = ? WHERE `Products`.`id` = ?",
        [buingPrice, id]
      );
      res.send(
        `
          <script>
            window.history.back();
            location.reload();
          </script>
        `
      );
    }
  },
  editOffer: async (req, res) => {
    const { id, product } = req.body;

    const [rows, fields] = await promisePool.query(
      "UPDATE `Offer` SET `product` = ? WHERE `Offer`.`id` = ?",
      [product, id]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  editPromo: async (req, res) => {
    const { id, code, value } = req.body;

    const [rows, fields] = await promisePool.query(
      "UPDATE `PromoCode` SET `code` = ?, `value` = ? WHERE `PromoCode`.`id` = ?",
      [code, value, id]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  fav: async (req, res) => {
    const { user, product } = req.body;
    const [r1, f1] = await promisePool.query(
      "SELECT `product`, `user` FROM `favourite` WHERE user=?",
      [user]
    );

    if (r1.length == 0) {
      const [r2, f2] = await promisePool.query(
        "INSERT INTO `favourite` (`product`, `user`) VALUES (?, ?)",
        [product, user]
      );

      res.json({
        success: 1,
        msg: "تم حفظ المنتج في قائمة المفضلة",
        length: 1,
      });
      os.cpuUsage(function (v) {
        console.log("CPU USAGE (%): " + v);
      });
    } else {
      let Product;
      r1.forEach((prod) => {
        if (prod.product === parseInt(product)) {
          Product = prod.product;
        }
      });
      const [lengthR, fields] = await promisePool.query(
        "SELECT COUNT(*) as Length FROM `favourite` WHERE user=?",
        [user]
      );
      if (Product !== parseInt(product)) {
        const [r3, f3] = await promisePool.query(
          "INSERT INTO `favourite` (`product`, `user`) VALUES (?, ?)",
          [product, user]
        );
        res.json({
          success: 1,
          msg: "تم حفظ المنتج في قائمة المفضلة",
          length: lengthR[0].Length + 1,
        });
      } else {
        res.json({
          success: 0,
          msg: "المنتج موجود بالفعل في المفضلة",
        });
      }
    }
  },
  getfav: async (req, res) => {
    const userId = req.params.user;
    const [rows, fields] = await promisePool.query(
      "SELECT favourite.product, favourite.user, Products.name, Products.image, Products.price, Products.available, Products.id FROM favourite INNER JOIN Products ON favourite.product=Products.id WHERE user = ?;",
      [userId]
    );
    res.render("User/favourite.ejs", {
      products: rows,
      length: rows.length,
    });
    os.cpuUsage(function (v) {
      console.log("CPU USAGE (%): " + v);
    });
  },
  deleteFav: async (req, res) => {
    const { product, user, length } = req.body;

    const [rows, fields] = await promisePool.query(
      "DELETE FROM favourite	WHERE (product,user) = (?,?)",
      [product, user]
    );

    if (length === "0") {
      res.send(`
    <script>
    location.replace('/fav/show/${user}')
    localStorage.setItem('favlist',${length})
    </script>
    `);
    } else {
      res.send(`
        <script>
        location.replace('/fav/show/${user}')
        localStorage.setItem('favlist',${JSON.parse(length) - 1})
        </script>
        `);
    }
  },
  check: async (req, res) => {
    const data = req.body;
    const products = [];
    data.forEach((da) => {
      products.push(da.id);
    });
    if (products.length > 0) {
      const [isItAva, _] = await promisePool.query(
        "SELECT available, id FROM Products WHERE id IN (?) AND available = 0",
        [products]
      );

      return res.json({
        isItAva,
      });
    }
    return res.json({
      isItAva: [],
    });
  },
};

module.exports = controller;
