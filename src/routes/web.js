const express = require("express");
const {
  getHomePage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
} = require("../controllers/home.controller");
const router = express.Router();

router.get("/", getHomePage);
router.get("/create", getCreatePage);
router.get("/update", getUpdatePage);

router.post("/create-user", postCreateUser);

module.exports = router; // export default
