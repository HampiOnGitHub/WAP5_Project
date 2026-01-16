import express from "express";
import { events } from "../data/events.mock.js";
import generateId from "../utils/generateId.js";
import mockAuth from "../middleware/mockAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(events);
});

router.get("/:id", (req, res) => {
    const event = events.find(e => e.id === Number(req.params.id));
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
});

router.post("/", mockAuth, (req, res) => {
    const {
        sport,
        descriptionGer,
        descriptionEn,
        maxParticipants,
        dateAndTime,
    } = req.body;

    if (!sport || !descriptionGer || !descriptionEn || !maxParticipants || !dateAndTime) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const newEvent = {
        id: generateId(),
        sport,
        descriptionGer,
        descriptionEn,
        maxParticipants,
        dateAndTime,
        creatorId: req.user.id,
        participants: [
            {
                userId: req.user.id,
                username: req.user.username,
            },
        ],
        createdAt: new Date().toISOString(),
    };

    events.push(newEvent);

    res.status(201).json(newEvent);
});

router.put("/:id", mockAuth, (req, res) => {
    const event = events.find(e => e.id === Number(req.params.id));
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    if (event.creatorId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);
    res.json(event);
});

router.delete("/:id", mockAuth, (req, res) => {
    const index = events.findIndex(e => e.id === Number(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: "Event not found" });
    }

    if (events[index].creatorId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    events.splice(index, 1);
    res.json({ message: "Event deleted" });
});

router.post("/:id/join", mockAuth, (req, res) => {
    const event = events.find(e => e.id === Number(req.params.id));
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const alreadyJoined = event.participants.some(
        p => p.userId === req.user.id
    );

    if (alreadyJoined) {
        return res.status(400).json({ message: "Already joined" });
    }

    if (event.participants.length >= event.maxParticipants) {
        return res.status(400).json({ message: "Event full" });
    }

    event.participants.push({
        userId: req.user.id,
        username: req.user.username,
    });

    res.json(event);
});

router.post("/:id/leave", mockAuth, (req, res) => {
    const event = events.find(e => e.id === Number(req.params.id));
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    event.participants = event.participants.filter(
        p => p.userId !== req.user.id
    );

    res.json(event);
});

export default router;
