import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import jwt from "jsonwebtoken";

const handleGetAllUser = async () => {
  return await prisma.user.findMany();
};

const handleGetUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const handleUpdateUserById = async (
  id: number,
  fullName: string,
  address: string,
  phone: string,
) => {
  return await prisma.user.update({
    where: { id },
    data: {
      fullName,
      address,
      phone,
    },
  });
};

const handleDeleteUserById = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

const handleUserLogin = async (username: string, password: string) => {
  // Check user exist in db
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    // Throw error
    throw new Error(`Username: ${username} not found`);
  }

  // Compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error(`Invalid password`);
  }

  // Có user login => định nghĩa access token
  const payload = {
    id: 1,
    name: "hoidanit",
  };
  const access_token = jwt.sign(payload, "eric", {
    expiresIn: "1d",
  });

  return access_token;
};

export {
  handleGetAllUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleUserLogin,
};
