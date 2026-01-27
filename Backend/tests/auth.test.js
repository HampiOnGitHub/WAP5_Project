import request from "supertest";
import app from "../app.js";
import { describe, test, expect, beforeAll } from "@jest/globals";
import setupTestUser from "./setupTestUser.js";

let db;

beforeAll(async () => {
    db = app.get("db");
    await setupTestUser(db);
});

describe("OAuth Token Endpoint", () => {
    test("should return access token with valid credentials", async () => {
        const response = await request(app)
            .post("/api/token")
            .type("form")
            .send({
                grant_type: "password",
                client_id: "client",
                username: "testuser@example.com",
                password: "test12345",
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("access_token");
        expect(response.body).toHaveProperty("refresh_token");
    });
});
