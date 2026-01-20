import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

export default app;
