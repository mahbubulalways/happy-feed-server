import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
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
