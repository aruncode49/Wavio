import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello Song Routes!");
});

export default router;
