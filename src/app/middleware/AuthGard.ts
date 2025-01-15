import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { TUserRole } from "../modules/users/user.constant";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../modules/users/user.model";

const AuthGard = (...roles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize");
    }
    const decode = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    const { role, email, iat } = decode;
    const user = await User.isUserExists(email);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User not found. Please check the email address."
      );
    }
    const isDeleted = user.isDeleted;
    if (isDeleted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User account has been deleted. Please contact support if this is a mistake."
      );
    }
    const isBlock = user.status;
    if (isBlock === "Block") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User account is currently blocked. Please contact support for assistance."
      );
    }
    if (roles && !roles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `Authorization failed: Role '${role}' is not allowed.`
      );
    }
    req.user = decode as JwtPayload;
    next();
  });
};
export default AuthGard;
