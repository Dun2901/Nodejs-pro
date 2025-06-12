import express, { Express } from "express";
import { getCreateUserPage, getHomePage } from "../controllers/user.controllers";

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/create-user", getCreateUserPage);

    app.use("/", router);
};

export default webRoutes;

