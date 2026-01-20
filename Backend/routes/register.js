import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const db = req.app.get("db");
        const { email } = req.body;

        if (!email) {
            return res.status(400).send();
        }

        const exists = await db.collection("user_auth").findOne({ username: email });
        if (exists) {
            return res.status(400).send();
        }

        const insertion = await db.collection("user_auth").insertOne({
            username: email,
            createdAt: new Date(),
        });

        const token = uuidv4();

        await db.collection("token").insertOne({
            emailToken: token,
            emailTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // 60 min
            user_id: insertion.insertedId,
        });

        console.log(`📧 Activation link: http://localhost:3000/api/register/${token}`);

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/:token", async (req, res) => {
    try {
        const db = req.app.get("db");
        const {user_name, first_name, last_name, password } = req.body;

        if (!user_name || !first_name || !last_name || !password) {
            return res.status(400).send();
        }

        const tokenDoc = await db.collection("token").findOne({
            emailToken: req.params.token,
        });

        if (!tokenDoc) {
            return res.status(401).send();
        }

        const userInsert = await db.collection("user").insertOne({
            user_name,
            first_name,
            last_name,
            permissions: { write: true },
            createdAt: new Date(),
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const updated = await db.collection("user_auth").updateOne(
            { _id: new ObjectId(tokenDoc.user_id) },
            {
                $set: {
                    password: hashedPassword,
                    user_id: userInsert.insertedId,
                },
            }
        );

        if (updated.modifiedCount !== 1) {
            return res.status(500).send();
        }

        await db.collection("token").deleteOne({ emailToken: req.params.token });

        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

export default router;
