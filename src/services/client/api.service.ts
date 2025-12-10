import { prisma } from "config/client";

const handleGetAllUser = async () => {
  return await prisma.user.findMany();
};

const handleGetUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export { handleGetAllUser, handleGetUserById };
