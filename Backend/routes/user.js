import express from "express";
const router = express.Router();

let users = [
    { id: 1, name: "Alpha", email: "alpha@test.com", password: "1234" },
];

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Bitte alle Felder ausfüllen!" });
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Benutzer existiert bereits!" });
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    res.status(201).json({
        message: "Registrierung erfolgreich!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Ungültige Login-Daten!" });
    }

    res.json({
        message: "Login erfolgreich!",
        user: { id: user.id, name: user.name, email: user.email },
    });
});

router.get("/", (req, res) => {
    res.json(users.map(({ password, ...u }) => u));
});

export default router;
