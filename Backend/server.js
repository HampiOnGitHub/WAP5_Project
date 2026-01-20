import app from "./app.js";
import { MongoClient } from "mongodb";
import OAuthServer from "express-oauth-server";
import register from "./routes/register.js";
import eventRoutes from "./routes/event.routes.js";
import oAuthModel from "./oAuth/oAuthModel.js";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db("wap5");

app.set("db", db);

const oauth = new OAuthServer({
    model: oAuthModel(db),
});

app.use("/api/token", oauth.token({
    requireClientAuthentication: {
        password: false,
        refresh_token: false,
    },
}));

app.use("/api/register", register);
app.use("/api/events", oauth.authenticate(), eventRoutes);

app.listen(3000, () => {
    console.log("🚀 Server läuft auf Port 3000");
});
