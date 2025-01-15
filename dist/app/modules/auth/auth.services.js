"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.recoverPasswordService = exports.forgetPasswordService = exports.changePasswordService = exports.loginUserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const user_model_1 = __importDefault(require("../users/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const sendMail_1 = require("../../utils/sendMail");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const forgotPasswordHtmlContent_1 = __importDefault(require("../../utils/forgotPasswordHtmlContent"));
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload.email;
    const password = payload.password;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Login failed. Invalid credentials.");
    }
    const matchPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!matchPassword) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid password");
    }
    else {
        const tokenInfo = {
            role: user === null || user === void 0 ? void 0 : user.role,
            userId: user === null || user === void 0 ? void 0 : user._id,
            email: user.email,
        };
        const accessToken = (0, auth_utils_1.generateToken)(tokenInfo, config_1.default.ACCESS_TOKEN_SECRET, "1d");
        const refreshToken = (0, auth_utils_1.generateToken)(tokenInfo, config_1.default.REFRESH_TOKEN_ACCESS, "365d");
        const data = {
            accessToken,
            refreshToken,
        };
        return data;
    }
});
exports.loginUserService = loginUserService;
const changePasswordService = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    const matchPass = yield user_model_1.default.isPasswordMatch(payload.currentPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!matchPass) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid password");
    }
    const hashNewPass = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.BCRYPT_SALT));
    const updatePassword = yield user_model_1.default.findOneAndUpdate({ email }, {
        password: hashNewPass,
        passwordChangeAt: new Date(),
    }, { new: true, upsert: true });
    return updatePassword;
});
exports.changePasswordService = changePasswordService;
// forget password
const forgetPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found. Please check the email address and try again.");
    }
    const isDeleted = user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "User account has been deleted. Please contact support if you believe this is an error.");
    }
    const isBlock = user.status;
    if (isBlock === "Block") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "User account is currently blocked. Please contact support for assistance.");
    }
    //   generate token
    const tokenInfo = {
        role: user === null || user === void 0 ? void 0 : user.role,
        userId: user === null || user === void 0 ? void 0 : user._id,
        email: user.email,
    };
    const resetToken = (0, auth_utils_1.generateToken)(tokenInfo, config_1.default.ACCESS_TOKEN_SECRET, "5s");
    const resetLink = `http://localhost:3000/reset-password?email=${user === null || user === void 0 ? void 0 : user.email}&token=${resetToken}`;
    const htmlInfo = {
        name: user === null || user === void 0 ? void 0 : user.name,
        resetLink,
    };
    const htmlData = (0, forgotPasswordHtmlContent_1.default)(htmlInfo);
    const info = {
        email,
        subject: "Password Reset Request for Green Steps.",
        htmlData,
    };
    const result = yield (0, sendMail_1.sendMail)(info);
    return result;
});
exports.forgetPasswordService = forgetPasswordService;
// recover password
const recoverPasswordService = (email, token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodeToken = jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_TOKEN_SECRET);
        const hashNewPass = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.BCRYPT_SALT));
        const updatePassword = yield user_model_1.default.findOneAndUpdate({
            email: decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken.email,
        }, { password: hashNewPass, passwordChangeAt: new Date() }, { upsert: true, new: true });
        return updatePassword;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            // Handle token expiration
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Your session has expired. Please try again.");
        }
        else {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Something went wrong. Please try again later.");
        }
    }
});
exports.recoverPasswordService = recoverPasswordService;
