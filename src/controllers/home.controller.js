const connection = require("../config/database");

const getHomePage = (req, res) => {
  return res.render("home.ejs");
};

const postCreateUser = (req, res) => {
  console.log("check req.body: ", req.body);
  return res.send("hello");
};

module.exports = {
  getHomePage,
  postCreateUser,
};
