import { Router } from "express";
import { authCallbackController } from "@/controllers/auth.controller.js";

const router = Router();

router.post("/auth-callback", authCallbackController);

export default router;
