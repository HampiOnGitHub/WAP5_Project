import bcrypt from "bcrypt";

export default async function setupTestUser(db) {
    const existing = await db.collection("user_auth").findOne({
        username: "testuser@example.com",
    });

    if (!existing) {
        const passwordHash = await bcrypt.hash("test12345", 10);

        const authInsert = await db.collection("user_auth").insertOne({
            username: "testuser@example.com",
            password: passwordHash,
            createdAt: new Date(),
        });

        await db.collection("user").insertOne({
            _id: authInsert.insertedId,
            first_name: "Test",
            last_name: "User",
            permissions: { write: true },
        });
    }
}
