import { Schema, model } from "mongoose";
import { toUrl } from "../utils/files";

const mediaSchema = new Schema(
  {
    photos: { type: [String], default: [] },
    videos: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.photos = (ret.photos ?? []).map(toUrl);
        ret.videos = (ret.videos ?? []).map(toUrl);
        return ret;
      },
    },
  }
);

export const Media = model("Media", mediaSchema);
