const express = require("express");
const { getHomePage, postCreateUser } = require("../controllers/home.controller");
const router = express.Router();

router.get("/", getHomePage);

router.post("/create-user", postCreateUser);

module.exports = router; // export default
