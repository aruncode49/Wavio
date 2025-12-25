import { Router } from "express";
import {
  authCallbackController,
  checkAdminController,
} from "@/controllers/auth.controller.js";
import { requireAdmin, requireAuth } from "@/middlewares/auth.middleware.js";

const router = Router();

// static routes
router.post("/callback", authCallbackController);
router.get("/check-admin", requireAuth, requireAdmin, checkAdminController);

export default router;
