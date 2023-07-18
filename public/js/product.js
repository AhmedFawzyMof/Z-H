const id = document.getElementById("id").value;
const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const image = document.getElementById("image").value;
const quantity = 1;
console.log(document.getElementById("outside"));
const Quantity = document.createElement("div");
Quantity.setAttribute("class", "quantity");
const QuantityIncBtn = document.createElement("button");
const QuantityDicBtn = document.createElement("button");
const QuantityI = document.createElement("i");
const QuantityI2 = document.createElement("i");
const QuantityP = document.createElement("p");
QuantityP.setAttribute("id", "quantityNum");
Quantity.appendChild(QuantityIncBtn);
QuantityI.setAttribute("class", "bx bx-plus");
QuantityIncBtn.appendChild(QuantityI);
Quantity.appendChild(QuantityP);
Quantity.appendChild(QuantityDicBtn);
QuantityI2.setAttribute("class", "bx bx-minus");
QuantityDicBtn.appendChild(QuantityI2);
let product = {
  id: id,
  name: name,
  price: price,
  image: image,
  quantity: quantity,
};
function addItemToCart(productId) {
  productId = product.id;
  if (cart.length == 0) {
    cart.push(product);
  } else {
    let res = cart.find((element) => element.id == productId);
    if (res === undefined) {
      cart.push(product);
    } else {
      let update = document.getElementById(res.id);
      let button = document.getElementById("outside");
      update.removeChild(button);
      update.appendChild(Quantity);
      QuantityIncBtn.setAttribute(
        "onclick",
        `incQuantity(${res.id}, ${res.quantity + 1})`
      );
      QuantityDicBtn.setAttribute("onclick", `dicQuantity(${res.id})`);
      QuantityP.innerText = res.quantity;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  cartLen();
}
function incQuantity(productId, quantity) {
  for (let product of cart) {
    if (product.id == productId) {
      if (20 == product.quantity) {
        product.quantity != quantity;
      } else {
        product.quantity = quantity;
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  let res = cart.find((element) => element.id == productId);
  let update = document.getElementById(res.id);
  update.appendChild(Quantity);
  QuantityIncBtn.setAttribute(
    "onclick",
    `incQuantity(${res.id}, ${res.quantity + 1})`
  );
  QuantityDicBtn.setAttribute("onclick", `dicQuantity(${res.id})`);
  QuantityP.innerText = quantity;
}
function dicQuantity(productId) {
  for (let product of cart) {
    if (product.id == productId) {
      if (product.quantity !== 1) {
        product.quantity -= 1;
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  let res = cart.find((element) => element.id == productId);
  let update = document.getElementById(res.id);
  update.appendChild(Quantity);
  QuantityIncBtn.setAttribute(
    "onclick",
    `incQuantity(${res.id}, ${res.quantity + 1})`
  );
  QuantityDicBtn.setAttribute("onclick", `dicQuantity(${res.id})`);
  QuantityP.innerText = res.quantity;
}

window.onscroll = function () {
  myFunction();
};

// Get the header
var header = document.querySelector(".categories");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
