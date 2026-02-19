import { Router } from "express";
import { triageTicket } from "../services/triage.js";
import { addTicket, readTickets, writeTickets } from "../services/storage.js";

const router = Router();

// Create new ticket
router.post("/", (req, res) => {
    const { title, description } = req.body;

    // Validate required fields
    if (!title || !description) { 
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

    // Save ticket to ticket.json
    addTicket(newTicket);

    // Return created ticket to client 
    return res.status(201).json(newTicket);
});

// Returns all stored tickets from tickets.json
router.get("/", (req, res) => {
    try {
        let tickets = readTickets();

        // Filters tickets by priority
        if (req.query.priority) {
            tickets = tickets.filter(
                ticket => ticket.routing?.priority === req.query.priority
            );
        }

        // Sorts ticket by newest first
        tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return res.json(tickets);
    } catch (err) {
        console.error("GET /tickets error:", err);
        return res.status(500).json({ error: "Failed to fetch tickets"});
    }
})

// Get a single ticket by ID
router.get("/:id", (req, res) => {
    try {
        const tickets = readTickets();
        const ticket = tickets.find((t) => t.id === req.params.id);

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        return res.json(ticket);
    } catch (err) {
        console.error("GET /tickets/:id error:", err);
        return res.status(500).json({ error: "Failed to fetch ticket" });
    }
});

// Delete a ticket by ID
router.delete("/:id", (req, res) => {
    try {
        const tickets = readTickets();
        const updateTickets = tickets.filter((t) => t.id !== req.params.id);

        if (updateTickets.length === tickets.length) {
            return res.status(404).json({ error: "Ticket not found"});
        }

        writeTickets(updateTickets);

        return res.json({ message: "Ticket deleted", id: req.params.id });
    } catch (err) {
        console.error("DELETE /tickets/:id error", err);
        return res.status(500).json({ error: "Failed to delete ticket" });
    }
});

export default router;