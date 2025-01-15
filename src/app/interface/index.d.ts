import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

declare module "sslcommerz-lts" {
  const SSLCommerz: any; // Replace 'any' with appropriate types if known
  export = SSLCommerz;
}
