import type { LabResultDetail } from './lab'
import type { MedicationRecord } from './medication'

// 對應後端 HealthRecordResponse
export interface HealthRecord {
  id: number
  recordType: string             // "medication" | "visit" | "lab_result" | ...
  recordedAt: string
  note?: string
  source: 'manual' | 'nhi_import'
  nhiInstitution?: string
  nhiInstitutionCode?: string
  createdAt: string
}

export interface HealthRecordDetail extends HealthRecord {
  medications: MedicationRecord[]
  labResults: LabResultDetail[]
}
