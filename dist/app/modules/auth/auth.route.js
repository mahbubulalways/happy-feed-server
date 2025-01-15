"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const AuthGard_1 = __importDefault(require("../../middleware/AuthGard"));
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.userLoginController);
router.post("/change-password", (0, AuthGard_1.default)("admin", "moderator", "salesman", "super-admin", "user"), auth_controller_1.authController.changePasswordController);
router.post("/forget-password", auth_controller_1.authController.forgetPasswordController);
router.post("/recover-password", auth_controller_1.authController.recoverPasswordController);
exports.default = router;
