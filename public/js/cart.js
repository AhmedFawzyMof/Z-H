let disCount;
if (localStorage.getItem("disCount")) {
  disCount = JSON.parse(localStorage.getItem("disCount"));
} else {
  disCount = { code: "", value: 0 };
}
function calContainer() {
  function getTotal() {
    let temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });

    let sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);

    let total = sum - disCount.value;
    if (total < 0) {
      total = sum;
    } else if (total == NaN) {
      total = sum;
    }
    return total;
  }

  function getItems() {
    let temp = cart
      .map(function (item) {
        return item.name + "  ";
      })
      .join("");

    return temp;
  }
  function ShipingPrice() {
    let shiping = 20;
    return shiping;
  }
  if (cart.length) {
    const countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = `
        <p>المجموع: ${getTotal()} ج</p> 
        <p>المنتجات: ( ${getItems()} )</p>
        <p>سعر الشحن: ${ShipingPrice()} ج</p>
        <div id='auth'></div>
        `;
    const auth = document.getElementById("auth");
    if (localStorage.getItem("Token") === "noToken") {
      auth.innerHTML = `<p> من فضلك سجل الدخول لمواصلة <a href='/user/info/login'>الشراء</a> </p>`;
    } else {
      return (auth.innerHTML = `
      <p class='checkoutBtn'><button id='show1' onclick="CheckOrder45('cash')">الدفع عند الاستلام</button></p>
      <p class='checkoutBtn'><button id='show2' onclick="CheckOrder45('creditcard')">الدفع عند الاستلام</button></p>
      <p class='checkoutBtn'><button id='show3' onclick="CheckOrder45('cashback')">الدفع عند الاستلام</button></p>
      `);
    }
  } else {
    const countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = `<img  id='emptyCart' src='/img/cart.png'/> <a id='goToShop' href='/'>اذهب للتسوق</a>`;
  }
}
function cartItems() {
  let Container = document.getElementById("container");

  const mappedItems = cart
    .map((item, index) => {
      return `
          <div class="cart" key=${index}>
                <img src='${item.image}'>
                <div class='info'>
                 <a href="/product/show/${item.id}" ><p>${item.name.substr(
        0,
        25
      )}</p></a>
                  <p>${item.price} ج</p>
                  <p>${item.price * item.quantity} ج</p>
                </div>
                <div class="quantity">
                  <button onclick="incQuantity(${item.id}, ${
        item.quantity + 1
      })" ><i class='bx bx-plus'></i></button>
                  <p>${item.quantity}</p>
                  <button onclick='dicQuantity(${
                    item.id
                  })'><i class='bx bx-minus' ></i></button>
                </div>
                <button onclick='removeItemFormCart(${
                  item.id
                })' class='removeBtn'><i class='bx bxs-x-circle'></i></button>
          </div>`;
    })
    .join("");

  Container.innerHTML = mappedItems;
}
function removeItemFormCart(productId) {
  let temp = cart.filter((item) => item.id != productId);
  localStorage.setItem("cart", JSON.stringify(temp));
  location.reload();
}
function incQuantity(productId, quantity) {
  for (let product of cart) {
    if (product.id == productId) {
      if (20 == product.quantity) {
        product.quantity != quantity;
      } else {
        product.quantity = quantity;
        cartItems();
        calContainer();
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
function dicQuantity(productId) {
  for (let product of cart) {
    if (product.id == productId) {
      if (product.quantity !== 1) {
        product.quantity -= 1;
        cartItems();
        calContainer();
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function CheckOrder45(method) {
  function getTotal() {
    let temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });

    let sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);

    let total = sum - disCount.value;
    if (total < 0) {
      total = sum;
    } else if (total == NaN) {
      total = sum;
    }
    return total;
  }
  const showError = document.querySelector(".message");
  const closeError = document.getElementById("close");
  closeError.addEventListener("click", () => {
    showError.classList.remove("active");
  });
  if (getTotal() >= 45) {
    showError.classList.remove("active");
    if (method === "cash") {
      location.replace("/pay/info/cash_on_delivery");
    } else if (method === "creditcard") {
      location.replace("/pay/info/creditcard_on_delivery");
    } else {
      location.replace(`/pay/info/cashback/${JSON.parse(token)}`);
    }
  } else {
    showError.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (cart.length == 0) {
    const checkoutContainer = document.getElementById("checkoutContainer");
    checkoutContainer.style.height = "100vh";
    const container = document.getElementById("countContainer");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.flexDirection = "column";
  }
});
