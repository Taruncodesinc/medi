/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse { message: string }

export type Role = "admin" | "doctor" | "patient";

export interface AuthUser { id: string; name: string; role: Role }
export interface AuthTokens { access: string; refresh: string; user: AuthUser }

export interface RegisterPayload { name: string; email: string; password: string; role?: Role; phone?: string }
export interface VerifyPayload { email: string; code: string }
export interface ForgotPayload { email: string }
export interface ResetPayload { email: string; code: string; newPassword: string }

export interface DoctorFilter { specialization?: string; location?: string }

export interface AppointmentPayload {
  patientId: string;
  doctorId?: string;
  durationMinutes: number;
  desiredStart?: string; // ISO
  urgency?: number; // 1-5
  reason?: string;
}
