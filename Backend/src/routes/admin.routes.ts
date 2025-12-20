import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello Admin Routes!");
});

export default router;
