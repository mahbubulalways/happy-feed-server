import { Router } from "express";
import userRoutes from "../modules/users/user.route";
import authRoutes from "../modules/auth/auth.route";
import productsRoutes from "../modules/products/products.route";
import orderRoutes from "../modules/payment/payment.route";
const router = Router();

const applicationRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/product",
    route: productsRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
];

applicationRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
