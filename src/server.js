const express = require("express");
// import express from "express";
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// config static files: images/css/js
app.use(express.static(path.join(__dirname, "public")));

// route
app.get("/", (req, res) => {
  res.send("Hello World and nodemon");
});

app.get("/test", (req, res) => {
  // res.send("Hello World!");
  res.render("sample.ejs");
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
