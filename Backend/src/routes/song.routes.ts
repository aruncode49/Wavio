import { Router } from "express";
import { requireAuth, requireAdmin } from "@/middlewares/auth.middleware.js";
import {
  createSongController,
  updateSongController,
  deleteSongController,
} from "@/controllers/song.controller.js";

const router = Router();

// song routes that require auth and admin
router.post("/create", requireAuth, requireAdmin, createSongController);
router.delete("/delete/:id", requireAuth, requireAdmin, deleteSongController);
router.patch("/update/:id", requireAuth, requireAdmin, updateSongController);

export default router;
