import { Request, Response } from "express";
import { Topic } from "../models/topic.model";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { removeFiles, toStringArray } from "../utils/files";
import { savedPaths } from "../middleware/upload";

export const listTopics = asyncHandler(async (_req: Request, res: Response) => {
  const data = await Topic.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

export const getTopic = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Topic.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Topic not found");
  res.json({ success: true, data: doc });
});

export const createTopic = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Topic.create({
    title: req.body.title,
    description: req.body.description,
    photos: savedPaths(req, "photos"),
  });
  res.status(201).json({ success: true, message: "Topic saved", data: doc });
});

export const updateTopic = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Topic.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Topic not found");

  // removePhotos may contain full URLs or stored paths; match on the "/uploads/..." tail.
  const toRemove = toStringArray(req.body.removePhotos).map((u) => u.slice(u.indexOf("/uploads/")));
  const removed = doc.photos.filter((p) => toRemove.includes(p));

  if (req.body.title !== undefined) doc.title = req.body.title;
  if (req.body.description !== undefined) doc.description = req.body.description;
  doc.photos = [...doc.photos.filter((p) => !removed.includes(p)), ...savedPaths(req, "photos")];
  await doc.save();
  await removeFiles(removed);

  res.json({ success: true, message: "Topic updated", data: doc });
});

export const deleteTopic = asyncHandler(async (req: Request, res: Response) => {
  const doc = await Topic.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Topic not found");
  await removeFiles(doc.photos);
  res.json({ success: true, message: "Topic deleted" });
});
