const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const port = 3000;
const cont = [
  {
    nama: "Abdah MZ",
    phone: "083131041554",
  },
  {
    nama: "Yudi",
    phone: "084331041554",
  },
  {
    nama: "Dila",
    phone: "089961041554",
  },
];

app.set("view engine", "ejs"); // set up to use ejs as view engine
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.set('layout', 'layout/main');

app.get("/", (req, res) => {
  res.render("index", { nama: "Abe Muza", title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { cont, title: "Contact" });
});


app.use("/", (req, res, next) => {
  res.status(404);
  res.send("Page not found: 400");
  console.log("Time:", Date.now());
  next();
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
