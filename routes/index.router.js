const express = require("express");
const router = express.Router();
const cache = require("../routerCache");
const CategoryController = require("../controller/Category.controller");
const ProductController = require("../controller/Product.controller");
const UserController = require("../controller/User.controller");
const OrderController = require("../controller/Order.controller");
const AdminController = require("../controller/Admin.controller");
const SubcategoryController = require("../controller/SubCategory.controller");
//? GET {
router.get("/", CategoryController.getAll);
router.get("/:subcategory", cache(150), CategoryController.getProducts);
router.get("/product/show/:id", cache(150), ProductController.getOne);
router.get("/cart/show/items", ProductController.getCart);
router.get("/fav/show/:user", cache(150), ProductController.getfav);
router.get("/user/info/login", UserController.getLogin);
// router.get("/zh/info/share", SubcategoryController.share);
router.get("/zh/info/about", cache(150), UserController.about);
router.get("/zh/info/contact_us", cache(150), UserController.contactus);
router.get("/user/info/register", UserController.getRegister);
router.get("/pay/info/cash_on_delivery", OrderController.getCash);
router.get("/users/info/terms", UserController.getTerms);
router.get("/users/info/delete", UserController.getDelUser);
// router.get("/pay/info/credit_card", OrderController.getCreditCard);
router.get("/pay/info/success", OrderController.getSuccess);
router.get("/user/info/admin/:admin", AdminController.getAdmin);
router.get("/admin/panle/contact/:admin", AdminController.getContactUs);
router.get(
  "/user/info/o_h/:userId",
  cache(150),
  OrderController.getOrderHistory
);
router.get("/user/info/profile/:userId", cache(150), UserController.getProfile);
router.get("/admin/panle/users/:admin", AdminController.getUser);
router.get("/admin/panle/offer/:admin", AdminController.getOffer);
router.get("/admin/panle/products/:admin", AdminController.getProducut);
router.get("/admin/panle/categorys/:admin", AdminController.getCategory);
router.get("/admin/panle/subcategorys/:admin", AdminController.getSubCategory);
router.get("/admin/panle/orders/:admin", AdminController.getOrders);
router.get("/info/contact_us/success", UserController.contact_success);
router.get("/order/info/admin/:admin/:order", AdminController.orderPage);
router.get("/show/coupon/:user", UserController.getCouponsPage);
//? }
//? POST {
router.get("/contact", UserController.contact);
router.post("/share/link", UserController.makeRef);
router.get("/paypal", OrderController.postPaypal);
router.post("/login", UserController.Login);
router.post("/getcoupon", UserController.getCoupon);
router.post("/register", UserController.Register);
router.post("/order", OrderController.addOne);
router.post("/sub/categories", CategoryController.getProductsByCate);
router.post("/search", ProductController.searchProduct);
router.post("/search/users", AdminController.searchUsers);
router.post("/search/product", AdminController.searchProduct);
router.post("/search/subcategory", ProductController.searchProduct);
router.post("/search/orders", AdminController.searchOrders);
router.post("/add/category", CategoryController.addOne);
router.post("/add/subcategory", SubcategoryController.addOne);
router.post("/contact", UserController.contact);
router.post("/add/product", ProductController.addOne);
router.post("/filter/product", AdminController.filterProduct);
router.post("/add/to/offer", ProductController.addOffer);
router.post("/get/promocode", ProductController.getCode);
router.post("/categories", CategoryController.getCategory);
router.post("/favourite", ProductController.fav);
//? }
//? DELETE {
router.post("/delete/user", AdminController.deleteUser);
router.post("/delUser", UserController.delUser);
router.post("/delete/order", AdminController.deleteOrder);
router.post("/delete/category", AdminController.deleteCategory);
router.post("/delete/subcategory", AdminController.deleteSubcategory);
router.post("/delete/product", AdminController.deleteProduct);
router.post("/delete/offer", AdminController.deleteOffer);
router.post("/delete/fav", ProductController.deleteFav);
//? }
//? EDIT {
router.post("/edit/user", UserController.editManger);
router.post("/edit/order/delivered", OrderController.editDelivered);
router.post("/edit/order/paid", OrderController.editPaid);
router.post("/edit/category", CategoryController.editCategory);
router.post("/edit/profile", UserController.editProfile);
router.post("/edit/subcategory", SubcategoryController.editSubcategory);
router.post("/edit/product", ProductController.editProduct);
router.post("/edit/offer", ProductController.editOffer);
router.post("/edit/promocode", ProductController.editPromo);
router.post("/seen", AdminController.seen);
//? }
module.exports = router;
