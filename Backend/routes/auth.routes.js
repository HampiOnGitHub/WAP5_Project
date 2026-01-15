import express from "express";
import { users } from "../data/users.mock.js";
import generateId from "../utils/generateId.js";

const router = express.Router();

router.post("/login", (req, res) => {
    const { identifier, password } = req.body;

    const user = users.find(
        (u) =>
            (u.email === identifier || u.username === identifier) &&
            u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            token: "mock-token",
        },
    });
});

router.post("/register", (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const exists = users.find(
        (u) => u.email === email || u.username === username
    );

    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
        id: generateId(),
        username,
        email,
        password,
        firstName,
        lastName,
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registered successfully",
    });
});

export default router;
