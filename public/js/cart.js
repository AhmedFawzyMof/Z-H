var disCount;
if (localStorage.getItem("disCount")) {
  disCount = JSON.parse(localStorage.getItem("disCount"));
} else {
  disCount = {
    code: "",
    value: 0,
  };
}
var cart = JSON.parse(localStorage.getItem("cart"));

function CalContainer() {
  function getTotal() {
    var total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    if (disCount.value >= total) {
      return total;
    } else if (disCount.value !== 0) {
      return total - disCount.value;
    } else {
      return total;
    }
  }
  var countContainer = document.getElementById("countContainer");

  if (cart.length > 0) {
    countContainer.innerHTML = `
    <p>المجموع المنتجات: ${getTotal()}</p>
    <div id='auth'></div>
    `;

    var auth = document.getElementById("auth");
    auth.innerHTML = `
      <p class="checkoutBtn"><button id="show1" onclick="CheckOrder45('cash')">الدفع عند الاستلام</button></p>
      <p class="checkoutBtn"><button id="show2" onclick="CheckOrder45('creditcard')">بالكارت عند الاستلام</button></p>
    `;
    if (localStorage.getItem("Token") !== "noToken") {
      auth.innerHTML += `<p class="checkoutBtn"><button id="show3" onclick="CheckOrder45('cashback')">من رصيد كاش باك</button></p>`;
    }
  } else {
    countContainer.innerHTML = `<img  id='emptyCart' src='/img/cart.png'/><a id="goToShop" href="/">اذهب للتسوق</a>`;
  }
  return true;
}

function Items() {
  var Container = document.getElementById("container");

  var ItemsInCart = cart
    .map(function (item, index) {
      function IsNameLong() {
        if (item.name.length > 35) {
          return item.name.substr(0, 20) + "...";
        } else {
          return item.name;
        }
      }
      IsNameLong();
      return `<div class="cart" key="${index + 1}">
                <img src="${item.image}">
                <div class="info">
                 <a href="/product/show/${item.id}"><p>${IsNameLong()}</p></a>
                  <p>${item.price} ج</p>
                  <p>${item.price * item.quantity} ج</p>
                </div>
                <div class="quantity">
                  <button onclick="incQuantity(${
                    item.id
                  }, ${item.quantity + 1})"><i class="bx bx-plus"></i></button>
                  <p>${item.quantity}</p>
                  <button onclick="dicQuantity(${
                    item.id
                  })"><i class="bx bx-minus"></i></button>
                </div>
                <button onclick="removeItemFormCart(${
                  item.id
                })" class="removeBtn"><i class="bx bxs-x-circle"></i></button>
          </div>
  `;
    })
    .join("");
  Container.innerHTML = ItemsInCart;
  return true;
}
async function checkForP() {
  const chekIfProductAvalabil = await fetch("/check/products", {
    method: "post",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify(cart),
  });
  const res = await chekIfProductAvalabil.json();
  const products = res.isItAva;
  for (let i = 0; i < products.length; i++) {
    const product_id = products[i].id;
    var newCart = [];
    for (var j = 0; j < cart.length; j++) {
      if (parseInt(cart[j].id) !== product_id) {
        newCart.push(cart[j]);
      }
    }
    localStorage.setItem("cart", JSON.stringify(newCart));

    location.reload();
  }
}

function removeItemFormCart(productId) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (parseInt(cart[i].id) !== productId) {
      newCart.push(cart[i]);
    }
  }
  localStorage.setItem("cart", JSON.stringify(newCart));

  location.reload();
}

function incQuantity(productId, quantity) {
  for (var i = 0; i < cart.length; i++) {
    var product = cart[i];
    if (product.id == productId) {
      if (product.inStock == product.quantity) {
        product.quantity != quantity;
      } else {
        product.quantity = quantity;
        Items();
        CalContainer();
      }
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function dicQuantity(productId) {
  for (var i = 0; i < cart.length; i++) {
    var product = cart[i];
    if (product.id == productId) {
      if (product.quantity !== 1) {
        product.quantity -= 1;
        Items();
        CalContainer();
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
function CheckOrder45(method) {
  function getTotal() {
    var total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    if (disCount.value >= total) {
      return total;
    } else if (disCount.value !== 0) {
      return total - disCount.value;
    } else {
      return total;
    }
  }
  var showError = document.querySelector(".message");
  var closeError = document.getElementById("close");
  closeError.addEventListener("click", function () {
    showError.classList.remove("active");
  });
  if (getTotal() >= 45) {
    showError.classList.remove("active");
    if (method === "cash") {
      location.replace("/pay/info/cash_on_delivery");
    } else if (method === "creditcard") {
      location.replace("/pay/info/creditcard_on_delivery");
    } else {
      location.replace("/pay/info/cashback/".concat(JSON.parse(token)));
    }
  } else {
    showError.classList.add("active");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  if (cart.length == 0) {
    var checkoutContainer = document.getElementById("checkoutContainer");
    checkoutContainer.style.height = "100vh";
    var container = document.getElementById("countContainer");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.flexDirection = "column";
  }
});
