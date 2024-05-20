import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloduinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;
  const userId = req.user?._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "user id should be valid");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  if (sortBy && sortType) {
    options.sort = { [sortBy]: sortType === "asc" ? 1 : -1 };
  }

  const videos = await Video.paginate({ owner: userId }, options);

  if (!videos) {
    throw new ApiError(500, "error occured while getting videos");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(title, description);
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const user = req.user?._id;
  console.log(thumbnailLocalPath);
  console.log(videoLocalPath);
  console.log(user);
  console.log(isValidObjectId(user));
  if (
    !title ||
    !description ||
    !thumbnailLocalPath ||
    !videoLocalPath ||
    !user ||
    !isValidObjectId(user)
  ) {
    throw new ApiError(400, "all fields are requierd");
  }

  const thumbnail = await uploadOnCloduinary(thumbnailLocalPath);
  const video = await uploadOnCloduinary(videoLocalPath);

  if (!thumbnail || !video) {
    throw new ApiError(500, "error occured while uploading to cloudinary");
  }

  const uploadedVideo = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    owner: user,
    duration: video.duration,
  });

  if (!uploadedVideo) {
    throw new ApiError(500, "error occured while uploading ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, uploadedVideo, "video uploaded succesfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "no video found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  console.log(title, description);
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  if (!title && !description) {
    throw new ApiError(400, "details must be given");
  }
  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files?.thumbnail[0].path;
  }

  const thumbnail = await uploadOnCloduinary(thumbnailLocalPath);

  if (thumbnail === undefined) {
    throw new ApiError(500, "error occurred while uploading to cloudinary");
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId, {
    thumbnail: thumbnail,
    title,
    description,
  });

  if (!updatedVideo) {
    throw new ApiError(500, "error occured while updating video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "video updated succesfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deleteVideo) {
    throw new ApiError(500, "error occured while deleting video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "video deleted succesfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const videoIsPresent = await Video.findById(videoId);

  if (!videoIsPresent) {
    throw new ApiError(400, "video is not present");
  }
  let isPublished = !videoIsPresent.isPublished;
  const toggle = await Video.findByIdAndUpdate(videoIsPresent._id, {
    isPublished: isPublished,
  });

  if (!toggle) {
    throw new ApiError(500, "error occured while togglind status");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, toggle, "video status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
