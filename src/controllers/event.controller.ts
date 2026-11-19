import { Request, Response } from "express";
import { EventModel } from "../models/event.model";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

export const listEvents = asyncHandler(async (_req: Request, res: Response) => {
  const data = await EventModel.find().sort({ date: -1 });
  res.json({ success: true, data });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const doc = await EventModel.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Event not found");
  res.json({ success: true, data: doc });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const doc = await EventModel.create({ date: req.body.date, description: req.body.description });
  res.status(201).json({ success: true, message: "Event saved", data: doc });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const doc = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) throw new HttpError(404, "Event not found");
  res.json({ success: true, message: "Event updated", data: doc });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const doc = await EventModel.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Event not found");
  res.json({ success: true, message: "Event deleted" });
});
