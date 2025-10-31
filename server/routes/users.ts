import { RequestHandler } from "express";
import { User } from "../models";
import { dbReady } from "../db/connection";

export const getUser: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const u = await User.findById(req.params.id).select("-passwordHash");
  return res.json(u);
};

export const updateUser: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });
  const u = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
  return res.json(u);
};
