"use strict";

if (localStorage.getItem("Token") === "noToken") {
  location.replace("/");
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
    var total;
    if (disCount.code === "cashback") {
      if (disCount.value > sum) {
        var left = disCount.value - sum;
        total = 0;
        amount.value = disCount.value - left;
      } else {
        total = sum - disCount.value;
        amount.value = disCount.value;
      }
    } else {
      total = sum - disCount.value;
    }
    if (total == NaN) {
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
    var Thelocation = document.getElementById("location");
    var TheCity = document.getElementById("theCity").value;
    var shiping = 0;

    if (Thelocation.value !== "الفرع") {
      if (TheCity === "الشروق") {
        shiping = 20;
      } else {
        shiping = 40;
      }
    } else {
      shiping = 0;
    }
    return shiping;
  }
  function promoCode() {
    if (location.pathname.includes("/pay/info/cashback")) {
      return "";
    } else {
      return '\n        <form action="/get/promocode" method="post" id="promocode">\n          <input type="hidden" name="id" value=\''.concat(
        token,
        '\' />\n          <input type="text" name="code" placeholder="\u0643\u0648\u062F \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A" />\n          <button type="submit">\u0643\u0648\u062F \u0627\u0644\u062A\u0631\u0648\u064A\u062C\u064A</button>\n        </form>\n      '
      );
    }
  }
  if (cart.length) {
    var countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = "\n         "
      .concat(
        promoCode(),
        "\n          <p>\u0627\u0644\u0645\u062C\u0645\u0648\u0639: "
      )
      .concat(
        getTotal(),
        " \u062C</p> \n          <p>\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A: ( "
      )
      .concat(
        getItems(),
        " )</p>\n          <p>\u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646: "
      )
      .concat(ShipingPrice(), " \u062C</p>\n          ");
  } else {
    var _countContainer = document.getElementById("countContainer");
    _countContainer.innerHTML =
      "<p style=\"\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%,-50%);\n        background: #fff;\n        padding: 5px;\n        width: 95%;\n        display:flex;\n        align-items: center;\n        justify-content: center;\n        text-transform: capitalize;\n        border-radius: 5px;\n        \">\u0639\u0631\u0628\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629 <a href='/' style='margin-left: 5px;\n    text-decoration: none;\n    color: #2660ff;'> \u0627\u0630\u0647\u0628 \u0644\u0644\u062A\u0633\u0648\u0642</a> </p>";
  }
}
var myForm = document.getElementById("order");
function ShipingPrice() {
  var TheCity = document.getElementById("theCity").value;
  var shiping = 0;
  if (TheCity === "الشروق") {
    shiping = 20;
  } else {
    shiping = 40;
  }
  return shiping;
}
function getTotal() {
  var temp = cart.map(function (item) {
    return parseFloat(item.price * item.quantity);
  });
  var sum = temp.reduce(function (prev, next) {
    return prev + next;
  }, 0);
  var total;
  if (disCount.code === "cashback") {
    if (disCount.value > sum) {
      var left = disCount.value - sum;
      total = 0;
      amount.value = disCount.value - left;
    } else {
      total = sum - disCount.value;
      amount.value = disCount.value;
    }
  } else {
    total = sum - disCount.value;
  }
  if (total < 0) {
    total = sum;
  } else if (total == NaN) {
    total = sum;
  }
  return total;
}

function notShrouk() {
  calContainer();
  ShipingPrice();
}
function addToOrder() {
  var OrderForm = document.getElementById("order");
  var tokenInp = document.createElement("input");
  tokenInp.type = "hidden";
  tokenInp.name = "user";
  tokenInp.value = JSON.parse(token);
  var cartInp = document.createElement("input");
  cartInp.type = "hidden";
  cartInp.name = "cart";
  cartInp.value = JSON.stringify(cart);
  var disCountInp = document.createElement("input");
  disCountInp.type = "hidden";
  disCountInp.name = "discount";
  disCountInp.value = JSON.stringify(disCount);
  var totalInp = document.createElement("input");
  totalInp.type = "hidden";
  totalInp.name = "total";
  totalInp.value = JSON.parse(getTotal() + ShipingPrice());
  OrderForm.append(totalInp);
  console.log(totalInp.value);
  OrderForm.append(tokenInp);
  OrderForm.append(cartInp);
  OrderForm.append(disCountInp);
}
function getLoc() {
  var Thelocation = document.getElementById("location");
  var loc = document.querySelector(".location");
  var st = document.getElementById("st");
  var bu = document.getElementById("bu");
  var fo = document.getElementById("fo");

  if (Thelocation.value === "الفرع") {
    var TheCity = document.getElementById("theCity");
    TheCity.value = "الشروق";
    loc.outerHTML =
      '<div class="location"><i class="bx bx-current-location"></i> <a href="https://maps.google.com/maps?q=30.168442000000002%2C31.647655600000007&z=17&hl=ar" target="_blank">مكان الفرع</a></div>';
    st.value = "100م";
    bu.value = "138م";
    fo.value = "طابق 0";
    st.setAttribute("readonly", true);
    bu.setAttribute("readonly", true);
    fo.setAttribute("readonly", true);
    notShrouk();
  } else {
    notShrouk();
    loc.outerHTML = "<div class='location'></div>";
    st.value = "";
    bu.value = "";
    fo.value = "";
    st.removeAttribute("readonly");
    bu.removeAttribute("readonly");
    fo.removeAttribute("readonly");
  }
}
window.addEventListener("pageshow", function (event) {
  var historyTraversal =
    event.persisted ||
    (typeof window.performance != "undefined" &&
      window.performance.navigation.type === 2);
  if (historyTraversal) {
    // Handle page restore.
    window.location.reload();
  }
});
