const express = require("express");
const {
  getHomePage,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
} = require("../controllers/home.controller");
const router = express.Router();

router.get("/", getHomePage);
router.get("/create", getCreatePage);
router.get("/update/:id", getUpdatePage);

router.post("/create-user", postCreateUser);
router.post("/update-user", postUpdateUser);

module.exports = router; // export default
