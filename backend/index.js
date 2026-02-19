// Import express framework and ticket route module.
import ticketsRouter from "./routes/tickets.js";
import express from "express";

// Initialize Express application.
const app = express();

// Enable JSON body parsing for incoming API requests.
app.use(express.json());

// Mount ticket-related routes under /tickets namespace.
app.use("/tickets", ticketsRouter);

// Define application port
const port = 3001;

// Root health endpoint to confirm server is running.
app.get("/", (req, res) => {
    res.send("Server running");
});

// Lightweight API status endpoint for monitoring/testing.
app.get("/status", (req, res) => {
    res.json({ status: "API is working"});
});

// Start server and log listening port.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});