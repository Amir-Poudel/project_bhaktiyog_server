import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

["photos", "videos"].forEach((d) => fs.mkdirSync(path.join(env.uploadDir, d), { recursive: true }));

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const dir = file.mimetype.startsWith("video/") ? "videos" : "photos";
    cb(null, path.join(env.uploadDir, dir));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "");
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024, files: 40 }, // 300 MB per file (videos)
  fileFilter: (_req, file, cb) => {
    const ok =
      (file.fieldname === "photos" && file.mimetype.startsWith("image/")) ||
      (file.fieldname === "videos" && file.mimetype.startsWith("video/"));
    cb(ok ? null : new HttpError(400, `Invalid file type for "${file.fieldname}": ${file.mimetype}`));
  },
});

export const topicUpload = upload.fields([{ name: "photos", maxCount: 20 }]);
export const mediaUpload = upload.fields([
  { name: "photos", maxCount: 30 },
  { name: "videos", maxCount: 10 },
]);

/** Convert multer's saved files into the "/uploads/<kind>/<name>" paths stored in the DB. */
export const savedPaths = (req: Express.Request, field: "photos" | "videos"): string[] => {
  const files = (req.files as Record<string, Express.Multer.File[]> | undefined)?.[field] ?? [];
  return files.map((f) => `/uploads/${field}/${f.filename}`);
};
