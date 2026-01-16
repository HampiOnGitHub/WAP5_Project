import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    const db = req.app.get("db");
    const events = await db.collection("events").find().toArray();
    res.json(events);
});

router.get("/:id", async (req, res) => {
    const db = req.app.get("db");

    try {
        const event = await db.collection("events").findOne({
            _id: new ObjectId(req.params.id),
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch {
        res.status(400).json({ message: "Invalid event id" });
    }
});

router.post("/", async (req, res) => {
    const db = req.app.get("db");
    const authUser = res.locals.oauth.token.user;

    const {
        sport,
        descriptionGer,
        descriptionEn,
        maxParticipants,
        dateAndTime,
    } = req.body;

    if (
        !sport ||
        !descriptionGer ||
        !descriptionEn ||
        !maxParticipants ||
        !dateAndTime
    ) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const newEvent = {
        sport,
        descriptionGer,
        descriptionEn,
        maxParticipants,
        dateAndTime,
        creatorId: authUser._id,
        participants: [
            {
                userId: authUser._id,
                username: authUser.username,
            },
        ],
        createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
});

router.put("/:id", async (req, res) => {
    const db = req.app.get("db");
    const authUser = res.locals.oauth.token.user;

    const event = await db.collection("events").findOne({
        _id: new ObjectId(req.params.id),
    });

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    if (!event.creatorId.equals(authUser._id)) {
        return res.status(403).json({ message: "Not authorized" });
    }

    await db.collection("events").updateOne(
        { _id: event._id },
        { $set: req.body }
    );

    const updated = await db.collection("events").findOne({
        _id: event._id,
    });

    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const db = req.app.get("db");
    const authUser = res.locals.oauth.token.user;

    const event = await db.collection("events").findOne({
        _id: new ObjectId(req.params.id),
    });

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    if (!event.creatorId.equals(authUser._id)) {
        return res.status(403).json({ message: "Not authorized" });
    }

    await db.collection("events").deleteOne({ _id: event._id });
    res.json({ message: "Event deleted" });
});

router.post("/:id/join", async (req, res) => {
    const db = req.app.get("db");
    const authUser = res.locals.oauth.token.user;

    const event = await db.collection("events").findOne({
        _id: new ObjectId(req.params.id),
    });

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const alreadyJoined = event.participants.some(
        (p) => p.userId.equals(authUser._id)
    );

    if (alreadyJoined) {
        return res.status(400).json({ message: "Already joined" });
    }

    if (event.participants.length >= event.maxParticipants) {
        return res.status(400).json({ message: "Event full" });
    }

    await db.collection("events").updateOne(
        { _id: event._id },
        {
            $push: {
                participants: {
                    userId: authUser._id,
                    username: authUser.username,
                },
            },
        }
    );

    const updated = await db.collection("events").findOne({
        _id: event._id,
    });

    res.json(updated);
});

router.post("/:id/leave", async (req, res) => {
    const db = req.app.get("db");
    const authUser = res.locals.oauth.token.user;

    await db.collection("events").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
            $pull: {
                participants: { userId: authUser._id },
            },
        }
    );

    const updated = await db.collection("events").findOne({
        _id: new ObjectId(req.params.id),
    });

    res.json(updated);
});

export default router;
