import express from "express";

const app = express();
app.use(express.json());
const port = 3001;

app.get("/", (req, res) => {
    res.send("Server running");
});

app.get("/status", (req, res) => {
    res.json({ status: "API is working"});
});

app.post("/ticket", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            error: "Title and description are required"
        });
    }

    res.json ({
        message: "Ticket received",
        title,
        description
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});