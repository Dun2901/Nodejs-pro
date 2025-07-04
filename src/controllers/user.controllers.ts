import { Request, Response } from "express";
import { getAllUsers, getUserById, handleCreateUser, handleDeleteUser, updateUserById } from "services/user.services";

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
    const a = await handleCreateUser(fullName, email, address);

    return res.redirect("/");
};

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(id);
    return res.redirect("/");
};

const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Get user by id
    const user = await getUserById(id);

    return res.render("view-user.ejs", {
        id: id,
        user: user
    })
};

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, email, address, fullName } = req.body;
    // Update user by id
    await updateUserById(id, email, address, fullName);

    return res.redirect("/");
};

export {
    getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser,
    postUpdateUser
};