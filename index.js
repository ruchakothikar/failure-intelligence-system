const express = require("express");

const app = express();

app.use(express.json());

let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" }
];

// Routes
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

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.post("/api/users", (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id === userId);

    if(!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.name = req.body.name;

    res.json(user);
});

app.delete("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const index = users.findIndex(u => u.id === userId);

    if(index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(index, 1);

    res.json(deletedUser[0]);
});

app.get("/api/data", (req, res) => {
    res.json({
        items: [1, 2, 3, 4, 5]
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});