if (localStorage.getItem("Token") !== "noToken") {
  location.replace("/");
}
const message = document.getElementById("err");
const myForm = document.getElementById("myForm");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch("/login", {
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
        message.style.borderRadius = "50px";
        message.innerHTML = res.message;
      } else {
        localStorage.setItem("Token", res.user);
        localStorage.setItem("State", JSON.parse(res.StateM));
        if (res.code !== null) {
          localStorage.setItem("coupon", "1");
        } else {
          localStorage.setItem("coupon", "0");
        }
        location.replace("/");
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

function showPass() {
  const password = document.getElementById("mypassword");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}
