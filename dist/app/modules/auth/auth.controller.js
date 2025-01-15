"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_services_1 = require("./auth.services");
const userLoginController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield (0, auth_services_1.loginUserService)(body);
    res.cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
        secure: false,
        httpOnly: true,
    });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Login failed. Invalid credentials. Please check your email and password.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Login successful! Welcome back to GreenSteps.",
            data: result,
        });
    }
}));
const changePasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = req.user.email;
    const result = yield (0, auth_services_1.changePasswordService)(email, body);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Password change failed. Please ensure your email and old password are correct.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Password changed successfully! You can now use your new password to log in.",
            data: result,
        });
    }
}));
const forgetPasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield (0, auth_services_1.forgetPasswordService)(email);
    if (!result.accepted.length) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Password reset failed. Please ensure your email address is correct and try again.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Password reset request received. Please check your email for instructions on how to reset your password.",
        });
    }
}));
//  recover password
const recoverPasswordController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = req.query;
    const { newPassword } = req.body;
    const result = yield (0, auth_services_1.recoverPasswordService)(email, token, newPassword);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Password reset failed. Please try again later.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Your password has been successfully reset. You can now log in with your new password.",
        });
    }
}));
exports.authController = {
    userLoginController,
    changePasswordController,
    forgetPasswordController,
    recoverPasswordController,
};
