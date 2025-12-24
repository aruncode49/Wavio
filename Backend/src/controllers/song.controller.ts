import type { UploadedFile } from "express-fileupload";
import { Request, Response, NextFunction } from "express";
import uploadFile from "@/lib/uploadFiles.js";
import { Song } from "@/models/song.model.js";
import { Album } from "@/models/album.model.js";

export const createSongController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !req.files.imageFile || !req.files.audioFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload image and audio file",
      });
    }

    const { albumId, artist, title, duration } = req.body;
    const { imageFile, audioFile } = req.files;

    const imageUrl = await uploadFile(imageFile as UploadedFile);
    const audioUrl = await uploadFile(audioFile as UploadedFile);

    const song = await Song.create({
      albumId,
      artist,
      title,
      duration,
      imageUrl,
      audioUrl,
    });

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSongController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    // if song not found
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // if song belongs to an album then remove that song from that album
    if (song?.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    // delete song
    await song.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully",
      data: song,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSongController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { albumId: newAlbumId, ...songData } = req.body;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    const oldAlbumId = song.albumId?.toString();

    // update song
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      { ...songData, albumId: newAlbumId },
      { new: true }
    );

    // album changed
    if (oldAlbumId && oldAlbumId !== newAlbumId) {
      await Album.findByIdAndUpdate(oldAlbumId, {
        $pull: { songs: updatedSong!._id },
      });
    }

    if (newAlbumId && oldAlbumId !== newAlbumId) {
      await Album.findByIdAndUpdate(newAlbumId, {
        $addToSet: { songs: updatedSong!._id },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song updated successfully",
      data: updatedSong,
    });
  } catch (error) {
    next(error);
  }
};
