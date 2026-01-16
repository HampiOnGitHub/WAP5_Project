import express from "express";
import { MongoClient } from "mongodb";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import logger from "./middleware/logger.js";
import 'dotenv/config';

const app = express();
const connectionString = process.env.MONGO_URI;

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

try {
    const client = new MongoClient(connectionString);
    await client.connect();

    const db = client.db("wap5");
    app.set("db", db);

    console.log("✅ Connected to local MongoDB (wap5)");
} catch (err) {
    console.error("❌ MongoDB connection failed:", err);
}

export default app;
