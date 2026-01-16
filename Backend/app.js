import express from "express";
import { MongoClient } from "mongodb";
import OAuthServer from "express-oauth-server";
import "dotenv/config";

import register from "./routes/register.js";
import eventRoutes from "./routes/event.routes.js";
import logger from "./middleware/logger.js";
import oAuthModel from "./oAuth/oAuthModel.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db("wap5");
    app.set("db", db);

    await db.collection("token").createIndex(
        { accessTokenExpiresAt: 1 },
        { expireAfterSeconds: 0 }
    );
    await db.collection("token").createIndex(
        { refreshTokenExpiresAt: 1 },
        { expireAfterSeconds: 0 }
    );

    const oauth = new OAuthServer({
        model: oAuthModel(db),
    });

    app.use(
        "/api/token",
        oauth.token({
            requireClientAuthentication: {
                password: false,
                refresh_token: false,
            },
        })
    );

    app.use("/api/register", register);

    app.use("/api/events", oauth.authenticate(), eventRoutes);

    app.use((err, req, res, next) => {
        console.error("OAuth / API Error:", err);

        if (err.status) {
            res.status(err.status).json({
                error: err.name,
                error_description: err.message,
            });
        } else {
            res.status(500).json({
                error: "server_error",
                error_description: "Internal server error",
            });
        }
    });

} catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
}


export default app;
