const connection = require("../config/database");

const getHomePage = (req, res) => {
  return res.render("home.ejs");
};

const postCreateUser = (req, res) => {
  const { email, name, city } = req.body;
  console.log("check req.body: ", req.body);

  connection.query(
    `   INSERT INTO Users (email , name , city)
    VALUES (?, ?, ?)`,
    [email, name, city],
    function (err, results) {
      return res.send("Create user succeed!!!");
    },
  );
};

module.exports = {
  getHomePage,
  postCreateUser,
};
