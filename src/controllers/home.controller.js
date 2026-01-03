const connection = require("../config/database");
const User = require("../models/user");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../services/CRUDService");

const getHomePage = async (req, res) => {
  const results = [];
  console.log(">>> check rows: ", results);
  return res.render("home.ejs", { listUser: results });
};

const postCreateUser = async (req, res) => {
  const { email, name, city } = req.body;
  console.log(">>> check req.body: ", req.body);

  await User.create({
    email,
    name,
    city,
  });
  return res.send("Create user succeed!!!");
};

const getCreatePage = (req, res) => {
  return res.render("create.ejs");
};

const getUpdatePage = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  return res.render("edit.ejs", { user });
};

const postUpdateUser = async (req, res) => {
  const { email, name, city, id } = req.body;

  await updateUserById(email, name, city, id);

  // return res.send("Update user succeed!!!");
  return res.redirect("/");
};

const postDeleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  return res.render("delete.ejs", { user });
};

const postHandleRemoveUser = async (req, res) => {
  const { id } = req.body;

  await deleteUserById(id);

  return res.redirect("/");
};

module.exports = {
  getHomePage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
  postDeleteUser,
  postHandleRemoveUser,
};
