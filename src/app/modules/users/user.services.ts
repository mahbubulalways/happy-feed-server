import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { IUser } from "./user.interface";
import User from "./user.model";

export const createUserService = async (payload: IUser) => {
  const isUserExists = await User.isUserExists(payload.email);
  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email is already exist"
    );
  } else {
    const result = await User.create(payload);
    return result;
  }
};
export const getUserService = async () => {
  const result = await User.find({});
  return result;
};
