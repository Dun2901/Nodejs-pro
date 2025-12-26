const express = require("express");
const { getHomePage } = require("../controllers/home.controller");
const router = express.Router();

router.get("/", getHomePage);
router.get("/test", (req, res) => {
  // res.send("Hello World!");
  res.render("sample.ejs");
});

module.exports = router;
