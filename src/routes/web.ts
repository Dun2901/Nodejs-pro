import express, { Express } from "express";
import {
    getCreateUserPage, getHomePage, postCreateUser, postDeleteUser,
    getViewUser, postUpdateUser
} from "controllers/user.controllers";

const router = express.Router();

const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/create-user", getCreateUserPage);
    router.post("/handle-create-user", postCreateUser);
    router.post("/handle-delete-user/:id", postDeleteUser);
    router.get("/handle-view-user/:id", getViewUser);
    router.post("/handle-update-user", postUpdateUser);

    app.use("/", router);
};

export default webRoutes;

