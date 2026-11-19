import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

eventSchema.index({ date: -1 });

export const EventModel = model("Event", eventSchema);
