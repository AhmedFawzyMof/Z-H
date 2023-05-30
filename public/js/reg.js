if (localStorage.getItem("Token") !== "noToken") {
  location.replace("/");
}
const myForm = document.getElementById("myForm");
const message = document.getElementById("err");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch("https://prickly-wasp-buckle.cyclic.app/register", {
    method: "post",
    body: searchParams,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success == 0) {
        message.style.color = "#fff";
        message.style.background = "red";
        message.style.fontSize = "12px";
        message.style.padding = " 0 2.5px";
        message.style.borderRadius = "5px";
        message.style.padding = "0 5px";
        message.innerHTML = res.message;
      } else {
        location.replace("/user/info/login");
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});
