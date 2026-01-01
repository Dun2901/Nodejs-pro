const express = require("express");
const configViewEngine = require("./config/viewEngine");
require("dotenv").config();
const webRoutes = require("./routes/web");
const connection = require("./config/database");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config req.body
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// config view engine
configViewEngine(app);

// route
app.use("/", webRoutes);

// test connection
connection();

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
