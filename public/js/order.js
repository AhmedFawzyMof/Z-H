if (localStorage.getItem("Token") === "noToken") {
  location.replace("/");
}
let disCount;
if (localStorage.getItem("disCount")) {
  disCount = JSON.parse(localStorage.getItem("disCount"));
} else {
  disCount = 0;
}
function calContainer() {
  function getTotal() {
    let temp = cart.map(function (item) {
      return parseFloat(item.price * item.quantity);
    });

    let sum = temp.reduce(function (prev, next) {
      return prev + next;
    }, 0);

    return sum - disCount;
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
    let shiping = 200;
    return shiping;
  }

  if (cart.length) {
    const countContainer = document.getElementById("countContainer");
    countContainer.innerHTML = `<p>المجموع: ${getTotal()} ج</p> 
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
  let shiping = 200;
  return shiping;
}
function getTotal() {
  let temp = cart.map(function (item) {
    return parseFloat(item.price * item.quantity);
  });

  let sum = temp.reduce(function (prev, next) {
    return prev + next;
  }, 0);

  return sum * disCount;
}
function moreInputs() {
  let token = JSON.stringify(localStorage.getItem("Token"));

  const otherinput = document.getElementById("otherinput");

  otherinput.innerHTML = `<input id='token' type='hidden' name='user' value='${JSON.parse(
    token
  )}' /> <input type='hidden' id='total' name='total' value='${JSON.parse(
    getTotal() + ShipingPrice()
  )}' /> <input type='hidden' id='cart' name='cart' value='${JSON.stringify(
    cart
  )}' />`;
}

moreInputs();
