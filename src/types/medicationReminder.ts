// ── Reminder ────────────────────────────────

export interface MedicationReminder {
  id: number
  medicationDetailId?: number
  medicationName: string
  dosage?: string
  frequency?: string
  remindTimes: string[]      // 後端回傳 List<string>
  daysOfWeek: string         // 後端回傳 comma-separated string "MON,TUE,..."
  startDate?: string
  endDate?: string
  isEnabled: boolean
  createdAt: string
}

export interface CreateMedicationReminderRequest {
  medicationName: string
  dosage?: string
  frequency?: string
  remindTimes?: string[]
  daysOfWeek?: string        // comma-separated
  startDate?: string
  endDate?: string
}

export interface UpdateMedicationReminderRequest {
  medicationName?: string
  dosage?: string
  remindTimes?: string[]
  daysOfWeek?: string        // comma-separated
  startDate?: string
  endDate?: string
  isEnabled?: boolean
}

// ── Medication Log ──────────────────────────

export interface MedicationLog {
  id: number
  reminderId?: number
  medicationName: string
  dosage?: string
  scheduledAt: string
  takenAt?: string
  status: 'pending' | 'taken' | 'late' | 'skipped' | 'missed'
  note?: string
}

// ── Adherence ───────────────────────────────

export interface AdherenceResponse {
  period: { start: string; end: string }
  overall: AdherenceOverall
  byMedication: AdherenceByMed[]
  dailyTrend: AdherenceDaily[]
}

export interface AdherenceOverall {
  totalScheduled: number
  taken: number
  late: number
  skipped: number
  missed: number
  adherenceRate: number      // 0-1
}

export interface AdherenceByMed {
  medicationName: string
  totalScheduled: number
  taken: number
  adherenceRate: number      // 0-1
}

export interface AdherenceDaily {
  date: string
  scheduled: number
  taken: number
  rate: number               // 0-1
}
