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
QuantityIncBtn.setAttribute("id", "Inc");
Quantity.appendChild(QuantityP);
Quantity.appendChild(QuantityDicBtn);
QuantityI2.setAttribute("class", "bx bx-minus");
QuantityDicBtn.appendChild(QuantityI2);
QuantityDicBtn.setAttribute("id", "Dic");

const Products = document.querySelectorAll(".Product");

Products.forEach((product) => {
  let res = cart.find((element) => element.id == product.id);
  if (res !== undefined) {
    const div = document.getElementById(res.id);
    console.log(div);
    let button = div.querySelector("#outside");

    QuantityIncBtn.setAttribute(
      "onclick",
      `incQuantity(${res.id}, ${res.quantity + 1})`
    );

    QuantityDicBtn.setAttribute("onclick", `dicQuantity(${res.id})`);

    QuantityP.innerText = res.quantity;
    button.outerHTML = Quantity.outerHTML;
  }
});

function addItemToCart(productId) {
  const Product = document.getElementById(productId);
  const id = Product.querySelector("#id").value;
  const name = Product.querySelector("#name").value;
  const price = Product.querySelector("#price").value;
  const image = Product.querySelector("#image").value;
  const quantity = 1;
  const product = {
    id: id,
    name: name,
    price: price,
    image: image,
    quantity: quantity,
  };
  productId = product.id;
  if (cart.length == 0) {
    cart.push(product);
  } else {
    let res = cart.find((element) => element.id == product.id);
    if (res === undefined) {
      cart.push(product);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  cartLen();
  location.reload();
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
  const qaun = update.querySelector(".quantity");
  const plusOne = qaun.querySelector("#Inc");
  const length = qaun.querySelector("#quantityNum");
  length.textContent = quantity;
  plusOne.outerHTML = `<button id="Inc" onclick="incQuantity(${res.id}, ${
    res.quantity + 1
  })"><i class="bx bx-plus"></i></button>`;
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

const favourites = document.querySelectorAll("#favourite");
favourites.forEach((favourite) => {
  favourite.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = favourite.querySelector("#productinp").value;
    const userinp = JSON.parse(token);
    const searchParams = new URLSearchParams();
    searchParams.append("user", userinp);
    searchParams.append("product", product);

    addFav(searchParams);
  });
});

const message = document.getElementById("message");
const errmsg = document.getElementById("errmsg");
async function addFav(data) {
  const log = await fetch("/favourite", {
    method: "post",
    body: data,
  });

  const response = await log.json();

  if (response.success == 1) {
    message.style.right = "5px";
    message.textContent = response.msg;
    setTimeout(() => {
      message.style.right = "-255px";
    }, 3000);
  } else {
    errmsg.style.right = "5px";
    errmsg.textContent = response.msg;
    setTimeout(() => {
      errmsg.style.right = "-255px";
    }, 3000);
  }
}
