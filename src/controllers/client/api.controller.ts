import { Request, Response } from "express";
import { handleGetAllUser, handleGetUserById } from "services/client/api.service";
import { registerNewUser } from "services/client/auth.service";
import { addProductToCart } from "services/client/item.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const postAddProductToCartAPI = async (req: Request, res: Response) => {
  const { quantity, productId } = req.body;
  const user = req.user;

  const currentSum = req?.user?.sumCart ?? 0;
  const newSum = currentSum + +quantity;

  await addProductToCart(+quantity, +productId, user);

  res.status(200).json({
    data: newSum,
  });
};

const getAllUsersAPI = async (req: Request, res: Response) => {
  const users = await handleGetAllUser();
  res.status(200).json({
    data: users,
  });
};

const getUserByIdAPI = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await handleGetUserById(+id);
  res.status(200).json({
    data: user,
  });
};

const createUsersAPI = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body as TRegisterSchema;

  const validate = await RegisterSchema.safeParseAsync(req.body);
  if (!validate.success) {
    // Error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(item => `${item.message} (${item.path[0]})`);

    res.status(400).json({
      errors: errors,
    });

    return;
  }

  // Success
  await registerNewUser(fullName, email, password);
  res.status(201).json({
    data: "creat user succeed",
  });
};

export { postAddProductToCartAPI, getAllUsersAPI, getUserByIdAPI, createUsersAPI };
