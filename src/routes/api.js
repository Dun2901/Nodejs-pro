const express = require("express");
const { getUsersAPI, postCreateUserAPI } = require("../controllers/api.controller");
const routerAPI = express.Router();

routerAPI.get("/users", getUsersAPI);
routerAPI.post("/users", postCreateUserAPI);

module.exports = routerAPI; // export default
