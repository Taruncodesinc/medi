import { Appointment, Doctor, Patient } from "../../models";

export interface SlotRequest {
  desiredStart?: Date;
  durationMinutes: number;
  patientId: string;
  preferredDoctorId?: string;
  urgency?: number; // 1-5
}

export interface SlotSuggestion {
  doctorId: string;
  start: Date;
  end: Date;
  priorityScore: number;
}

function score({ urgency = 3, specializationMatch = 1, proximity = 1, waitPenalty = 0 }): number {
  // Weighted scoring; higher is better
  return urgency * 0.5 + specializationMatch * 0.25 + proximity * 0.15 + waitPenalty * 0.1;
}

export async function suggestSlots(req: SlotRequest): Promise<SlotSuggestion[]> {
  // In a real system, consider calendars, buffers, and working hours.
  const patient = await Patient.findById(req.patientId).lean();
  const preferredDoctor = req.preferredDoctorId ? await Doctor.findById(req.preferredDoctorId).lean() : null;
  const doctors = preferredDoctor ? [preferredDoctor] : await Doctor.find({}).lean();

  const durationMs = req.durationMinutes * 60 * 1000;
  const now = req.desiredStart ?? new Date();
  const startWindow = new Date(now);
  const endWindow = new Date(now);
  endWindow.setDate(endWindow.getDate() + 14); // search next 2 weeks

  const results: SlotSuggestion[] = [];

  for (const doc of doctors) {
    // naive: propose next available half-hour within working hours (9-17)
    const cursor = new Date(startWindow);
    while (cursor < endWindow && results.length < 20) {
      const start = new Date(cursor);
      const end = new Date(cursor.getTime() + durationMs);
      // Check collisions
      const overlap = await Appointment.findOne({ doctorId: doc._id, start: { $lt: end }, end: { $gt: start } }).lean();
      if (!overlap) {
        const specializationMatch = req.preferredDoctorId ? 1 : 0.8;
        const proximity = patient?.location && doc.location ? 0.8 : 0.6;
        const priorityScore = score({ urgency: req.urgency, specializationMatch, proximity, waitPenalty: 0.0 });
        results.push({ doctorId: String(doc._id), start, end, priorityScore });
      }
      cursor.setMinutes(cursor.getMinutes() + 30);
    }
  }

  // Sort by score then earliest
  return results.sort((a, b) => b.priorityScore - a.priorityScore || a.start.getTime() - b.start.getTime());
}

// ML/LLM integration point: swap this with a smarter model or call out to an external service.
export async function mlSuggestSlots(input: SlotRequest): Promise<SlotSuggestion[]> {
  // Return rule-based for now; implement external call or plugin when configured.
  return suggestSlots(input);
}
