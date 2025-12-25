import { Router } from "express";
import { requireAdmin, requireAuth } from "@/middlewares/auth.middleware.js";
import { getAllStatsController } from "@/controllers/stats.controller.js";

const router = Router();

// static routes
router.get("/", requireAuth, requireAdmin, getAllStatsController);

export default router;
