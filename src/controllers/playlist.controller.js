import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, owner } = req.body;
  if (!name || !description || !owner) {
    throw new ApiError(400, "name, description and owner is required");
  }
  const userExists = await User.findOne({ username: owner });
  const playlist = await new Playlist.create({
    name,
    description,
    owner: userExists._id,
  });
  if (!playlist) {
    throw new ApiError(500, "some error occured while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist succesfully created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId is requireds");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userId is not valid");
  }
  const userPlaylists = await Playlist.find({ owner: userId });
  if (!userPlaylists) {
    throw new ApiError(400, "error occured while getting user playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylists, "user playlists fetched succesfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId is requireds");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "userId is not valid");
  }
  const userPlaylists = await Playlist.findById(userId);
  if (!userPlaylists) {
    throw new ApiError(400, "error occured while getting user playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userPlaylists, "playlist fetched succesfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(
      400,
      "playlist id and video id is required to add videos"
    );
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is not valid");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is not valid");
  }
  const playListExists = await Playlist.findById(playlistId);
  if (!playListExists) {
    throw new ApiError(400, "play list doenst exists");
  }
  const newPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: {
          $each: videoId,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!newPlaylist) {
    throw new ApiError(
      500,
      "something went wrong while adding video in the playlist"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "video added succesfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(
      400,
      "playlist id and video id is required to add videos"
    );
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is not valid");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "video id is not valid");
  }
  const playListExists = await Playlist.findById(playlistId);
  if (!playListExists) {
    throw new ApiError(400, "play list doenst exists");
  }
  const newPlaylist = await Playlist.findByIdAndUpdate(
    playListExists._id,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );
  if (!newPlaylist) {
    throw new ApiError(500, "something went wrong while deleting vidoe");
  }
  res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "video deleted succesfuly"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "playlist id is needed");
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "the id is not valid");
  }
  const playListExists = await Playlist.findById(playlistId);
  if (!playListExists) {
    throw new ApiError(400, "playlist doesnt exists");
  }
  const deletedPlaylist = await Playlist.findByIdAndDelete(playListExists._id);
  if (!deletedPlaylist) {
    throw new ApiError(500, "something went wrong while deleting playlist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { playlistId } = req.params;
  if (!playlistId || !name || !description) {
    throw new ApiError(400, "playlist id, name and description is needed");
  }
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "the id is not valid");
  }
  const playListExists = await Playlist.findById(playlistId);
  if (!playListExists) {
    throw new ApiError(400, "playlist doesnt exists");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(playListExists._id, {
    name,
    description,
  });
  if (!updatedPlaylist) {
    throw new ApiError(500, "something went wrong while updating details");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
