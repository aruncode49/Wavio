import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello Statistics Routes!");
});

export default router;
