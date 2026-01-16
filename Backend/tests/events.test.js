import request from "supertest";
import app from "../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";

let accessToken;

beforeAll(async () => {
    const res = await request(app)
        .post("/api/token")
        .type("form")
        .send({
            grant_type: "password",
            client_id: "client",
            username: "oauthuser1@example.com",
            password: "test12345",
        });

    accessToken = res.body.access_token;
});

describe("Events API (protected)", () => {

    test("should deny access without token", async () => {
        const res = await request(app).get("/api/events");
        expect(res.statusCode).toBe(401);
    });

    test("should allow access with valid token", async () => {
        const res = await request(app)
            .get("/api/events")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

});
