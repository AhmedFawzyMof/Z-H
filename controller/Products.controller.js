const { name } = require("ejs");
const db = require("../db/index");
const promisePool = db.promise();
const fs = require("fs");

function CreateImage(name, image, table) {
  fs.writeFileSync(`public/img/${table}/${name}.png`, image, {
    encoding: "base64",
  });
  return `/img/${table}/${name}.png`;
}

const controller = {
  AddProduct: async (req, res) => {
    const category = req.body.category;
    const company = req.body.subcategory;
    const name = req.body.name_ar;
    const description = req.body.dis_ar;
    const price = req.body.price;
    const image = req.body.image;
    const available = req.body.available;
    const offer = req.body.offer;
    const buingprice = req.body.buingprice;
    const imagePath = CreateImage(name, image, "product");

    const [_, __] = await promisePool.query(
      "INSERT INTO `Products`(`name`, `description`, `category`, `compony`, `price`, `image`, `available`,`offer`,`buingprice`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        category,
        company,
        price,
        imagePath,
        available,
        offer,
        buingprice,
      ]
    );

    res.send(`
        <script>
          window.history.back();
          location.reload()
        </script>
      `);
  },
  AddOffer: async (req, res) => {
    const product = req.body.product;
    const company = req.body.compony;
    const image = body.image;
    const imagePath = CreateImage(name, image, "offer");

    if (product !== undefined) {
      const [_, __] = await promisePool.query(
        "INSERT INTO `Offer` ( `product`,  `image` ) VALUES (?,?)",
        [product, imagePath]
      );
      res.send(
        `
          <script>
            window.history.back();
            location.reload()
          </script>
        `
      );
      return;
    }
    const [_, __] = await promisePool.query(
      "INSERT INTO `Offer` ( `image`,  `company` ) VALUES (?,?)",
      [imagePath, company]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
    return;
  },
  ProductById: async (req, res) => {
    const id = req.params.id;
    const [row, _] = await promisePool.query(
      "SELECT * FROM `Products` WHERE id = ?",
      [id]
    );

    const product = row[0];
    res.render("Product/id", {
      product: product,
    });
  },
  ActivateCoupon: async (req, res) => {
    const code = req.body.code;
    const id = JSON.parse(req.body.id);

    const DisCoupon = { code: "", value: 0 };

    if (code == "") {
      res.send(`
          <script>
          localStorage.setItem('disCount', '${JSON.stringify(DisCoupon)}')
          window.history.back();
          </script>
          `);
      return;
    }
    let coupon;
    let users;
    const [FindCoupon, _] = await promisePool.query(
      "SELECT * FROM Coupons WHERE code = ?",
      [code]
    );

    if (FindCoupon.length == 0) {
      const [rows, _] = await promisePool.query(
        "SELECT coupons FROM `Users` WHERE id = ?",
        [JSON.parse(id)]
      );
      const coupons = rows[0].coupons;
      let coupon = coupons.find((coupon) => {
        return coupon.code == code;
      });

      if (coupon == undefined) {
        res.send(`
            <script>
            localStorage.setItem('disCount', '${JSON.stringify(DisCoupon)}')
            window.history.back();
            </script>
            `);
        return;
      }
      res.send(`
           <script>
           localStorage.setItem('disCount', '${JSON.stringify(coupon)}')
           window.history.back();
           </script>
           `);
      return;
    }
    let used = false;
    users = FindCoupon[0].usersUsed;
    if (users.length > 0) {
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (user !== id) {
          used = true;
          users.push(id);
          return;
        }
      }
    }
    users.push(id);
    coupon = { code: FindCoupon[0].code, value: FindCoupon[0].value };
    if (!used) {
      const [_, __] = await promisePool.query(
        "UPDATE Coupons SET usersUsed=? WHERE id=?",
        [JSON.stringify(users), id]
      );
      res.send(`
        <script>
        localStorage.setItem('disCount', '${JSON.stringify(coupon)}')
        window.history.back();
        </script>
        `);
      return;
    }
    res.send(`
        <script>
        localStorage.removeItem('disCount', '${JSON.stringify(coupon)}')
        window.history.back();
        </script>
        `);
  },
  SearchForProduct: async (req, res) => {
    const Searchquery = `%${req.body.search}%`;

    const [product, _] = await promisePool.query(
      "SELECT * FROM Products WHERE name LIKE ?",
      [Searchquery]
    );

    res.render("Product/search", {
      SearchedProduct: product,
      search: Searchquery,
    });
  },
  EditProduct: async (req, res) => {
    const body = req.body;
    const id = req.body.productId;
    switch (body) {
      case body.price !== undefined:
        const price = req.body.price;

        const [_1, __1] = await promisePool.query(
          "UPDATE `Products` SET `price` = ? WHERE `Products`.`id` = ?",
          [price, id]
        );
        break;
      case body.available !== undefined:
        const available = req.body.available;

        const [_2, __2] = await promisePool.query(
          "UPDATE `Products` SET `available` = ? WHERE `Products`.`id` = ?",
          [available, id]
        );
        break;
      case body.cate !== undefined:
        const cate = req.body.cate;

        const [_3, __3] = await promisePool.query(
          "UPDATE `Products` SET `category` = ? WHERE `Products`.`id` = ?",
          [cate, id]
        );
        break;
      case body.compony !== undefined:
        const compony = req.body.compony;

        const [_4, __4] = await promisePool.query(
          "UPDATE `Products` SET `compony` = ? WHERE `Products`.`id` = ?",
          [compony, id]
        );
        break;
      case body.stock !== undefined:
        const stock = req.body.stock;

        const [_5, __5] = await promisePool.query(
          "UPDATE `Products` SET `inStock` = ? WHERE `Products`.`id` = ?",
          [stock, id]
        );
        break;
      case body.buingPrice !== undefined:
        const buingPrice = req.body.buingPrice;

        const [_, __] = await promisePool.query(
          "UPDATE `Products` SET `buingPrice` = ? WHERE `Products`.`id` = ?",
          [buingPrice, id]
        );
        break;
    }
    res.send(
      `
          <script>
            window.history.back();
            location.reload();
          </script>
        `
    );
  },
  EditOffer: async (req, res) => {
    const { id, product } = req.body;

    const [_, __] = await promisePool.query(
      "UPDATE `Offer` SET `product` = ? WHERE `Offer`.`id` = ?",
      [product, id]
    );
    res.send(`
    <script>
      window.history.back();
      location.reload()
    </script>`);
  },
  AddToFavourite: async (req, res) => {
    const { user, product } = req.body;

    const [FavouriteList, __] = await promisePool.query(
      "SELECT * FROM `favourite` WHERE user=?",
      [user]
    );

    if (!FavouriteList.length > 0) {
      const [_, __] = await promisePool.query(
        "INSERT INTO `favourite` (`product`, `user`) VALUES (?, ?)",
        [product, user]
      );

      res.json({
        success: 1,
        msg: "تم حفظ المنتج في قائمة المفضلة",
        length: 1,
      });
      return;
    }
    const Product = FavouriteList.find((p) => {
      return p.id === parseInt(product);
    });

    if (Product !== undefined) {
      res.json({
        success: 0,
        msg: "المنتج موجود بالفعل في المفضلة",
      });
      return;
    }
    const [_, ___] = await promisePool.query(
      "INSERT INTO `favourite` (`product`, `user`) VALUES (?, ?)",
      [product, user]
    );

    const [countProducts, fields] = await promisePool.query(
      "SELECT COUNT(*) as Length FROM `favourite` WHERE user=?",
      [user]
    );
    const len = countProducts[0].Length;
    res.json({
      success: 1,
      msg: "تم حفظ المنتج في قائمة المفضلة",
      length: len,
    });
  },
  GetFavourite: async (req, res) => {
    const userId = req.params.user;
    const [rows, _] = await promisePool.query(
      "SELECT favourite.product, favourite.user, Products.name, Products.image, Products.price, Products.available, Products.id FROM favourite INNER JOIN Products ON favourite.product=Products.id WHERE user = ?;",
      [userId]
    );
    res.render("User/favourite.ejs", {
      products: rows,
      length: rows.length,
    });
  },
  DeleteFromFavourite: async (req, res) => {
    const { product, user, length } = req.body;

    const [_, __] = await promisePool.query(
      "DELETE FROM favourite	WHERE (product,user) = (?,?)",
      [product, user]
    );

    if (length !== "0") {
      res.send(`
    <script>
    location.replace('/fav/show/${user}')
    localStorage.setItem('favlist',${length})
    </script>
    `);
      return;
    }
    res.send(`
        <script>
        location.replace('/fav/show/${user}')
        localStorage.setItem('favlist',${JSON.parse(length) - 1})
        </script>
        `);
  },
  CheckProductInCartIsAvailable: async (req, res) => {
    const Products = req.body;
    const ProductsIds = [];
    for (let i = 0; i < Products.length; i++) {
      const p = Products[i];
      ProductsIds.push(p.id);
    }
    if (ProductsIds.length > 0) {
      const [IsAvailable, _] = await promisePool.query(
        "SELECT available, id FROM Products WHERE id IN (?) AND available = 0",
        [ProductsIds]
      );
      res.json({
        IsAvailable,
      });
      return;
    }

    res.json({
      IsAvailable: [],
    });
  },
};

module.exports = controller;
