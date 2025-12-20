import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello User Routes!");
});

export default router;
