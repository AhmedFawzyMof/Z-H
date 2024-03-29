"use strict";

function FavLen() {
  var length;
  var favList = document.getElementById("favIcon");
  var faLength = document.createElement("span");
  favList.appendChild(faLength);
  if (localStorage.getItem("favlist")) {
    length = localStorage.getItem("favlist");
  } else {
    length = 0;
  }
  favList.style.position = "relative";
  faLength.innerText = length;
  faLength.style = "display: flex;\n      position: absolute;\n      background: rgb(255, 151, 31);\n      color: rgb(255, 255, 255);\n      width: 25px;\n      height: 25px;\n      border-radius: 5px;\n      font-weight: 700;\n      top: -7.5px;\n      align-items: center;\n      justify-content: center;\n     right: -7.5px;\n     font-size: 15px;";
}
var MenuBtn = document.getElementById("menu");
var MenuBar = document.getElementById("menuBar");
var CartLength = document.getElementById("cartLength");
function preventScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
MenuBtn.addEventListener("click", function () {
  MenuBar.classList.toggle("active");
  if (MenuBar.classList.contains("active")) {
    MenuBar.style.transform = "translateX(-5px)";
    // To get the scroll position of current webpage
    var TopScroll = window.pageYOffset || document.documentElement.scrollTop;
    var LeftScroll = window.pageXOffset || document.documentElement.scrollLeft;
    // if scroll happens, set it to the previous value
    window.onscroll = function () {
      window.scrollTo(LeftScroll, TopScroll);
    };
  } else {
    MenuBar.style.transform = "translateX(105%)";
    window.onscroll = function () {};
  }
});
var token = JSON.stringify(localStorage.getItem("Token"));
var parsedToken = JSON.parse(token);
var cart = JSON.parse(localStorage.getItem("cart"));
function cartLen() {
  if (cart.length > 0) {
    CartLength.style.display = "flex";
    CartLength.style.position = "absolute";
    CartLength.style.background = "#ff971f";
    CartLength.style.color = "#fff";
    CartLength.style.width = "20px";
    CartLength.style.height = "25px";
    CartLength.style.borderRadius = "5px";
    CartLength.style.fontWeight = "700";
    CartLength.style.top = "-7.5px";
    CartLength.style.alignItems = "center";
    CartLength.style.justifyContent = "center";
    CartLength.style.left = "20px";
    CartLength.innerHTML = cart.length;
  } else {
    CartLength.style.display = "none";
  }
}
var fav = document.getElementById("favIcon");
function IsLogedIn() {
  fav.href = "/fav/show/" + JSON.parse(token);
  if (localStorage.getItem("Token") === "noToken") {
    fav.style.display = "none";
    MenuBar.innerHTML = "\n    <li><a style=\"color: #fff; text-decoration: none\" href=\"/\" >\u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</a></li>\n    <li><a style=\"color: #fff; text-decoration: none\" href=\"/zh/info/contact_us\">\u0627\u062A\u0635\u0644 \u0628\u0646\u0627</a></li>\n    <li><a style=\"color: #fff; text-decoration: none\" href=\"/zh/info/about\">\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0646\u0627</a></li>\n    <li><a style=\"color: #fff; text-decoration: none\" href=\"/zh/feed/back\">\u0627\u0644\u0634\u0643\u0648\u0649</a></li>\n    ";
  } else {
    var TheCoupon = localStorage.getItem("coupon");
    MenuBar.innerHTML = "\n  <li style=\"position:relative;\">\n    <a\n      href=\"/show/coupon/".concat(parsedToken, "\"\n      style=\"color: #fff; text-decoration: none\"\n    >\n      \u0627\u0644\u0642\u0633\u0627\u0626\u0645\n    </a>\n    <div\n      id=\"userInfo\">\n    </div>\n  </li>\n  <li>\n    <a href=\"/\" style=\"color: #fff; text-decoration: none\">\n      \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629\n    </a>\n  </li>\n  <li>\n    <a\n      href=\"/user/info/o_h/").concat(parsedToken, "\"\n      style=\"color: #fff; text-decoration: none\"\n    >\n      \u0633\u062C\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\n    </a>\n  </li>\n  <li>\n    <a href=\"/zh/info/contact_us\" style=\"color: #fff; text-decoration: none\">\n      \u0627\u062A\u0635\u0644 \u0628\u0646\u0627\n    </a>\n  </li>\n  <li>\n    <a href=\"/zh/info/about\" style=\"color: #fff; text-decoration: none\">\n      \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0646\u0627\n    </a>\n  </li>\n  <li>\n    <a\n      href=\"/zh/info/cashback/").concat(parsedToken, "\"\n      style=\"color: #fff; text-decoration: none\"\n    >\n      \u0631\u0635\u064A\u062F \u0643\u0627\u0634 \u0628\u0627\u0643\n    </a>\n  </li>\n  <li><a href=\"/zh/feed/back\" style=\"color: #fff; text-decoration: none\">\u0627\u0644\u0634\u0643\u0648\u0649</a></li>\n  ");
    if (TheCoupon !== "0") {
      var coupons = document.querySelectorAll("#userInfo");
      coupons.forEach(function (coupon) {
        coupon.style.display = "flex";
        coupon.style.position = "absolute";
        coupon.style.background = "#ff971f";
        coupon.style.color = "#fff";
        coupon.style.width = "20px";
        coupon.style.height = "25px";
        coupon.style.borderRadius = "5px";
        coupon.style.fontWeight = "700";
        coupon.style.top = "-7.5px";
        coupon.style.alignItems = "center";
        coupon.style.justifyContent = "center";
        coupon.style.left = "0px";
        coupon.innerText = TheCoupon;
      });
    }
    if (localStorage.getItem("State") === "1") {
      MenuBar.innerHTML += "\n      <li><a style=\"color: #fff; text-decoration: none\"\n      href=\"/user/info/admin/".concat(parsedToken, "\">\u0635\u0641\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629</a></li>\n      ");
    } else {
      adPage.style.display = "none";
    }
  }
}
var menu = document.getElementById("menuBar");
var isDragStartMenu = false,
  prevPageXMenu,
  prevScrollLeftMenu,
  positionDiffMenu;
var scrollWidthMenu = menu.scrollWidth - menu.clientWidth;
var dragStartMenu = function dragStartMenu(e) {
  isDragStartMenu = true;
  prevPageXMenu = e.pageX || e.touches[0].pageX;
  prevScrollLeftMenu = menu.scrollLeft;
};
var draggingMenu = function draggingMenu(e) {
  if (!isDragStartMenu) return;
  e.preventDefault();
  menu.classList.add("dragging");
  positionDiffMenu = (e.pageX || e.touches[0].pageX) - prevPageXMenu;
  menu.scrollLeft = prevScrollLeftMenu - positionDiffMenu;
  var positionLeft = JSON.stringify(positionDiffMenu) + "px";
  console.log(menu.style.transform = "translateX(".concat(positionLeft, ")"));
  if (positionDiffMenu >= 175) {
    menu.style.transform = "translateX(105%)";
    menu.classList.remove("active");
    window.onscroll = function () {};
  } else if (positionDiffMenu <= 0) {
    menu.style.transform = "translateX(-5px)";
    dragStopMenu();
  }
};
var dragStopMenu = function dragStopMenu() {
  isDragStartMenu = false;
  menu.classList.remove("dragging");
};
menu.addEventListener("touchstart", dragStartMenu);
menu.addEventListener("touchmove", draggingMenu);
menu.addEventListener("touchend", dragStopMenu);
if (localStorage.getItem("POPUP")) {
  var POP = parseInt(localStorage.getItem("POPUP"));
  var hour = new Date().getHours();
  if (POP !== hour) {
    localStorage.removeItem("POPUP");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  IsLogedIn(), FavLen();
});