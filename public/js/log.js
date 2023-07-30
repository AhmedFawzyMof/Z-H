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

  login(searchParams);
});
async function login(data) {
  const loading = document.getElementById("loading");
  loading.classList.add("active");
  const log = await fetch("/login", {
    method: "post",
    body: data,
  });

  const response = await log.json();
  loading.classList.remove("active");

  console.log(response);

  if (response.success !== 0) {
    localStorage.setItem("Token", response.user);
    localStorage.setItem("State", JSON.parse(response.StateM));

    if (response.code !== 0) {
      localStorage.setItem("coupon", response.code);
    } else {
      localStorage.setItem("coupon", "0");
    }
    if (response.Stuff) {
      console.log(response.Stuff);
      location.replace("/admin/panle/orders/" + response.user);
    } else {
      location.replace("/");
    }
  } else {
    message.style.right = "5px";
    message.textContent = response.message;
    setTimeout(() => {
      message.style.right = "-305px";
    }, 3000);
  }
}

function showPass() {
  const password = document.getElementById("mypassword");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}
