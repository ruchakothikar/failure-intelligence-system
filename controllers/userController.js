let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" }
];

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.createUser = (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id ===id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    res.json(user);
};

exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);

    res.json({ message: "User deleted" });
};