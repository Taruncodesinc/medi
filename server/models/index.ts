import mongoose, { Schema, Types } from "mongoose";

export type UserRole = "admin" | "doctor" | "patient";

export interface IUser {
  _id: Types.ObjectId;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  profile?: Record<string, any>;
  preferences?: { theme?: "light" | "dark"; notifications?: boolean };
}

const UserSchema = new Schema<IUser>(
  {
    role: { type: String, enum: ["admin", "doctor", "patient"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    passwordHash: { type: String, required: true },
    profile: Schema.Types.Mixed,
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: { type: Boolean, default: true },
    },
    // Email verification and password reset
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpires: Date,
    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true },
);

export interface IDoctor {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specialization: string;
  clinic: string;
  experienceYears?: number;
  ratings?: number;
  availability: Array<{ dayOfWeek: number; start: string; end: string }>;
  settings?: { autoAccept?: boolean; dailyLimit?: number };
  location?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    clinic: { type: String, required: true },
    experienceYears: Number,
    ratings: Number,
    availability: [
      {
        dayOfWeek: Number,
        start: String,
        end: String,
      },
    ],
    settings: {
      autoAccept: { type: Boolean, default: true },
      dailyLimit: { type: Number, default: 24 },
    },
    location: String,
  },
  { timestamps: true },
);

export interface IPatient {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  medicalHistory?: string[];
  preferredDoctors?: Types.ObjectId[];
  location?: string;
  urgencyLevel?: number;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicalHistory: [String],
    preferredDoctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    location: String,
    urgencyLevel: Number,
  },
  { timestamps: true },
);

export interface IAppointment {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  start: Date;
  end: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reason?: string;
  priorityScore?: number;
  source?: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    reason: String,
    priorityScore: Number,
    source: String,
  },
  { timestamps: true },
);

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
