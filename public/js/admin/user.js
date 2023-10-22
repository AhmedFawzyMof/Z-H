function search() {
  const myForm = document.getElementById("myForm");
  const users = [];
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("/search/users", {
      method: "post",
      body: searchParams,
    })
      .then((res) => res.json())
      .then((res) => {
        usersL(res.data);
      });
  });
  function usersL(data) {
    const Container = document.querySelector(".Users");

    Container.innerHTML = data;
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
