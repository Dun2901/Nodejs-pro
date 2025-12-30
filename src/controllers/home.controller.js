const connection = require("../config/database");

const getHomePage = (req, res) => {
  return res.render("home.ejs");
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

module.exports = {
  getHomePage,
  postCreateUser,
  getCreatePage,
};
