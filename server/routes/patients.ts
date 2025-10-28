import { RequestHandler } from "express";
import { Patient } from "../models";
import { dbReady } from "../db/connection";

export const getByUser: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const userId = req.params.userId;
  const patient = await Patient.findOne({ userId });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  return res.json(patient);
};
