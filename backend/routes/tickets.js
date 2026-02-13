import { Router } from "express";

const router = Router();

router.post("/ticket", (req, res) => {
    const { title, description } = req.body;

    if (!title || ! description) { 
        return res.status(400).json({
            error: "Title and description are required",
        });
    }

    res.json({
        message: "Ticket received",
        title,
        description,
    });
});

export default router;