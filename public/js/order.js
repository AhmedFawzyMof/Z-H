if (localStorage.getItem("Token") === "noToken") {
  location.replace("/");
}
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
  function promoCode() {
    if (location.pathname.includes("/pay/info/cashback")) {
      return ``;
    } else {
      return `
        <form action="/get/promocode" method="post" id="promocode">
          <input type="hidden" name="id" value='${token}' />
          <input type="text" name="code" placeholder="كود الترويجي" />
          <button type="submit">كود الترويجي</button>
        </form>
      `;
    }
  }
  if (cart.length) {
    const countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = `
         ${promoCode()}
          <p>المجموع: ${getTotal()} ج</p> 
          <p>المنتجات: ( ${getItems()} )</p>
          <p>سعر الشحن: ${ShipingPrice()} ج</p>
          `;
  } else {
    const countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = `<p style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        padding: 5px;
        width: 95%;
        display:flex;
        align-items: center;
        justify-content: center;
        text-transform: capitalize;
        border-radius: 5px;
        ">عربة التسوق فارغة <a href='/' style='margin-left: 5px;
    text-decoration: none;
    color: #2660ff;'> اذهب للتسوق</a> </p>`;
  }
}
const myForm = document.getElementById("order");
function ShipingPrice() {
  let shiping = 20;
  return shiping;
}
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

const OrderForm = document.getElementById("order");

const tokenInp = document.createElement("input");
tokenInp.type = "hidden";
tokenInp.name = "user";
tokenInp.value = JSON.parse(token);
const totalInp = document.createElement("input");
totalInp.type = "hidden";
totalInp.name = "total";
totalInp.value = JSON.parse(getTotal() + ShipingPrice());
const cartInp = document.createElement("input");
cartInp.type = "hidden";
cartInp.name = "cart";
cartInp.value = JSON.stringify(cart);
const disCountInp = document.createElement("input");
disCountInp.type = "hidden";
disCountInp.name = "discount";
disCountInp.value = JSON.stringify(disCount);
OrderForm.append(tokenInp);
OrderForm.append(totalInp);
OrderForm.append(cartInp);
OrderForm.append(disCountInp);

function getLoc() {
  const Thelocation = document.getElementById("location");
  if (Thelocation.value === "الفرع") {
    const loc = document.querySelector(".location");
    loc.outerHTML =
      '<div class="location"><i class="bx bx-current-location"></i> <a href="https://maps.google.com/maps?q=30.168442000000002%2C31.647655600000007&z=17&hl=ar" target="_blank">مكان الفرع</a></div>';
  } else {
    console.log(false);
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
