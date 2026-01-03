const express = require("express");
const { getUsersAPI } = require("../controllers/api.controller");
const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  res.send("hello world with api");
});

routerAPI.get("/abc", (req, res) => {
  res.status(200).json({
    data: "hello world first apis",
  });
});

routerAPI.get("/users", getUsersAPI);

module.exports = routerAPI; // export default
