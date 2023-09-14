"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it =
    (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var disCount;
if (localStorage.getItem("disCount")) {
  disCount = JSON.parse(localStorage.getItem("disCount"));
} else {
  disCount = {
    code: "",
    value: 0,
  };
}
function calContainer() {
  function getTotal() {
    var temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });
    var sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);
    var total = sum - disCount.value;
    if (total < 0) {
      total = sum;
    } else if (total == NaN) {
      total = sum;
    }
    return total;
  }
  function getItems() {
    var temp = cart
      .map(function (item) {
        return item.name + "  ";
      })
      .join("");
    return temp;
  }
  function ShipingPrice() {
    var shiping = 20;
    return shiping;
  }
  if (cart.length) {
    var countContainer = document.getElementById("countContainer");
    countContainer.innerHTML =
      "\n        <p>\u0627\u0644\u0645\u062C\u0645\u0648\u0639: "
        .concat(
          getTotal(),
          " \u062C</p> \n        <p>\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A: ( "
        )
        .concat(
          getItems(),
          " )</p>\n        <p>\u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646: "
        )
        .concat(
          ShipingPrice(),
          " \u062C</p>\n        <div id='auth'></div>\n        "
        );
    var auth = document.getElementById("auth");
    if (localStorage.getItem("Token") === "noToken") {
      auth.innerHTML =
        "<p> \u0645\u0646 \u0641\u0636\u0644\u0643 \u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0645\u0648\u0627\u0635\u0644\u0629 <a href='/user/info/login'>\u0627\u0644\u0634\u0631\u0627\u0621</a> </p>";
    } else {
      return (auth.innerHTML =
        "\n      <p class='checkoutBtn'><button id='show1' onclick=\"CheckOrder45('cash')\">\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645</button></p>\n      <p class='checkoutBtn'><button id='show2' onclick=\"CheckOrder45('creditcard')\">\u0628\u0627\u0644\u0643\u0627\u0631\u062A \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645</button></p>\n      <p class='checkoutBtn'><button id='show3' onclick=\"CheckOrder45('cashback')\">\u0645\u0646 \u0631\u0635\u064A\u062F \u0643\u0627\u0634 \u0628\u0627\u0643</button></p>\n      ");
    }
  } else {
    var _countContainer = document.getElementById("countContainer");
    _countContainer.innerHTML =
      "<img  id='emptyCart' src='/img/cart.png'/> <a id='goToShop' href='/'>\u0627\u0630\u0647\u0628 \u0644\u0644\u062A\u0633\u0648\u0642</a>";
  }
}
function cartItems() {
  var Container = document.getElementById("container");
  var mappedItems = cart
    .map(function (item, index) {
      return '\n          <div class="cart" key='
        .concat(index, ">\n                <img src='")
        .concat(
          item.image,
          "'>\n                <div class='info'>\n                 <a href=\"/product/show/"
        )
        .concat(item.id, '" ><p>')
        .concat(item.name.substr(0, 25), "</p></a>\n                  <p>")
        .concat(item.price, " \u062C</p>\n                  <p>")
        .concat(
          item.price * item.quantity,
          ' \u062C</p>\n                </div>\n                <div class="quantity">\n                  <button onclick="incQuantity('
        )
        .concat(item.id, ", ")
        .concat(
          item.quantity + 1,
          ")\" ><i class='bx bx-plus'></i></button>\n                  <p>"
        )
        .concat(
          item.quantity,
          "</p>\n                  <button onclick='dicQuantity("
        )
        .concat(
          item.id,
          ")'><i class='bx bx-minus' ></i></button>\n                </div>\n                <button onclick='removeItemFormCart("
        )
        .concat(
          item.id,
          ")' class='removeBtn'><i class='bx bxs-x-circle'></i></button>\n          </div>"
        );
    })
    .join("");
  Container.innerHTML = mappedItems;
}
function removeItemFormCart(productId) {
  var temp = cart.filter(function (item) {
    return item.id != productId;
  });
  localStorage.setItem("cart", JSON.stringify(temp));
  location.reload();
}
function incQuantity(productId, quantity) {
  var _iterator = _createForOfIteratorHelper(cart),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var product = _step.value;
      if (product.id == productId) {
        if (product.inStock == product.quantity) {
          product.quantity != quantity;
        } else {
          product.quantity = quantity;
          cartItems();
          calContainer();
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
function dicQuantity(productId) {
  var _iterator2 = _createForOfIteratorHelper(cart),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      var product = _step2.value;
      if (product.id == productId) {
        if (product.quantity !== 1) {
          product.quantity -= 1;
          cartItems();
          calContainer();
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
function CheckOrder45(method) {
  function getTotal() {
    var temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });
    var sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);
    var total = sum - disCount.value;
    if (total < 0) {
      total = sum;
    } else if (total == NaN) {
      total = sum;
    }
    return total;
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
