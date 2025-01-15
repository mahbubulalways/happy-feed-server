import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { createUserService, getUserService } from "./user.services";
import sendResponse from "../../utils/sendResponse";

const createUserController = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await createUserService(body);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Registration failed. Please try again."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registration successful! Welcome to GreenSteps.",
      data: result,
    });
  }
});
const getUserController = catchAsync(async (req, res) => {
  const result = await getUserService();
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found. Please check the provided information."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully.",
      data: result,
    });
  }
});

export const userController = {
  createUserController,
  getUserController,
};
