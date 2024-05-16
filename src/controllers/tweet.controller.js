import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content, owner } = req.body;
  if (!content) {
    throw new ApiError(400, "content is required");
  }
  const userExist = await User.findOne({ username: owner.toLowerCase() });

  if (!userExist) {
    throw new ApiError(400, "user does not exist");
  }

  const tweet = await Tweet.create({
    owner: userExist._id,
    content,
  });

  const sentTweet = await Tweet.findById(tweet._id).populate(
    "owner",
    "username"
  );

  if (!sentTweet) {
    throw new ApiError(500, "something went wrong while tweeting");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sentTweet, "tweeted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new ApiError(400, "user is not valid");
  }
  const userExist = await User.findOne({ username: username.toLowerCase() });
  if (!userExist) {
    throw new ApiError(400, "user does not exist");
  }
  const alltweets = await Tweet.find({ owner: userExist._id }).populate(
    "owner",
    "username"
  ); //for frontend guy we dont make any changes in the actual database

  return res
    .status(200)
    .json(new ApiResponse(200, alltweets, "user tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweet is invalid");
  }

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: content,
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "something went wrong while updating tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweeted updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet id");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(500, "something went wrong while deleting");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
