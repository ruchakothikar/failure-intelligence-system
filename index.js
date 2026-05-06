const express = require("express");
const app = express();

app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");

app.use("/api", userRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Hello World",
        status: "success"
    });
});

app.get("/api/status", (req, res) => {
    res.json({
        status: "ok",
        service: "backend running"
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});