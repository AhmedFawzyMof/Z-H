function favLength() {
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

MenuBtn.addEventListener("click", function () {
  MenuBar.classList.toggle("active");
  if (MenuBar.classList.contains("active")) {
    MenuBar.style.transform = "translateX(-5px)";
  } else {
    MenuBar.style.transform = "translateX(105%)";
  }
});
let token = JSON.stringify(localStorage.getItem("Token"));
let parsedToken = JSON.parse(token);

let cart = JSON.parse(localStorage.getItem("cart"));
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
function logedUser() {
  if (navigator.onLine) {
    console.log("online");
  }

  window.addEventListener("online", () => {
    location.reload();
  });

  window.addEventListener("offline", () => {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.href = "#";
    });
  });

  fav.href = "/fav/show/" + JSON.parse(token);
  if (localStorage.getItem("Token") === "noToken") {
    fav.style.display = "none";
    MenuBar.innerHTML = `    <li
 
>
  <a href="/" style="color: #fff; text-decoration: none">الصفحة الرئيسية</a>
</li>
<li
>
  <a href="/zh/info/contact_us" style="color: #fff; text-decoration: none"
    >اتصل بنا</a
  >
</li>
<li
>
  <a href="/zh/info/about" style="color: #fff; text-decoration: none"
    >معلومات عنا</a
  >
</li>
<li
>
  <a href="/user/info/login" style="color: #fff; text-decoration: none"
    >تسجيل الدخول</a
  >
</li>`;
  } else {
    MenuBar.innerHTML = `
    <li 
><a href="/user/info/profile/${parsedToken}" style="color: #fff; text-decoration: none"
>الملف الشخصي</a
>
</li>
<li style="position:relative;"
>
  <a href="/show/coupon/${parsedToken}" style="color: #fff; text-decoration: none">القسائم</a>
  <div id="userInfo" ></div>
  </li>
<li
>
  <a href="/" style="color: #fff; text-decoration: none">الصفحة الرئيسية</a>
</li>
<li
><a href="/user/info/o_h/${parsedToken}" style="color: #fff; text-decoration: none"
>سجل الطلبات</a
>
</li>
<li
>
  <a href="/zh/info/contact_us" style="color: #fff; text-decoration: none"
    >اتصل بنا</a
  >
</li>
<li
>
  <a href="/zh/info/about" style="color: #fff; text-decoration: none"
    >معلومات عنا</a
  >
</li>
<li
>
  <a href="/zh/info/cashback/${parsedToken}" style="color: #fff; text-decoration: none"
    >رصيد كاش باك</a
  >
</li>
<li
>
<button onclick='logout()' style="color: #fff;   background: none;
cursor: pointer;  border: none; font-size:15px;"
  >تسجيل خروج</button
>
</li>

<li
id="adPage"

>
</li>`;

    const TheCoupon = localStorage.getItem("coupon");
    if (TheCoupon !== "0") {
      const coupons = document.querySelectorAll("#userInfo");
      coupons.forEach((coupon) => {
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
  }
  if (localStorage.getItem("State") === "1") {
    const adPage = document.getElementById("adPage");
    adPage.innerHTML = `<a href='/user/info/admin/${parsedToken}' style="color: #fff; text-decoration: none">صفحة الإدارة</a>`;
  } else {
    const adPage = document.getElementById("adPage");
    adPage.style.display = "none";
  }
}

function logout() {
  localStorage.setItem("cart", "[]");
  localStorage.setItem("Token", "noToken");
  localStorage.setItem("State", "noState");
  localStorage.removeItem("coupon");
  location.replace("/");
}

document.addEventListener("DOMContentLoaded", () => {
  logedUser(), favLength();
});

const menu = document.getElementById("menuBar");
let isDragStartMenu = false,
  prevPageXMenu,
  prevScrollLeftMenu,
  positionDiffMenu;

let scrollWidthMenu = menu.scrollWidth - menu.clientWidth;

const dragStartMenu = (e) => {
  isDragStartMenu = true;
  prevPageXMenu = e.pageX || e.touches[0].pageX;
  prevScrollLeftMenu = menu.scrollLeft;
};

const draggingMenu = (e) => {
  if (!isDragStartMenu) return;
  e.preventDefault();
  menu.classList.add("dragging");
  positionDiffMenu = (e.pageX || e.touches[0].pageX) - prevPageXMenu;
  menu.scrollLeft = prevScrollLeftMenu - positionDiffMenu;
  let positionLeft = JSON.stringify(positionDiffMenu) + "px";
  console.log((menu.style.transform = `translateX(${positionLeft})`));
  if (positionDiffMenu >= 175) {
    menu.style.transform = `translateX(105%)`;
    menu.classList.remove("active");
  } else if (positionDiffMenu <= 0) {
    menu.style.transform = "translateX(-5px)";
    dragStopMenu();
  }
};

const dragStopMenu = () => {
  isDragStartMenu = false;
  menu.classList.remove("dragging");
};

menu.addEventListener("touchstart", dragStartMenu);
menu.addEventListener("touchmove", draggingMenu);
menu.addEventListener("touchend", dragStopMenu);
