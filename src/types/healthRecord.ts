import type { LabResultDetail } from './lab'
import type { MedicationRecord } from './medication'

export interface HealthRecord {
  id: number
  clinicDate: string
  hospital?: string
  hospitalCode?: string
  primaryIcdCode?: string
  primaryDiagnosis?: string
  secondaryDiagnoses?: string | null
  copay?: number
  totalPoints?: number
  source: 'manual' | 'nhi_import'
  note?: string
  createdAt: string
}

export interface HealthRecordDetail extends HealthRecord {
  medications: MedicationRecord[]
  labResults: LabResultDetail[]
}
