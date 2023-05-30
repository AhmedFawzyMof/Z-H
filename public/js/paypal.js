const totalEGP = document.getElementById("total").value;
const total = totalEGP / 30.9;
const paypalBtn = document.getElementById("paypal");
const OrderData = {};
function values() {
  const city = document.getElementById("city").value;
  const where = document.getElementById("where").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const phone2 = document.getElementById("phone2").value;
  const tokenInput = document.getElementById("token").value;
  const total = document.getElementById("total").value;
  const cart = document.getElementById("cart").value;
  const ERR = document.getElementById("ERR");
  const values = {
    city: city,
    where: where,
    address: address,
    phone: phone,
    phone2: phone2,
    user: tokenInput,
    total: total,
    cart: cart,
    delivered: 0,
    paid: 1,
  };
  const errs = [];
  if (!city) {
    console.log(errs.length);
    return (ERR.innerHTML = "من فضلك اختر المدينة");
  }
  if (!where) {
    console.log(errs.length);
    return (ERR.innerHTML = "من فضلك اختر مكانا");
  }
  if (!address) {
    console.log(errs.length);
    return (ERR.innerHTML = "الرجاء تحديد عنوان");
  }
  if (!phone) {
    console.log(errs.length);
    return (ERR.innerHTML = "الرجاء إدخال رقم هاتف");
  }
  if (!phone2) {
    console.log(errs.length);
    return (ERR.innerHTML = "من فضلك ضع رقم هاتف احتياطي");
  }
  if (!errs.length > 0) {
    ERR.style.display = "none";
    paypalBtn.style.display = "block";
    Object.assign(OrderData, values);
  }
}
paypal
  .Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total.toFixed(2),
            },
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(
        fetch("https://prickly-wasp-buckle.cyclic.app/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(OrderData),
        }).then(
          localStorage.setItem("cart", "[]"),
          location.replace("/pay/info/success")
        )
      );
    },
  })
  .render("#paypal");
