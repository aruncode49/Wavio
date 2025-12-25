import { Router } from "express";
import { requireAuth, requireAdmin } from "@/middlewares/auth.middleware.js";
import {
  createSongController,
  updateSongController,
  deleteSongController,
  getAllSongsController,
  getSongByIdController,
  getRandomSongsController,
} from "@/controllers/song.controller.js";

const router = Router();

// static routes
router.get("/", requireAuth, requireAdmin, getAllSongsController);
router.post("/create", requireAuth, requireAdmin, createSongController);
router.get("/random", getRandomSongsController);

// dynamic routes
router.delete("/:id", requireAuth, requireAdmin, deleteSongController);
router.put("/:id", requireAuth, requireAdmin, updateSongController);
router.get("/:id", getSongByIdController);

export default router;
