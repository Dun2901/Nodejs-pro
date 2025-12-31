const connection = require("../config/database");
const { getAllUsers } = require("../services/CRUDService");

const getHomePage = async (req, res) => {
  const results = await getAllUsers();
  console.log(">>> check rows: ", results);
  return res.render("home.ejs", { listUser: results });
};

const postCreateUser = async (req, res) => {
  const { email, name, city } = req.body;
  console.log("check req.body: ", req.body);

  let [results, fields] = await connection.query(
    `   INSERT INTO Users (email , name , city)
    VALUES (?, ?, ?)`,
    [email, name, city],
  );

  console.log("results=", results);

  return res.send("Create user succeed!!!");

  // connection.query(
  //   `   INSERT INTO Users (email , name , city)
  //   VALUES (?, ?, ?)`,
  //   [email, name, city],
  //   function (err, results) {
  //     return res.send("Create user succeed!!!");
  //   },
  // );
};

const getCreatePage = (req, res) => {
  return res.render("create.ejs");
};

const getUpdatePage = (req, res) => {
  return res.render("edit.ejs");
};

module.exports = {
  getHomePage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
};
