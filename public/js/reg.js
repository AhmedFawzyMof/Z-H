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
    location.replace("/user/info/login");
  } else {
    message.style.right = "5px";
    message.textContent = response.message;
    setTimeout(() => {
      message.style.right = "-305px";
    }, 3000);
  }
}
