import { RequestHandler } from "express";
import { Doctor, Appointment } from "../models";
import { dbReady } from "../db/connection";
import { z } from "zod";

export const getDoctors: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const { specialization, location } = req.query as Record<string, string>;
  const q: any = {};
  if (specialization) q.specialization = specialization;
  if (location) q.location = location;
  const doctors = await Doctor.find(q).limit(50);
  return res.json(doctors);
};

const availabilitySchema = z.object({
  availability: z.array(
    z.object({ dayOfWeek: z.number().min(0).max(6), start: z.string(), end: z.string() }),
  ),
});
export const setAvailability: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const doctorId = req.params.id;
  const parse = availabilitySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  await Doctor.findByIdAndUpdate(doctorId, { availability: parse.data.availability });
  return res.json({ success: true });
};

export const getSchedule: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const doctorId = req.params.id;
  const date = new Date(String(req.query.date));
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const appointments = await Appointment.find({ doctorId, start: { $gte: start, $lte: end } });
  return res.json(appointments);
};

export const getByUser: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const userId = req.params.userId;
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  return res.json(doctor);
};
