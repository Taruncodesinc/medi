import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models";
import { dbReady } from "../db/connection";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import nodemailer from "nodemailer";

// ================== Helpers ==================
async function getTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================== Register ==================
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["patient", "doctor"]).default("patient"),
  phone: z.string().optional(),
});

export const register: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { name, email, password, role, phone } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const code = makeCode();
  const expires = new Date(Date.now() + 1000 * 60 * 15);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    phone,
    verificationCode: code,
    verificationCodeExpires: expires,
    isVerified: false,
  });

  try {
    const transport = await getTransport();
    const info = await transport.sendMail({
      from: "no-reply@hospital-optimizer.local",
      to: email,
      subject: "Your verification code",
      html: `<p>Your verification code is <strong>${code}</strong></p>`,
    });
    console.log("Verification email:", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.error("Email error", e);
  }

  return res.json({ success: true, userId: user._id, message: "Verification code sent to email" });
};

// ================== Verify Code ==================
const verifySchema = z.object({ email: z.string().email(), code: z.string().length(6) });

export const verifyCode: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const parse = verifySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, code } = parse.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isVerified) return res.json({ success: true, message: "Already verified" });

  if (
    String(user.verificationCode) !== code ||
    !user.verificationCodeExpires ||
    user.verificationCodeExpires < new Date()
  ) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  user.isVerified = true;
  user.verificationCode = undefined as any;
  user.verificationCodeExpires = undefined as any;
  await user.save();

  const access = signAccessToken({ sub: String(user._id), role: user.role });
  const refresh = signRefreshToken({ sub: String(user._id), role: user.role });
  return res.json({ access, refresh, user: { id: user._id, name: user.name, role: user.role } });
};

// ================== Login ==================
const loginSchema = z.object({ email: z.string().email(), password: z.string() });

export const login: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  if (!user.isVerified) return res.status(403).json({ error: "Email not verified" });

  const access = signAccessToken({ sub: String(user._id), role: user.role });
  const refresh = signRefreshToken({ sub: String(user._id), role: user.role });
  return res.json({ access, refresh, user: { id: user._id, name: user.name, role: user.role } });
};

// ================== Refresh Token ==================
export const refreshToken: RequestHandler = async (req, res) => {
  const token = (req.body?.refresh as string) || "";
  try {
    const payload = verifyRefreshToken(token);
    const access = signAccessToken({ sub: payload.sub, role: payload.role });
    return res.json({ access });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

// ================== Logout ==================
export const logout: RequestHandler = async (_req, res) => {
  return res.json({ success: true });
};

// ================== Forgot Password ==================
const forgotSchema = z.object({ email: z.string().email() });

export const forgotPassword: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const parse = forgotSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email } = parse.data;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: true }); // don't reveal existence

  const code = makeCode();
  user.resetCode = code;
  user.resetCodeExpires = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  try {
    const transport = await getTransport();
    const info = await transport.sendMail({
      from: "no-reply@hospital-optimizer.local",
      to: email,
      subject: "Password reset code",
      html: `<p>Your password reset code is <strong>${code}</strong></p>`,
    });
    console.log("Reset email:", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.error("Email error", e);
  }

  return res.json({ success: true });
};

// ================== Reset Password ==================
const resetSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});

export const resetPassword: RequestHandler = async (req, res) => {
  if (!dbReady()) return res.status(503).json({ error: "Database not connected" });

  const parse = resetSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, code, newPassword } = parse.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (
    String(user.resetCode) !== code ||
    !user.resetCodeExpires ||
    user.resetCodeExpires < new Date()
  ) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined as any;
  user.resetCodeExpires = undefined as any;
  await user.save();

  return res.json({ success: true });
};
