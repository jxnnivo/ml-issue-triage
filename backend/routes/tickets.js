import { Router } from "express";
import { triageTicket } from "../services/triage.js";
import { addTicket } from "../services/storage.js";

const router = Router();

// Create new ticket
router.post("/ticket", (req, res) => {
    const { title, description } = req.body;

    // Validate required fields
    if (!title || ! description) { 
        return res.status(400).json({
            error: "Title and description are required",
        });
    }

    // Run rules-based triage
    const triage = triageTicket({ title, body: description });

    // Build full ticket object
    const newTicket = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        title,
        description,
        status: "open",
        created_at: new Date().toISOString(),
        ...triage,
    };

    // Persist ticket to JSON storage
    addTicket(newTicket);

    // Return created ticket
    return res.status(201).json(newTicket);
});

export default router;