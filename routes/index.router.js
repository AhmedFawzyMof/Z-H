const express = require("express");
const router = express.Router();
const cache = require("../routerCache");
const CategoryController = require("../controller/Categories.controller");
const ProductController = require("../controller/Products.controller");
const UserController = require("../controller/Users.controller");
const OtherController = require("../controller/Other.controller");
const OrderController = require("../controller/Orders.controller");
const AdminController = require("../controller/Admin.controller");
const CompanyController = require("../controller/Company.controller");
const validate = require("../helper/Validate");

//? GET {
router.get("/", cache(150), CategoryController.GetAllCompanies);
router.get("/get/newOrders", AdminController.getNew);
router.get("/:subcategory", cache(150), CategoryController.GetProducts);
router.get("/product/show/:id", cache(150), ProductController.ProductById);
router.get("/zh/feed/back", cache(150), OtherController.getfeedback);
router.get("/cart/show/items", OtherController.getCart);
router.get("/fav/show/:user", ProductController.GetFavourite);
router.get("/zh/info/cashback/:user", validate, Controller.CashBackBlance);
router.get("/zh/info/about", OtherController.about);
router.get("/zh/info/contact_us", OtherController.contactus);
router.get("/pay/info/cash_on_delivery", OtherController.getCash);
router.get("/pay/info/creditcard_on_delivery", OtherController.getCreditCard);
router.get("/pay/info/cashback/:user", OtherController.getCashBack);
router.get("/users/info/terms", OtherController.getTerms);
router.get("/users/info/delete", OtherController.getDelUser);
router.post("/check/products", ProductController.CheckProductInCartIsAvailable);
router.get("/pay/info/success", OtherController.getSuccess);
router.get("/user/info/admin/:admin", AdminController.getAdmin);
router.get("/admin/panle/contact/:admin", AdminController.getContactUs);
router.get("/user/info/o_h/:userId", OrderController.OrderHistory);
router.get("/admin/panle/users/:admin", AdminController.getUser);
router.get("/admin/panle/offer/:admin", AdminController.getOffer);
router.get("/admin/panle/totalSales/:admin", AdminController.getTotalSales);
router.get("/admin/panle/products/:admin", AdminController.getProducut);
router.get("/admin/panle/categorys/:admin", AdminController.getCategory);
router.get("/admin/panle/subcategorys/:admin", AdminController.getSubCategory);
router.get("/admin/panle/orders/:admin", AdminController.getOrders);
router.get("/info/contact_us/success", OtherController.contact_success);
router.get("/order/info/admin/:admin/:order", AdminController.orderPage);
router.get("/show/coupon/:user", validate, UserController.UserCoupons);
//? }
//? POST {
router.get("/contact", OtherController.contact);
router.post("/getcoupon", UserController.GetCoupons);
router.post("/order", OrderController.Order);
router.post("/sub/categories", CategoryController.GetProductsByCategory);
router.post("/search", ProductController.SearchForProduct);
router.post("/search/users", AdminController.searchUsers);
router.post("/search/product", AdminController.searchProduct);
router.post("/search/subcategory", ProductController.SearchForProduct);
router.post("/search/orders", AdminController.searchOrders);
router.post("/add/category", CategoryController.AddCategory);
router.post("/add/subcategory", CompanyController.AddCompany);
router.post("/contact", OtherController.contact);
router.post("/add/product", ProductController.AddProduct);
router.get("/filter/product/:token/:compony", AdminController.filterProduct);
router.post("/add/to/offer", ProductController.AddOffer);
router.post("/categories", CategoryController.GetCategories);
router.post("/favourite", ProductController.AddToFavourite);
//? }
//? DELETE {
router.post("/delete/user", AdminController.deleteUser);
router.post("/delete/order", AdminController.deleteOrder);
router.post("/delete/category", AdminController.deleteCategory);
router.post("/delete/subcategory", AdminController.deleteSubcategory);
router.post("/delete/product", AdminController.deleteProduct);
router.post("/delete/offer", AdminController.deleteOffer);
router.post("/delete/fav", ProductController.DeleteFromFavourite);
//? }
//? EDIT {
router.post("/edit/user", UserController.EditUser);
router.post("/edit/order/delivered", OrderController.Delivered);
router.post("/edit/order/paid", OrderController.Paid);
router.post("/edit/order", OrderController.EditOrder);
router.post("/edit/category", CategoryController.EditCategories);
router.post("/edit/subcategory", CompanyController.EditCompany);
router.post("/edit/product", ProductController.EditProduct);
router.post("/edit/offer", ProductController.EditOffer);
router.post("/seen", AdminController.seen);
//? }
module.exports = router;
