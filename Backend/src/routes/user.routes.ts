import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware.js";
import { getAllUserController } from "@/controllers/user.controller.js";

const router = Router();

// static routes
router.get("/", requireAuth, getAllUserController);

// TODO: get messages (between two chats)

export default router;
