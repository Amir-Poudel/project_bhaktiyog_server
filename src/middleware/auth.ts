import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Admin, IAdmin } from "../models/admin.model";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

declare module "express-serve-static-core" {
  interface Request {
    admin?: IAdmin;
  }
}

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) token = header.slice(7);
  else if (req.cookies?.token) token = req.cookies.token;

  if (!token) throw new HttpError(401, "Not authenticated");

  let payload: { id: string };
  try {
    payload = jwt.verify(token, env.jwtSecret) as { id: string };
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  const admin = await Admin.findById(payload.id);
  if (!admin) throw new HttpError(401, "Admin no longer exists");
  req.admin = admin;
  next();
});
