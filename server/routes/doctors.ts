import { RequestHandler } from "express";
import { Doctor, Appointment } from "../models";
import { dbReady } from "../db/connection";
import { z } from "zod";
import mongoose from "mongoose";

// ================== Get Doctors ==================
export const getDoctors: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const { specialization, location } = req.query as Record<string, string>;
  const q: Record<string, any> = {};
  if (specialization) q.specialization = specialization;
  if (location) q.location = location;

  // ✅ `Doctor` is now properly typed as Model<IDoctor>, so no union error
  const doctors = await Doctor.find(q).limit(50);
  return res.json(doctors);
};

// ================== Set Availability ==================
const availabilitySchema = z.object({
  availability: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      start: z.string(),
      end: z.string(),
    }),
  ),
});

export const setAvailability: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const doctorId = req.params.id;
  const parse = availabilitySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  // ✅ Proper typing avoids "expression not callable" error
  await Doctor.findByIdAndUpdate(
    new mongoose.Types.ObjectId(doctorId),
    { availability: parse.data.availability },
    { new: true }
  );

  return res.json({ success: true });
};

// ================== Get Schedule ==================
export const getSchedule: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const doctorId = req.params.id;
  const date = new Date(String(req.query.date));
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctorId: new mongoose.Types.ObjectId(doctorId),
    start: { $gte: start, $lte: end },
  });

  return res.json(appointments);
};

// ================== Get Doctor By User ==================
export const getByUser: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const userId = req.params.userId;
  const doctor = await Doctor.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  return res.json(doctor);
};
