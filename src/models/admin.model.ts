import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  adminId: string;
  password: string;
  comparePassword(plain: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    adminId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export const Admin = model<IAdmin>("Admin", adminSchema);
