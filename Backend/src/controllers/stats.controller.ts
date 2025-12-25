import { NextFunction, Request, Response } from "express";
import { User } from "@/models/user.model.js";
import { Song } from "@/models/song.model.js";
import { Album } from "@/models/album.model.js";

export const getAllStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch total counts and unique artists across the platform in parallel
    const [usersCount, songsCount, albumsCount, songArtists, albumArtists] =
      await Promise.all([
        User.countDocuments(),
        Song.countDocuments(),
        Album.countDocuments(),
        Song.distinct("artist"),
        Album.distinct("artist"),
      ]);

    // Calculate unique artists count
    const uniqueArtistsCount = new Set([...songArtists, ...albumArtists]).size;

    // Return stats
    return res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        users: usersCount,
        songs: songsCount,
        albums: albumsCount,
        artists: uniqueArtistsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
