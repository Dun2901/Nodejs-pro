const express = require("express");
const configViewEngine = require("./config/viewEngine");
require("dotenv").config();
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");
const fileUpload = require("express-fileupload");

const connection = require("./config/database");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config file upload
app.use(fileUpload());

// config req.body
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// config view engine
configViewEngine(app);

// route
app.use("/", webRoutes);
app.use("/v1/api/", apiRoutes);

(async () => {
  // test connection
  try {
    // using mongoose
    // await connection();

    // using mongodb driver
    const url = process.env.DB_HOST_WITH_DRIVER;
    const client = new MongoClient(url);

    const dbName = process.env.DB_NAME;

    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("documents");

    app.listen(port, hostname, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB", error);
  }
})();
