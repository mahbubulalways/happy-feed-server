import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  changePasswordService,
  forgetPasswordService,
  loginUserService,
  recoverPasswordService,
} from "./auth.services";

const userLoginController = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await loginUserService(body);
  res.cookie("refreshToken", result?.refreshToken, {
    secure: false,
    httpOnly: true,
  });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Login failed. Invalid credentials. Please check your email and password."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful! Welcome back to GreenSteps.",
      data: result,
    });
  }
});
const changePasswordController = catchAsync(async (req, res) => {
  const body = req.body;
  const email = req.user.email;
  const result = await changePasswordService(email, body);

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password change failed. Please ensure your email and old password are correct."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Password changed successfully! You can now use your new password to log in.",
      data: result,
    });
  }
});

const forgetPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await forgetPasswordService(email);
  if (!result.accepted.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password reset failed. Please ensure your email address is correct and try again."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Password reset request received. Please check your email for instructions on how to reset your password.",
    });
  }
});

//  recover password
const recoverPasswordController = catchAsync(async (req, res) => {
  const { email, token } = req.query;
  const { newPassword } = req.body;
  const result = await recoverPasswordService(email, token, newPassword);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password reset failed. Please try again later."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Your password has been successfully reset. You can now log in with your new password.",
    });
  }
});

export const authController = {
  userLoginController,
  changePasswordController,
  forgetPasswordController,
  recoverPasswordController,
};
