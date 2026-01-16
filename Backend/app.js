import express from "express";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import logger from "./middleware/logger.js";

const app = express();

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

export default app;
