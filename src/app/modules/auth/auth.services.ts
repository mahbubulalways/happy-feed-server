import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import User from "../users/user.model";
import { IAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import { generateToken } from "./auth.utils";
import config from "../../config";
import { sendMail } from "../../utils/sendMail";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import QueryString from "qs";
import forgotPasswordHtmlContent from "../../utils/forgotPasswordHtmlContent";
export const loginUserService = async (payload: IAuth) => {
  const email = payload.email;
  const password = payload.password;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Login failed. Invalid credentials."
    );
  }
  const matchPassword = await bcrypt.compare(password, user?.password);
  if (!matchPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid password");
  } else {
    const tokenInfo = {
      role: user?.role,
      userId: user?._id,
      email: user.email,
    };
    const accessToken = generateToken(
      tokenInfo,
      config.ACCESS_TOKEN_SECRET as string,
      "1d"
    );
    const refreshToken = generateToken(
      tokenInfo,
      config.REFRESH_TOKEN_ACCESS as string,
      "365d"
    );
    const data = {
      accessToken,
      refreshToken,
    };
    return data;
  }
};

// * change password
interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
export const changePasswordService = async (
  email: string,
  payload: IChangePassword
) => {
  const user = await User.findOne({ email });
  const matchPass = await User.isPasswordMatch(
    payload.currentPassword,
    user?.password as string
  );
  if (!matchPass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid password");
  }
  const hashNewPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT)
  );
  const updatePassword = await User.findOneAndUpdate(
    { email },
    {
      password: hashNewPass,
      passwordChangeAt: new Date(),
    },
    { new: true, upsert: true }
  );
  return updatePassword;
};

// forget password

export const forgetPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found. Please check the email address and try again."
    );
  }
  const isDeleted = user.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User account has been deleted. Please contact support if you believe this is an error."
    );
  }
  const isBlock = user.status;
  if (isBlock === "Block") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User account is currently blocked. Please contact support for assistance."
    );
  }

  //   generate token
  const tokenInfo = {
    role: user?.role,
    userId: user?._id,
    email: user.email,
  };

  const resetToken = generateToken(
    tokenInfo,
    config.ACCESS_TOKEN_SECRET as string,
    "5s"
  );
  const resetLink = `http://localhost:3000/reset-password?email=${user?.email}&token=${resetToken}`;

  const htmlInfo = {
    name: user?.name,
    resetLink,
  };
  const htmlData = forgotPasswordHtmlContent(htmlInfo);

  const info = {
    email,
    subject: "Password Reset Request for Green Steps.",
    htmlData,
  };
  const result = await sendMail(info);
  return result;
};

// recover password
export const recoverPasswordService = async (
  email:
    | string
    | QueryString.ParsedQs
    | string[]
    | QueryString.ParsedQs[]
    | undefined,
  token:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined,
  newPassword: string
) => {
  try {
    const decodeToken = jwt.verify(
      token as string,
      config.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    const hashNewPass = await bcrypt.hash(
      newPassword,
      Number(config.BCRYPT_SALT)
    );
    const updatePassword = await User.findOneAndUpdate(
      {
        email: decodeToken?.email,
      },
      { password: hashNewPass, passwordChangeAt: new Date() },
      { upsert: true, new: true }
    );
    return updatePassword;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      // Handle token expiration
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Your session has expired. Please try again."
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Something went wrong. Please try again later."
      );
    }
  }
};
