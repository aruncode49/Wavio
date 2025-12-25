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

    // find song by id
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // get old album id
    const oldAlbumId = song.albumId?.toString();

    // update image file if exists
    let imageUrl: string | undefined;
    if (req.files?.imageFile) {
      imageUrl = await uploadFile(req.files.imageFile as UploadedFile);
    }

    // update song data
    const updateData = {
      ...songData,
      albumId: newAlbumId,
      ...(imageUrl && { imageUrl }),
    };

    // update song
    const updatedSong = await Song.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // remove song from old album if album changed
    if (oldAlbumId && oldAlbumId !== newAlbumId) {
      await Album.findByIdAndUpdate(oldAlbumId, {
        $pull: { songs: updatedSong!._id },
      });
    }

    // add song to new album if album changed
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

export const getAllSongsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find songs in created latest order
    const songs = await Song.find().sort({ createdAt: -1 });

    // return songs
    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSongByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // find song by id
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // return song
    return res.status(200).json({
      success: true,
      message: "Song fetched successfully",
      data: song,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRandomSongsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get limit from the query params
    const { limit = 4 } = req.query;

    // find random songs using mongoose aggregate
    const songs = await Song.aggregate([
      { $sample: { size: Number(limit) } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          duration: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    // return songs
    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (error) {
    return next(error);
  }
};
