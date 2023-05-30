function search() {
  const myForm = document.getElementById("myForm");
  const products = [];
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const pair of formData) {
      searchParams.append(pair[0], pair[1]);
    }

    fetch("https://prickly-wasp-buckle.cyclic.app/search/product", {
      method: "post",
      body: searchParams,
    })
      .then((res) => res.json())
      .then((res) => {
        products.push(res.data);
        productsL();
        console.log(res.data);
      });
  });
  function productsL() {
    const Container = document.getElementById("result");

    const mappedItems = products[0]
      .map((product, index) => {
        return `
                    <div class="productRec" key=${index}>
                      <form action='/delete/product' method='post'>
                        <input type='hidden' name='productid' value='${product.id}'/>
                        <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                      </form>
                      <p>معرف المنتج: ${product.id}</p>
                      <p>اسم المنتج: ${product.name_ar}</p>
                      <p>السعر: ${product.price} ج</p>
                      <p>الوصف: ${product.dis_ar}</p>
                      <p>القسم:${product.category}</p>
                      <p>الشركة:${product.subcategory}</p>
                    </div>
                    </div>

                    <form action="/edit/product" method="post" id="edit">
                    <div class="input">
                    <label>معرف المنتج</label>
                    <input type="text" name="id" required value="${product.id}"/>
                  </div>                    
                  <div class="input">
                      <label>اسم</label>
                      <input type="text" name="name_ar" required value="${product.name_ar}"/>
                    </div>
                    <div class="input">
                      <label>الوصف</label>
                      <input type="text" name="dis_ar" required value="${product.dis_ar}" />
                    </div>
                    <div class="input">
                      <label>السعر</label>
                      <input type="number" name="price" required value="${product.price}" />
                    </div>
                    <button type="submit">تغير</button>
                    </form>
        `;
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
  const myForm = document.getElementById("addproduct");
  const data = imageBase64Stringsep;

  const formData = new FormData(myForm);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }
  searchParams.append("image", data);
  console.log(searchParams);
  fetch("https://prickly-wasp-buckle.cyclic.app/add/product", {
    method: "post",
    body: searchParams,
  })
    .then(location.reload())
    .catch(function (error) {
      console.error(error);
    });
}
