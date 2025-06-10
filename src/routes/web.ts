import express, { Express } from "express";

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", (req, res) => {
        res.render("home.ejs")
    });

    router.get("/kophaidun", (req, res) => {
        res.send("Hello World")
    });

    app.use("/", router);
};

export default webRoutes;

