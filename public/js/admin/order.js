function search() {
  const myForm = document.getElementById("myForm");
  const orders = [];
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("https://prickly-wasp-buckle.cyclic.app/search/orders", {
      method: "post",
      body: searchParams,
    })
      .then((res) => res.json())
      .then((res) => {
        orders.push(res.data);
        ordersL();
      });
  });
  function ordersL() {
    const Container = document.getElementById("result");

    const mappedItems = orders[0]
      .map((order, index) => {
        function Delivered() {
          if (order.delivered === 1) {
            return `نعم`;
          } else {
            return `لا`;
          }
        }
        function Paid() {
          if (order.paid === 1) {
            return `نعم`;
          } else {
            return `لا`;
          }
        }
        return `
                    <div class="orderRec" key=${index}>
                      <form action='/delete/order' method='post'>
                        <input type='hidden' name='orderid' value='${
                          order.id
                        }'/>
                        <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                      </form>
                      <p>معرف الطلب: ${order.id.substr(24, 25)}</p>
                      <p>تاريخ الطلب: ${order.date
                        .slice(0, 19)
                        .replace("T", " ")}</p>
                      <p>العنوان: ${order.Address}</p>
                      <p>معرف المستخدم: ${order.users.substr(24, 25)}</p>
                      <p>رقم الهاتف:  ${order.phone}</p>
                      <p>هاتف احتياطي: ${order.phone2}</p>
                      <p>المدينة: ${order.City}</p>
                      <p>المجموع: ${order.total} ج</p>
                      <div class='Delivered'>تسليم الطلب: ${Delivered()}
                        <form action='/edit/order/delivered' method='post'>
                      <input type='hidden' name='id' value='${order.id}'/>
                      <select name="isDelivered">
                        <option value="0" selected>لا</option>
                        <option value="1" >نعم</option>
                      </select>
                      <button type='submit'>تغيير</button>
                    </form>
                    </div>
                    <div class='Paid'>تم الدفع: ${Paid()}
                    <form action='/edit/order/paid' method='post'>
                        <input type='hidden' name='id' value='${order.id}'/>
                        <select name="isPaid">
                            <option value="0" selected>لا</option>
                            <option value="1" >نعم</option>
                        </select>
                        <button type='submit'>تغيير</button>
                    </form>
                    </div>
                </div>`;
      })
      .join("");

    Container.innerHTML = mappedItems;
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
