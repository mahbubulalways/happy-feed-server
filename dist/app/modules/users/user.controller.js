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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const user_services_1 = require("./user.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield (0, user_services_1.createUserService)(body);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Registration failed. Please try again.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Registration successful! Welcome to GreenSteps.",
            data: result,
        });
    }
}));
const getUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_services_1.getUserService)();
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User not found. Please check the provided information.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User retrieved successfully.",
            data: result,
        });
    }
}));
exports.userController = {
    createUserController,
    getUserController,
};
