import { RequestHandler } from "express";
import { dbReady } from "../db/connection";
import { z } from "zod";
import { mlSuggestSlots, suggestSlots } from "../services/optimizer/ruleBased";
import { SlotRequest } from "../services/optimizer/ruleBased"; // ✅ import type

const suggestSchema = z.object({
  desiredStart: z.string().datetime().optional(),
  durationMinutes: z.number().min(5),
  patientId: z.string(),
  preferredDoctorId: z.string().optional(),
  urgency: z.number().min(1).max(5).optional(),
});

export const suggest: RequestHandler = async (req, res) => {
  if (!dbReady())
    return res.status(503).json({ error: "Database not connected" });

  const parse = suggestSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });

  // ✅ Build SlotRequest explicitly
  const payload: SlotRequest = {
    desiredStart: parse.data.desiredStart
      ? new Date(parse.data.desiredStart)
      : undefined,
    durationMinutes: parse.data.durationMinutes,
    patientId: parse.data.patientId,
    preferredDoctorId: parse.data.preferredDoctorId,
    urgency: parse.data.urgency,
  };

  // ✅ Correct type
  const slots = await suggestSlots(payload);

  return res.json(slots);
};

export const rebalance: RequestHandler = async (_req, res) => {
  if (!dbReady())
    return res.status(503).json({ error: "Database not connected" });

  // Integration point: run system-wide reallocation; for MVP, respond OK
  return res.json({ status: "ok" });
};
