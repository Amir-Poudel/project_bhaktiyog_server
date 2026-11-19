import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Admin } from "../models/admin.model";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

const signToken = (id: string) =>
  jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { adminId, password } = req.body;
  const admin = await Admin.findOne({ adminId }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw new HttpError(401, "Invalid ID or password");
  }
  const token = signToken(admin._id.toString());
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  // Client should redirect to /admin on success.
  res.json({
    success: true,
    message: "Login successful",
    token,
    redirectTo: "/admin",
    data: { adminId: admin.adminId },
  });
});

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

export const me = (req: Request, res: Response) => {
  res.json({ success: true, data: { adminId: req.admin!.adminId } });
};
