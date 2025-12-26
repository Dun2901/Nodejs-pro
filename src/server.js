const express = require("express");
const configViewEngine = require("./config/viewEngine");
require("dotenv").config();
const webRoutes = require("./routes/web");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config view engine
configViewEngine(app);

// route
app.use("/", webRoutes);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
