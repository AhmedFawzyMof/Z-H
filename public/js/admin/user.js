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

    fetch("https://prickly-wasp-buckle.cyclic.app/search/users", {
      method: "post",
      body: searchParams,
    })
      .then((res) => res.json())
      .then((res) => {
        users.push(res.data);
        usersL();
        console.log(res.data);
      });
  });
  function usersL() {
    const Container = document.getElementById("result");

    const mappedItems = users[0]
      .map((user, index) => {
        function manger() {
          if (user.isManger === 1) {
            return `نعم`;
          } else {
            return `لا`;
          }
        }
        return `
                  <div class="userRec" key=${index}>
                    <form action='/delete/user' method='post'>
                      <input type='hidden' name='userid' value='${user.id}'/>
                      <button class='delete' type='submit'><i class='bx bx-trash'></i></button>
                    </form>
                    <p>معرف المستخدم: ${user.id.substr(24, 25)}</p>
                    <p>اسم المستخدم: ${user.name}</p>
                    <div class='manger'>المستخدم مدير: ${manger()} 
                    <form action='/edit/user' method='post'>
                    <input type='hidden' name='id' value='${user.id}'/>
                    <select name="isManger">
                      <option value="0" selected>لا</option>
                      <option value="1" >نعم</option>
                    </select>
                    <button type='submit'>تغيير</button>
                  </form>
                  </div>
                    <p>البريد الالكتروني للمستخدم: ${user.email}</p>
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
