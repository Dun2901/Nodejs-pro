const path = require("path");
const express = require("express");

const configViewEngine = app => {
  app.set("view engine", "ejs");
  app.set("views", path.join("./src", "views"));

  // config static files: images/css/js
  app.use(express.static(path.join("./src", "public")));
};

module.exports = configViewEngine;
