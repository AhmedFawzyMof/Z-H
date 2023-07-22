function search() {
  const myForm = document.getElementById("myForm");
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("/search/orders", {
      method: "post",
      body: searchParams,
    })
      .then((res) => res.json())
      .then((res) => {
        ordersL(res.data);
      });
  });
  function ordersL(data) {
    const Container = document.getElementById("result");

    Container.innerHTML = data;
  }
}

const token = localStorage.getItem("Token");

const orderPage = document.querySelectorAll("#orderPage");
orderPage.forEach((page) => {
  const orderid = page.classList[0];
  page.setAttribute("href", "/order/info/admin/" + token + "/" + orderid);
});

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
