import ticketRouters from "./routes/tickets.js";
import express from "express";

const app = express();
app.use(express.json());
app.use(ticketRouters);
const port = 3001;

app.get("/", (req, res) => {
    res.send("Server running");
});

app.get("/status", (req, res) => {
    res.json({ status: "API is working"});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});