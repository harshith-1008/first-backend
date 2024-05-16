import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user?._id;
  if (!videoId || !user) {
    throw new ApiError(400, "video id must be given");
  }

  if (isValidObjectId(videoId) || !isValidObjectId(user)) {
    throw new ApiError(400, "the given video id is not valid");
  }

  const liked = await Like.findOne({
    $and: [{ video: videoId }, { likeBy: user }],
  });

  let likeStatus = "";
  if (!liked) {
    await Like.create({
      video: videoId,
      likeBy: user,
    });
    likeStatus = "LIKED";
  } else {
    await Like.findOneAndDelete({ video: videoId, likeBy: user });
    likeStatus = "UNLIKED";
  }

  if (likeStatus == "") {
    throw new ApiError(500, "something went wrong while liking video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus, "vidoe like toggeled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user?._id;
  if (!commentId || !user) {
    throw new ApiError(400, "comment id must be given");
  }

  if (isValidObjectId(commentId) || !isValidObjectId(user)) {
    throw new ApiError(400, "the given comment id is not valid");
  }

  const liked = await Like.findOne({
    $and: [{ comment: commentId }, { likeBy: user }],
  });

  let likeStatus = "";
  if (!liked) {
    await Like.create({
      comment: commentId,
      likeBy: user,
    });
    likeStatus = "LIKED";
  } else {
    await Like.findOneAndDelete({ comment: commentId, likeBy: user });
    likeStatus = "UNLIKED";
  }

  if (likeStatus == "") {
    throw new ApiError(500, "something went wrong while liking comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likeStatus, "comment like toggeled successfully")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const user = req.user?._id;
  if (!tweetId || !user) {
    throw new ApiError(400, "tweet id must be given");
  }

  if (isValidObjectId(tweetId) || !isValidObjectId(user)) {
    throw new ApiError(400, "the given tweet id is not valid");
  }

  const liked = await Like.findOne({
    $and: [{ tweet: tweetId }, { likeBy: user }],
  });

  let likeStatus = "";
  if (!liked) {
    await Like.create({
      tweet: tweetId,
      likeBy: user,
    });
    likeStatus = "LIKED";
  } else {
    await Like.findOneAndDelete({ tweet: tweetId, likeBy: user });
    likeStatus = "UNLIKED";
  }

  if (likeStatus == "") {
    throw new ApiError(500, "something went wrong while toggeling tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus, "tweet like toggeled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const user = req.user?._id;

  if (!user) {
    throw new ApiError(400, "user is not defined");
  }

  if (isValidObjectId(user)) {
    throw new ApiError(400, "the user id is not valid");
  }

  const likedVideos = await Like.find({ likeBy: user }).populate("video");

  if (!likedVideos) {
    return res.status(200).json(new ApiResponse(200, [], "no liked videos"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
