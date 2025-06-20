import { Request, Response } from "express";
import { getAllUsers, handleCreateUser } from "../services/user.services";

const getHomePage = async (req: Request, res: Response) => {
    // Get users
    const users = await getAllUsers();

    return res.render("home.ejs", {
        users: users
    });
};

const getCreateUserPage = (req: Request, res: Response) => {
    return res.render("create-user.ejs");
};

const postCreateUser = async (req: Request, res: Response) => {

    const { fullName, email, address } = req.body;

    // handle create user
    await handleCreateUser(fullName, email, address);

    return res.redirect("/");
};

export { getHomePage, getCreateUserPage, postCreateUser };