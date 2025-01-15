import { Router } from "express";
import { authController } from "./auth.controller";
import AuthGard from "../../middleware/AuthGard";

const router = Router();
router.post("/login", authController.userLoginController);
router.post(
  "/change-password",
  AuthGard("admin", "moderator", "salesman", "super-admin", "user"),
  authController.changePasswordController
);
router.post("/forget-password", authController.forgetPasswordController);
router.post("/recover-password", authController.recoverPasswordController);
export default router;
