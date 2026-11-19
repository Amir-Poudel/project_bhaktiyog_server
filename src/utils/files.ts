import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";

/** Stored paths look like "/uploads/photos/abc.jpg". Make them absolute URLs for the client. */
export const toUrl = (p: string) => (p.startsWith("http") ? p : `${env.serverUrl}${p}`);

/** Delete stored files from disk; never throws and never leaves the uploads directory. */
export const removeFiles = async (paths: string[]): Promise<void> => {
  await Promise.all(
    paths.map(async (p) => {
      const abs = path.resolve(process.cwd(), "." + p);
      if (!abs.startsWith(env.uploadDir + path.sep)) return;
      await fs.unlink(abs).catch(() => undefined);
    })
  );
};

/** Accepts a JSON array string, a repeated field, or a single value. */
export const toStringArray = (v: unknown): string[] => {
  if (v === undefined || v === null || v === "") return [];
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* not JSON */
    }
    return [v];
  }
  return [];
};
