import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: Number, //cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongoosePaginate);
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
