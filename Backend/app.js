import express from "express";
import userRouter from "./routes/user.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from Express Backend");
});

app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});