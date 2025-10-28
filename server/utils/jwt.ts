import jwt from "jsonwebtoken";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export interface JwtPayloadBase {
  sub: string;
  role: string;
}

export function signAccessToken(payload: JwtPayloadBase) {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(payload: JwtPayloadBase) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_secret_refresh";
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.verify(token, secret) as JwtPayloadBase & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_secret_refresh";
  return jwt.verify(token, secret) as JwtPayloadBase & jwt.JwtPayload;
}
