import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video id must be given");
  }

  if (isValidObjectId(videoId)) {
    throw new ApiError(400, "the given video id is not valid");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

// import mongoose, { Schema } from "mongoose";

// const likeSchema = new Schema(
//   {
//     video: {
//       type: Schema.Types.ObjectId,
//       ref: "Video",
//     },
//     comment: {
//       type: Schema.Types.ObjectId,
//       ref: "Comment",
//     },
//     tweet: {
//       type: Schema.Types.ObjectId,
//       ref: "Tweet",
//     },
//     likeBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// export const Like = mongoose.model("Like", likeSchema);
