import { Router } from "express";
import { userController } from "./user.controller";
import AuthGard from "../../middleware/AuthGard";
import { USER_ROLE } from "./user.constant";

const router = Router();
router.post("/create-account", userController.createUserController);
router.get(
  "/get-users",
  AuthGard(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  userController.getUserController
);
export default router;
