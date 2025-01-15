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
exports.getUserService = exports.createUserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const user_model_1 = __importDefault(require("./user.model"));
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.default.isUserExists(payload.email);
    if (isUserExists) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, "User with this email is already exist");
    }
    else {
        const result = yield user_model_1.default.create(payload);
        return result;
    }
});
exports.createUserService = createUserService;
const getUserService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.find({});
    return result;
});
exports.getUserService = getUserService;
