if (localStorage.getItem("Token") !== "noToken") {
  location.replace("/");
}
if (navigator.onLine) {
  console.log("online");
}

window.addEventListener("online", () => {
  location.reload();
});

window.addEventListener("offline", () => {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.href = "#";
  });
});

const myForm = document.getElementById("myForm");
const message = document.getElementById("err");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  register(searchParams);
});

async function register(data) {
  const loading = document.getElementById("loading");
  loading.classList.add("active");
  const log = await fetch("/register", {
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
