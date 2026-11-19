import { Request, Response } from "express";
import { EventModel } from "../models/event.model";
import { Topic } from "../models/topic.model";
import { Media } from "../models/media.model";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET /api/programs  ->  powers localhost:3000/programs (कार्यक्रम)
 * Saved events AND saved topics, merged and sorted newest first.
 * Query: ?type=event|topic  &page=1  &limit=12
 */
export const getPrograms = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type === "event" || req.query.type === "topic" ? req.query.type : undefined;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);

  const [events, topics] = await Promise.all([
    type === "topic" ? [] : EventModel.find().lean(),
    type === "event" ? [] : Topic.find(),
  ]);

  const items = [
    ...events.map((e: any) => ({
      _id: e._id,
      type: "event" as const,
      date: e.date,
      description: e.description,
      createdAt: e.createdAt,
    })),
    ...topics.map((t) => {
      const j: any = t.toJSON(); // photos converted to absolute URLs
      return {
        _id: j._id,
        type: "topic" as const,
        title: j.title,
        date: j.createdAt,
        description: j.description,
        photos: j.photos,
        createdAt: j.createdAt,
      };
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = items.length;
  res.json({
    success: true,
    data: items.slice((page - 1) * limit, page * limit),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

/**
 * GET /api/gallery  ->  powers localhost:3000/gallery (ग्यालरी)
 * Returns saved media entries plus a flat list of every photo/video, newest first.
 * Query: ?type=photo|video
 */
export const getGallery = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type === "photo" || req.query.type === "video" ? req.query.type : undefined;
  const entries = await Media.find().sort({ createdAt: -1 });

  const items = entries.flatMap((m) => {
    const j: any = m.toJSON();
    return [
      ...(type === "video" ? [] : j.photos.map((url: string) => ({ mediaId: j._id, type: "photo" as const, url, createdAt: j.createdAt }))),
      ...(type === "photo" ? [] : j.videos.map((url: string) => ({ mediaId: j._id, type: "video" as const, url, createdAt: j.createdAt }))),
    ];
  });

  res.json({ success: true, data: entries, items, total: items.length });
});
