import { RequestHandler } from "express";
import { dbReady } from "../db/connection";
import { Appointment } from "../models";
import { z } from "zod";
import { suggestSlots } from "../services/optimizer/ruleBased";

const createSchema = z.object({
  patientId: z.string(),
  doctorId: z.string().optional(),
  durationMinutes: z.number().min(5).default(30),
  desiredStart: z.string().datetime().optional(),
  urgency: z.number().min(1).max(5).optional(),
  reason: z.string().optional(),
});

export const createAppointment: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { patientId, doctorId, durationMinutes, desiredStart, urgency, reason } = parse.data;
  const suggestions = await suggestSlots({
    patientId,
    preferredDoctorId: doctorId,
    durationMinutes,
    desiredStart: desiredStart ? new Date(desiredStart) : undefined,
    urgency,
  });
  if (!suggestions.length) return res.status(409).json({ error: "No slots available" });
  const best = suggestions[0];
  const created = await Appointment.create({
    patientId,
    doctorId: best.doctorId,
    start: best.start,
    end: best.end,
    reason,
    status: "pending",
    priorityScore: best.priorityScore,
    source: "optimizer",
  });
  return res.json(created);
};

export const listAppointments: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const { role, status } = req.query as Record<string, string>;
  const q: any = {};
  if (status) q.status = status;
  if (role === "doctor" && req.query.doctorId) q.doctorId = req.query.doctorId;
  if (role === "patient" && req.query.patientId) q.patientId = req.query.patientId;
  const items = await Appointment.find(q).limit(100);
  return res.json(items);
};

export const updateAppointment: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const id = req.params.id;
  const updated = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
  return res.json(updated);
};

export const confirmAppointment: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const id = req.params.id;
  const updated = await Appointment.findByIdAndUpdate(id, { status: "confirmed" }, { new: true });
  return res.json(updated);
};
