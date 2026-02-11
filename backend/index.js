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

    res.json ({
        message: "Ticket recieved",
        title,
        description
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});