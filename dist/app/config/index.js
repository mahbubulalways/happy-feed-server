"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URI: process.env.DATABASE_URI,
    BCRYPT_SALT: process.env.BCRYPT_SALT_ROUND,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_ACCESS: process.env.REFRESH_TOKEN_ACCESS,
    EMAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_SENDER_ADDRESS: process.env.MAIL_SENDER_ADDRESS,
    SSL_STORE_ID: process.env.SSL_STORE_ID,
    SSS_STORE_PASSWORD: process.env.SSS_STORE_PASSWORD,
    SSS_IS_LIVE: false,
    PAYMENT_STATUS_URL: process.env.PAYMENT_STATUS_URL,
    PAYMENT_REDIRECT_URL: process.env.PAYMENT_REDIRECT_URL,
};
