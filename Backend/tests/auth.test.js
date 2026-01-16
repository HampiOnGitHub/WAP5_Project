import request from "supertest";
import app from "../app.js";
import { describe, test, expect } from "@jest/globals";

describe("OAuth Token Endpoint", () => {

    test("should return access token with valid credentials", async () => {
        const response = await request(app)
            .post("/api/token")
            .type("form")
            .send({
                grant_type: "password",
                client_id: "client",
                username: "oauthuser1@example.com",
                password: "test12345",
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("access_token");
        expect(response.body).toHaveProperty("refresh_token");
    });

});
