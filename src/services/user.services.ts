import { ACCOUNT_TYPE } from 'config/constant';
import { prisma } from "config/client";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds);
};
const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string,
    phone: string,
    avatar: string
) => {
    const defaultPassword = await hashPassword("123456");
    const newUser = await prisma.user.create({
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            avatar: avatar,
            phone: phone,
        }
    });
    return newUser;
};

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const getAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
};

const handleDeleteUser = async (id: string) => {
    const result = await prisma.user.delete({
        where: { id: +id }
    });
    return result;
};

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id: +id } });
    return user;
};

const updateUserById = async (id: string, email: string, address: string, fullName: string) => {
    const updateUser = await prisma.user.update({
        where: { id: +id },
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: "",
            accountType: "",
        }
    });

    return updateUser;
};

export {
    handleCreateUser, getAllUsers, handleDeleteUser,
    getUserById, updateUserById, getAllRoles, hashPassword
};