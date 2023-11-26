const controller = {
  contact_success: (req, res) => {
    res.render("contact_success");
  },
  contactus: (req, res) => {
    res.render("contactus");
  },
  about: (req, res) => {
    res.render("about");
  },
  share: (req, res) => {
    res.render("share");
  },
  getTerms: (req, res) => {
    res.render("termandcondtions");
  },
  getDelUser: (req, res) => {
    res.render("delUser");
  },
  getfeedback: (req, res) => {
    res.render("feedback");
  },
  getCart: (req, res) => {
    res.render("cart.ejs");
  },
  getSuccess: (req, res) => {
    res.render("Checkout/success");
  },
  getCash: (req, res) => {
    res.render("Checkout/cash.ejs");
  },
  getCreditCard: (req, res) => {
    res.render("Checkout/credit-card");
  },
  getCashBack: async (req, res) => {
    const user = req.params.user;
    const [rows, fields] = await promisePool.query(
      "SELECT cashback FROM Users WHERE id = ?",
      [user]
    );
    res.render("Checkout/cashback", { cashback: rows[0].cashback });
  },
  contact: async (req, res) => {
    const { name, email, phone, message } = req.body;
    const date = new Date();
    const [_, __] = await promisePool.query(
      "INSERT INTO `Contact` (`name`, `email`, `phone`, `message`, `date`) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, message, date]
    );

    res.send(`
        <script>
        location.replace('/info/contact_us/success')
        </script>`);
  },
};

module.exports = controller;
