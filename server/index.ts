import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import { connectMongo } from "./db/connection";
import { register, login, refreshToken, logout } from "./routes/auth";
import { getUser, updateUser } from "./routes/users";
import { getDoctors, setAvailability, getSchedule } from "./routes/doctors";
import { createAppointment, listAppointments, updateAppointment, confirmAppointment } from "./routes/appointments";
import { suggest, rebalance } from "./routes/optimizer";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Connect DB if configured
  void connectMongo();

  // Health & demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/verify", verifyCode);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refreshToken);
  app.post("/api/auth/logout", logout);
  app.post("/api/auth/forgot", forgotPassword);
  app.post("/api/auth/reset", resetPassword);

  // Users
  app.get("/api/users/:id", getUser);
  app.patch("/api/users/:id", updateUser);

  // Doctors
  app.get("/api/doctors", getDoctors);
  app.get("/api/doctors/by-user/:userId", getByUser);
  app.get("/api/doctors/:id/schedule", getSchedule);
  app.post("/api/doctors/:id/availability", setAvailability);

  // Patients
  app.get("/api/patients/by-user/:userId", (req, res) => {
    // lazy load to avoid import cycles
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getByUser } = require("./routes/patients");
    return getByUser(req, res);
  });

  // Appointments
  app.post("/api/appointments", createAppointment);
  app.get("/api/appointments", listAppointments);
  app.patch("/api/appointments/:id", updateAppointment);
  app.post("/api/appointments/:id/confirm", confirmAppointment);

  // Optimizer
  app.post("/api/optimizer/suggest", suggest);
  app.post("/api/optimizer/rebalance", rebalance);

  // API Docs
  app.get("/api/docs", async (_req, res) => {
    try {
      const { readFile } = await import("fs/promises");
      const { resolve } = await import("path");
      const file = await readFile(resolve(process.cwd(), "docs/openapi.json"), "utf-8");
      res.type("application/json").send(file);
    } catch {
      res.status(404).json({ error: "OpenAPI spec not found" });
    }
  });

  return app;
}
