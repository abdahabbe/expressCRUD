const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const port = 3000;
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const func = require("./function.js"); // call all functions related to app
app.set("view engine", "ejs"); // set up to use ejs as view engine
app.use(ejsLayouts);
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.set("layout", "layout/main");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

//route to index page
app.get("/", (req, res) => {
  const contacts = func.loadData();
  res.render("index", {
    title: "Home",
    name: "Abe",
    contacts,
    showName: "",
    showPhone: "",
    showEmail: "",
    updated: false,
  });
});

//Route to Add form
app.post("/contact/addForm", (req, res) => {
  res.render("addContact", {
    title: "Add Form",
    currentName: null,
    currentPhone: null,
    currentEmail: null,
    err: "",
  });
});

//Route to Edit form
app.post("/contact/editForm", (req, res) => {
  const currentName = req.query.currentName;
  //if currentName exists it'll be udpated, else it will add new contact
  if (currentName) {
    const contact = func.getData(currentName);

    res.render("editContact", {
      title: "Edit Form",
      currentName: contact.name,
      currentPhone: contact.phone,
      currentEmail: contact.email,
      err: "",
    });
  }
});

//add contact
app.post("/contact/add", (req, res) => {
  const newData = {
    name: req.body.uName,
    phone: req.body.uPhone,
    email: req.body.uEmail,
  };
  const contacts = func.loadData();

  //it will redirect to error page whenever caught error
  var err = func.isValid(newData, contacts);

  if (err.length > 0) {
    var errMessage = "";
    err.forEach((error) => {
      console.log(error);
      errMessage += error + ", ";
    });

    res.render("addContact", {
      title: "Contact Form",
      currentName: null,
      currentPhone: null,
      currentEmail: null,
      err: errMessage,
    });
    return;
  }

  contacts.push(newData);
  func.saveData(contacts);

  res.render("index", {
    title: "Home",
    name: "Abe",
    contacts: contacts,
    showName: "",
    showPhone: "",
    showEmail: "",
    updated: false,
  });
});

//Show Contact List
app.get("/contact/view/list", (req, res) => {
  const contacts = func.loadData();
  res.render("contact", {
    title: "Contact",
    contacts,
  });
});

//Show Contact Detail
app.get("/contact/view/:name", (req, res) => {
  const contacts = func.loadData();
  const contact = func.getData(req.params.name);
  res.render("index", {
    title: "Home",
    name: "Abe",
    contacts,
    showName: contact.name,
    showPhone: contact.phone,
    showEmail: contact.email,
    updated: false,
  });
});

//Update Contact
app.put("/contact/edit", (req, res) => {
  const currentData = func.getData(req.body.uName);
  const newData = {
    name: req.body.uName,
    phone: req.body.uPhone,
    email: req.body.uEmail,
  };

  //delete it first to avoid conflict/error if the name is not edited
  const newDatas = func.deleteData(currentData, res);

  var err = func.isValid(newData, newDatas);

  if (err.length > 0) {
    var errMessage = "";
    err.forEach((error) => {
      console.log(error);
      errMessage += error + ", ";
    });

    res.render("editContact", {
      title: "Edit Form",
      currentName: currentData.name,
      currentPhone: currentData.phone,
      currentEmail: currentData.email,
      err: errMessage,
    });
    return;
  }

  if (!newData.name) { //if new name is not inputed, it will take current name
    newData.name = currentData.name;
  } else if (newData.name !== currentData.name) {
    newData.name = newData.name;
  }

  newDatas.push(newData);
  func.saveData(newDatas);
  res.render("index", {
    title: "Home",
    name: "Abe",
    contacts: newDatas,
    showName: "",
    showPhone: "",
    showEmail: "",
    updated: true,
    updatedName: newData.name,
  });
});

//Delete Contact
app.delete("/contact/:name", (req, res) => {
  const contactToDelete = func.getData(req.params.name);

  const newDatas = func.deleteData(contactToDelete);
  func.saveData(newDatas);
  res.render("index", {
    title: "Home",
    name: "Abe",
    contacts: newDatas,
    showName: "",
    showPhone: "",
    showEmail: "",
    updated: true,
  });
});

app.use("/", (req, res, next) => {
  res.send("Page not found: 400");
  console.log("Time:", Date.now());
  next();
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
