const validator = require("validator");
const fs = require("fs");
const dirPath = "./data";
const dataPath = `${dirPath}/contacts.json`;

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadData = () => {
  const file = fs.readFileSync(dataPath, "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

const getData = (name) => {
  const contacts = loadData();
  var contact = contacts.find(
    (val) => val.name.toLowerCase() === name.toLowerCase() // search term without case sensitive
  );

  if (contact) return contact;
  else null;
};

const saveData = (newData) => {
  fs.writeFileSync(dataPath, JSON.stringify(newData));
};

const deleteData = (contactToDelete) => {
  const contacts = loadData();

  const newDatas = contacts.filter((val) => val.name !== contactToDelete.name);

  if (contacts.length === newDatas.length) {
    console.log("Delete Unsuccesfull!");
    return contacts;
  } else {
    console.log("Successfully Delete Data!");
    return newDatas;
  }
};

const isValid = (newData, value) => {
  err = [];
  //valToCheck = ;

  if (
    newData.name &&
    value.find((val) => val.name.toLowerCase() === newData.name.toLowerCase())
  ) {
    err.push("Name already exist");
  }
  if (!validator.isMobilePhone(newData.phone, "id-ID")) {
    err.push("Invalid phone number!");
  }
  if (newData.email && !validator.isEmail(newData.email)) {
    err.push("Invalid email!");
  }
  return err;
};

const reloadErrPage = (err) => {
  if (err !== "") {
    window.onload = () => {
      alert(err);
    };
  }
};

module.exports = {
  loadData,
  getData,
  saveData,
  deleteData,
  isValid,
  reloadErrPage,
};
