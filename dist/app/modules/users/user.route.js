"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const AuthGard_1 = __importDefault(require("../../middleware/AuthGard"));
const user_constant_1 = require("./user.constant");
const router = (0, express_1.Router)();
router.post("/create-account", user_controller_1.userController.createUserController);
router.get("/get-users", (0, AuthGard_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.SUPER_ADMIN), user_controller_1.userController.getUserController);
exports.default = router;
