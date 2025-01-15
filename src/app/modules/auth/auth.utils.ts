import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expireTime,
  });
};
