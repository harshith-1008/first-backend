import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "video id is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "provide valid video id");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const allComments = await Comment.paginate({ video: videoId }, options);

  if (!allComments) {
    throw new ApiError(500, "error loading comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allComments, "comments fetched succesfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { content } = req.body;
  const { videoId } = req.params;

  if (!user || !content || !videoId) {
    throw new ApiError(400, "content or video if must be given");
  }

  if (!isValidObjectId(user) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "user and video id must be valid");
  }

  const addedComment = await Comment.create({
    content,
    owner: user,
    video: videoId,
  });

  if (!addedComment) {
    throw new ApiError(500, "something went wrong while adding comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addedComment, "comment added succesfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId) {
    throw new ApiError(400, "commentId must be given");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "comment id must be valid");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content: content },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(500, "error occured while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "commentId must be given");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "comment id must be valid");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (deletedComment) {
    throw new ApiError(500, "error occured while deleting comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
