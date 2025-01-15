"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("../modules/users/user.route"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const products_route_1 = __importDefault(require("../modules/products/products.route"));
const payment_route_1 = __importDefault(require("../modules/payment/payment.route"));
const router = (0, express_1.Router)();
const applicationRoutes = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/product",
        route: products_route_1.default,
    },
    {
        path: "/order",
        route: payment_route_1.default,
    },
];
applicationRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
