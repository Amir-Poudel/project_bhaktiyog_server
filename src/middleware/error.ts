import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { HttpError } from "../utils/httpError";
import { removeFiles } from "../utils/files";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = async (err: any, req: Request, res: Response, _next: NextFunction) => {
  // If a request failed after files were saved, clean them up.
  if (req.files && !Array.isArray(req.files)) {
    const saved = Object.entries(req.files as Record<string, Express.Multer.File[]>).flatMap(([field, list]) =>
      list.map((f) => `/uploads/${field}/${f.filename}`)
    );
    await removeFiles(saved);
  }

  let status = 500;
  let message = "Internal server error";

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "File is too large" : err.message;
  } else if (err?.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err?.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else {
    console.error(err);
  }

  res.status(status).json({ success: false, message });
};
