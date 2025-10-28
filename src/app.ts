import express from "express";
import "dotenv/config";
import webRoutes from "src/routes/web";
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files: images/css/js
app.use(express.static("public"));

// config passport
app.use(passport.initialize());
configPassportLocal();

// config routes
webRoutes(app);

// seeding data
initDatabase();

// Handle 404 not found
app.use((req, res) => {
  res.send("404 not found");
});

app.listen(PORT, () => {
  console.log(`My app is running on port ${PORT}`);
});
