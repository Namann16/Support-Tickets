import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

describe("Validation Middleware", () => {
  let server;
  beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test-db";
    await mongoose.connect(MONGO_URI);
    server = app.listen(4001);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (server) server.close();
  });

  describe("User Registration Validation", () => {
    it("should fail if required fields are missing", async () => {
      const res = await request(app).post("/api/users/register").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
    it("should fail for invalid email format", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "notanemail",
        password: "password123",
        customerId: "TenantA"
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some(e => e.param === "email")).toBe(true);
    });
    it("should succeed for valid input", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        customerId: "TenantA"
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("User Login Validation", () => {
    it("should fail if email is missing", async () => {
      const res = await request(app).post("/api/users/login").send({ password: "password123" });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some(e => e.param === "email")).toBe(true);
    });
    it("should fail if password is missing", async () => {
      const res = await request(app).post("/api/users/login").send({ email: "test@example.com" });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some(e => e.param === "password")).toBe(true);
    });
  });

  describe("Ticket Creation Validation", () => {
    let token;
    beforeAll(async () => {
      // Register and login a user to get a token
      await request(app).post("/api/users/register").send({
        name: "Ticket User",
        email: "ticketuser@example.com",
        password: "password123",
        customerId: "TenantA"
      });
      const res = await request(app).post("/api/users/login").send({
        email: "ticketuser@example.com",
        password: "password123"
      });
      token = res.body.data.token;
    });
    it("should fail if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
    it("should fail for invalid priority", async () => {
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Ticket",
          description: "Test Desc",
          priority: "notvalid"
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some(e => e.param === "priority")).toBe(true);
    });
    it("should succeed for valid input", async () => {
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Valid Ticket",
          description: "Valid Desc",
          priority: "medium"
        });
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.success).toBe(true);
    });
  });
}); 