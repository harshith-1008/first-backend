import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { subscriber } = req.user._id;
  if (!channelId || !subscriber) {
    throw new ApiError(400, "channel id and subscriber is required");
  }

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "the channel id invalid");
  }

  const isSubscribed = await Subscription.findOne({
    $and: [{ subscriber }, { channel: channelId }],
  });
  let status = "SUBSCRIBED";
  if (!isSubscribed) {
    await Subscription.create({
      subscriber,
      channel: channelId,
    });
  } else {
    await Subscription.findByIdAndDelete(isSubscribed._id);
    status = "UNSUBSCRIBED";
  }

  return res
    .status(200)
    .json(new ApiResponse(200, status, "toogle subscripiton successful"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "channelid is required");
  }

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "channel id is invalid");
  }

  const subscribers = await Subscription.find({ channel: channelId });
  const subscriberIds = subscribers.map(
    (subscription) => subscription.subscriber
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, subscriberIds, "subscribers fetched successfuly")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "subscriber id not valid");
  }

  const channels = await Subscription.find({ subscriber: subscriberId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
