import { Request, Response, NextFunction } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.redirect("/");
    return;
  } else {
    return next();
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user?.role?.name === "ADMIN") {
    return next();
  }
  return res.redirect("/");
};

export { isLogin, isAdmin };
