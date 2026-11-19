import { Schema, model } from "mongoose";
import { toUrl } from "../utils/files";

const topicSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photos: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.photos = (ret.photos ?? []).map(toUrl);
        return ret;
      },
    },
  }
);

export const Topic = model("Topic", topicSchema);
