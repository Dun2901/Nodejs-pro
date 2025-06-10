import express from "express";
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 8080;

// config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
    res.render("home.ejs")
})

app.get("/kophaidun", (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`My app is running on port ${PORT}`);
})