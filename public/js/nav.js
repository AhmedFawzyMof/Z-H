function FavLen() {
  let length;
  const favList = document.getElementById("favIcon");
  const faLength = document.createElement("span");
  favList.appendChild(faLength);
  if (localStorage.getItem("favlist")) {
    length = localStorage.getItem("favlist");
  } else {
    length = 0;
  }
  favList.style.position = "relative";
  faLength.innerText = length;
  faLength.style = `display: flex;
      position: absolute;
      background: rgb(255, 151, 31);
      color: rgb(255, 255, 255);
      width: 25px;
      height: 25px;
      border-radius: 5px;
      font-weight: 700;
      top: -7.5px;
      align-items: center;
      justify-content: center;
     right: -7.5px;
     font-size: 15px;`;
}
const MenuBtn = document.getElementById("menu");
const MenuBar = document.getElementById("menuBar");
const CartLength = document.getElementById("cartLength");

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
const fav = document.getElementById("favIcon");

function IsLogedIn() {
  fav.href = "/fav/show/" + JSON.parse(token);
  if (localStorage.getItem("Token") === "noToken") {
    fav.style.display = "none";
    MenuBar.innerHTML = `
    <li><a style="color: #fff; text-decoration: none" href="/" >الصفحة الرئيسية</a></li>
    <li><a style="color: #fff; text-decoration: none" href="/zh/info/contact_us">اتصل بنا</a></li>
    <li><a style="color: #fff; text-decoration: none" href="/zh/info/about">معلومات عنا</a></li>
    <li><a style="color: #fff; text-decoration: none" href="/zh/feed/back">الشكوى</a></li>
    `;
  } else {
    var TheCoupon = localStorage.getItem("coupon");
    MenuBar.innerHTML = `
  <li style="position:relative;">
    <a
      href="/show/coupon/${parsedToken}"
      style="color: #fff; text-decoration: none"
    >
      القسائم
    </a>
    <div
      id="userInfo">
    </div>
  </li>
  <li>
    <a href="/" style="color: #fff; text-decoration: none">
      الصفحة الرئيسية
    </a>
  </li>
  <li>
    <a
      href="/user/info/o_h/${parsedToken}"
      style="color: #fff; text-decoration: none"
    >
      سجل الطلبات
    </a>
  </li>
  <li>
    <a href="/zh/info/contact_us" style="color: #fff; text-decoration: none">
      اتصل بنا
    </a>
  </li>
  <li>
    <a href="/zh/info/about" style="color: #fff; text-decoration: none">
      معلومات عنا
    </a>
  </li>
  <li>
    <a
      href="/zh/info/cashback/${parsedToken}"
      style="color: #fff; text-decoration: none"
    >
      رصيد كاش باك
    </a>
  </li>
  <li><a href="/zh/feed/back" style="color: #fff; text-decoration: none">الشكوى</a></li>
  `;
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
      MenuBar.innerHTML += `
      <li><a style="color: #fff; text-decoration: none"
      href="/user/info/admin/${parsedToken}">صفحة الإدارة</a></li>
      `;
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
  console.log((menu.style.transform = "translateX(".concat(positionLeft, ")")));
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
