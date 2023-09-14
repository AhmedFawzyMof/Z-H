let base64String = "";

function imageUploaded() {
  var file = document.getElementById("image")["files"][0];

  var reader = new FileReader();
  console.log("next");

  reader.onload = function () {
    base64String = reader.result;

    imageBase64Stringsep = base64String;

    // alert(imageBase64Stringsep);
    displayString(imageBase64Stringsep);
  };
  reader.readAsDataURL(file);
}

function displayString(imageBase64Stringsep) {
  console.log("Base64String about to be printed");
  const myForm = document.getElementById("addform");
  const data = imageBase64Stringsep;

  const formData = new FormData(myForm);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }
  searchParams.append("image", data);
  console.log(searchParams);
  fetch("/add/product", {
    method: "post",
    body: searchParams,
  })
    .then(location.reload())
    .catch(function (error) {
      console.error(error);
    });
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

const myForm = document.getElementById("myForm");
myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch("/search/product", {
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

const FilterForms = document.querySelectorAll(".selectCom");
FilterForms.forEach((FilterForm) => {
  const link = FilterForm.querySelector("a");
  link.href =
    "/filter/product/" + localStorage.getItem("Token") + "/" + link.id;
});
function Filtered(data) {
  const productsContainer = document.querySelector(".products");

  productsContainer.innerHTML = data;
}
