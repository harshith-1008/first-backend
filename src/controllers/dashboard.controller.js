import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  if (!user || !isValidObjectId(user)) {
    throw new ApiError(400, "Provide a valid user ID");
  }

  const totalSubscribers = await Subscription.countDocuments({ channel: user });

  const totalVideos = await Video.countDocuments({ owner: user });

  const totalViewsAggregate = await Video.aggregate([
    {
      $match: {
        owner: user,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  const totalViews =
    totalViewsAggregate.length > 0 ? totalViewsAggregate[0].totalViews : 0;

  const totalLikesAggregate = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $match: {
        "videoDetails.owner": mongoose.Types.ObjectId(user),
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: {
          $sum: 1,
        },
      },
    },
  ]);
  const totalLikes =
    totalLikesAggregate.length > 0 ? totalLikesAggregate[0].totalLikes : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const user = req.user._id;

  if (!user || !isValidObjectId(user)) {
    throw new ApiError(400, "provide valid user id");
  }

  const allVideos = await Video.find({ owner: user });

  if (!allVideos || allVideos.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "no videos found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allVideos, "all videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
