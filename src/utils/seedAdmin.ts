import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model";
import { env } from "../config/env";

/** ADMIN_ID / ADMIN_PASSWORD in .env are the source of truth for the single admin account. */
export const seedAdmin = async (): Promise<void> => {
  const existing = await Admin.findOne({ adminId: env.adminId }).select("+password");

  if (!existing) {
    await Admin.create({ adminId: env.adminId, password: env.adminPassword });
    console.log(`Admin created: ${env.adminId}`);
    return;
  }
  if (!(await bcrypt.compare(env.adminPassword, existing.password))) {
    existing.password = env.adminPassword; // re-hashed by pre-save hook
    await existing.save();
    console.log("Admin password synced with .env");
  }
};
