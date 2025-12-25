import { Router } from "express";
import { requireAdmin, requireAuth } from "@/middlewares/auth.middleware.js";
import {
  createAlbumController,
  deleteAlbumController,
  updateAlbumController,
  getAllAlbumsController,
  getAlbumByIdController,
} from "@/controllers/album.controller.js";

const router = Router();

// static routes
router.get("/", getAllAlbumsController);
router.post("/create", requireAuth, requireAdmin, createAlbumController);

// dynamic routes
router.get("/:id", getAlbumByIdController);
router.delete("/:id", requireAuth, requireAdmin, deleteAlbumController);
router.put("/:id", requireAuth, requireAdmin, updateAlbumController);

export default router;
