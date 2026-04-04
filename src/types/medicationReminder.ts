export interface MedicationReminder {
  id: number
  medicationDetailId?: number
  medicationName: string
  dosage?: string
  frequency?: string
  remindTimes: string[]    // parsed from JSON
  daysOfWeek: string[]     // parsed from comma-separated
  startDate?: string
  endDate?: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMedicationReminderRequest {
  medicationName: string
  dosage?: string
  frequency?: string
  remindTimes: string[]
  daysOfWeek: string[]
  startDate?: string
  endDate?: string
  isEnabled?: boolean
}

export interface UpdateMedicationReminderRequest {
  medicationName?: string
  dosage?: string
  frequency?: string
  remindTimes?: string[]
  daysOfWeek?: string[]
  startDate?: string
  endDate?: string
  isEnabled?: boolean
}

export interface MedicationLog {
  id: number
  reminderId?: number
  medicationName: string
  dosage?: string
  scheduledAt: string
  takenAt?: string
  status: 'pending' | 'taken' | 'late' | 'skipped' | 'missed'
  note?: string
  createdAt: string
}

export interface AdherenceResponse {
  overallRate: number
  takenCount: number
  lateCount: number
  skippedCount: number
  missedCount: number
  totalCount: number
  bestMedication?: string
  worstMedication?: string
  byMedication: MedicationAdherence[]
  dailyTrend: DailyAdherence[]
}

export interface MedicationAdherence {
  medicationName: string
  rate: number
  takenCount: number
  totalCount: number
}

export interface DailyAdherence {
  date: string
  rate: number
}
