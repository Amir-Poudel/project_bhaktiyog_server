import dotenv from "dotenv";
import path from "path";
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGO_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  serverUrl: (process.env.SERVER_URL ?? "http://localhost:5000").replace(/\/$/, ""),
  adminId: required("ADMIN_ID"),
  adminPassword: required("ADMIN_PASSWORD"),
  uploadDir: path.resolve(process.cwd(), "uploads"),
};
