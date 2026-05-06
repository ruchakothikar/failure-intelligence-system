const express = require("express");
const app = express();

app.use(express.json());

//Temporary in-memory storage, to be replaced by PostgreSQL later
let failures = [];

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Failure Intelligence API",
        status: "running"
    });
});

// Create failure (ingest a failure event)
app.post("/api/failures", (req, res) => {
    const { message, service } = req.body;

    const newFailure = {
        id: failures.length + 1,
        message,
        service: service || "unknown",
        timestamp: new Date()
    };

    failures.push(newFailure);

    res.status(201).json(newFailure);
});

// Get all failures
app.get("/api/failures", (req, res) => {
    res.json(failures);
});

//Get single failure by id
app.get("/api/failures/:id", (req, res) => {
    const failure = failures.find(f =>f.id === parseInt(req.params.id));

    if(!failure) {
        return res.status(404).json({ error: "Failure not found"});
    }

    res.json(failure);

});

//Delete failure
app.delete("/api/failures/:id", (req, res) => {
    failures = failures.filter(f => f.id !== parseInt(req.params.id));

    res.json({ message: "Failure deleted" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});