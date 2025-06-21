import { Request, Response } from "express";
import { getAllUsers, getUserById, handleCreateUser, handleDeleteUser } from "services/user.services";

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

export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser };