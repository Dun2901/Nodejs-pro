import { Request, Response } from "express";
import { getAllRoles, getAllUsers, getUserById, handleCreateUser, handleDeleteUser, updateUserById } from "services/user.services";

const getHomePage = async (req: Request, res: Response) => {
    // Get users
    const users = await getAllUsers();
    return res.render("home.ejs", {
        users: users
    });
};

const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getAllRoles();

    return res.render("admin/user/create.ejs", {
        roles
    });
};

const postCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, address, phone, role } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    // handle create user
    await handleCreateUser(fullName, username, address, phone, avatar, role);

    return res.redirect("/admin/user");
};

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(id);
    return res.redirect("/admin/user");
};

const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Get user by id
    const user = await getUserById(id);
    const roles = await getAllRoles();

    return res.render("admin/user/detail.ejs", {
        id: id,
        user: user,
        roles
    })
};

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, address, phone, role } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    // Update user by id
    await updateUserById(id, fullName, phone, role, address, avatar);
    return res.redirect("/admin/user");
};

export {
    getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser,
    postUpdateUser
};