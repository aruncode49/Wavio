import type { UploadedFile } from "express-fileupload";
import { NextFunction, Request, Response } from "express";

import uploadFile from "@/lib/uploadFiles.js";
import { Album } from "@/models/album.model.js";
import { Song } from "@/models/song.model.js";

export const createAlbumController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if image file is uploaded
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload image file",
      });
    }

    const { title, artist, releaseDate } = req.body;
    const { imageFile } = req.files;

    // upload image file
    const imageUrl = await uploadFile(imageFile as UploadedFile);

    // create album
    const album = await Album.create({
      title,
      artist,
      releaseDate,
      imageUrl,
    });

    // return created album
    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: album,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAlbumController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // find album by id and delete it
    const album = await Album.findByIdAndDelete(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // delete songs of that album
    await Song.deleteMany({ albumId: id });

    // return deleted album
    return res.status(200).json({
      success: true,
      message: "Album deleted successfully",
      data: album,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAlbumController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // find album by id
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // update image file if exists
    let imageUrl: string | undefined;
    if (req.files?.imageFile) {
      imageUrl = await uploadFile(req.files.imageFile as UploadedFile);
    }

    // update album
    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      },
      { new: true }
    );

    // return updated album
    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllAlbumsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find all albums
    const albums = await Album.find();

    // return albums
    return res.status(200).json({
      success: true,
      message: "Albums fetched successfully",
      data: albums,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAlbumByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // find album by id and populate songs
    const album = await Album.findById(id).populate("songs");

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // return album
    return res.status(200).json({
      success: true,
      message: "Album fetched successfully",
      data: album,
    });
  } catch (error) {
    return next(error);
  }
};
