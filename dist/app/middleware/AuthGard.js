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
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../modules/users/user.model"));
const AuthGard = (...roles) => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not authorize");
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_TOKEN_SECRET);
        const { role, email, iat } = decode;
        const user = yield user_model_1.default.isUserExists(email);
        if (!user) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found. Please check the email address.");
        }
        const isDeleted = user.isDeleted;
        if (isDeleted) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "User account has been deleted. Please contact support if this is a mistake.");
        }
        const isBlock = user.status;
        if (isBlock === "Block") {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "User account is currently blocked. Please contact support for assistance.");
        }
        if (roles && !roles.includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, `Authorization failed: Role '${role}' is not allowed.`);
        }
        req.user = decode;
        next();
    }));
};
exports.default = AuthGard;
