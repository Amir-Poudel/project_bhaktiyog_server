import { Request, Response } from "express";
import { Media } from "../models/media.model";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { removeFiles, toStringArray } from "../utils/files";
import { savedPaths } from "../middleware/upload";

export const listMedia = asyncHandler(async (_req: Request, res: Response) => {
  const data = await Media.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Media not found");
  res.json({ success: true, data: doc });
});

export const createMedia = asyncHandler(async (req: Request, res: Response) => {
  const photos = savedPaths(req, "photos");
  const videos = savedPaths(req, "videos");
  if (photos.length === 0 && videos.length === 0) {
    throw new HttpError(400, "Add at least one photo or video");
  }
  const doc = await Media.create({ photos, videos });
  res.status(201).json({ success: true, message: "Media saved", data: doc });
});

export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Media not found");

  const tail = (u: string) => u.slice(u.indexOf("/uploads/"));
  const rmPhotos = toStringArray(req.body.removePhotos).map(tail);
  const rmVideos = toStringArray(req.body.removeVideos).map(tail);
  const removedPhotos = doc.photos.filter((p) => rmPhotos.includes(p));
  const removedVideos = doc.videos.filter((v) => rmVideos.includes(v));

  doc.photos = [...doc.photos.filter((p) => !removedPhotos.includes(p)), ...savedPaths(req, "photos")];
  doc.videos = [...doc.videos.filter((v) => !removedVideos.includes(v)), ...savedPaths(req, "videos")];

  if (doc.photos.length === 0 && doc.videos.length === 0) {
    throw new HttpError(400, "A media entry needs at least one photo or video (delete it instead)");
  }
  await doc.save();
  await removeFiles([...removedPhotos, ...removedVideos]);

  res.json({ success: true, message: "Media updated", data: doc });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Media.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Media not found");
  await removeFiles([...doc.photos, ...doc.videos]);
  res.json({ success: true, message: "Media deleted" });
});
