const express = require("express");
// import express from "express";

const app = express();
const port = 8080;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  // res.send("Hello World!");
  res.render("sample.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
