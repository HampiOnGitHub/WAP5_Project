import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { identifier, password } = req.body;
    const db = req.app.get("db");

    if (!identifier || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    try {
        const user = await db.collection("users").findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                token: "mock-token",
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

router.post("/register", async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    const db = req.app.get("db");

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const exists = await db.collection("users").findOne({
            $or: [{ email }, { username }],
        });

        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        await db.collection("users").insertOne({
            username,
            email,
            password,
            firstName,
            lastName,
            createdAt: new Date(),
        });

        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
});

export default router;
