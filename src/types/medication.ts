// 對應後端 MedicationResponse
export interface MedicationRecord {
  id: number
  healthRecordId: number
  recordedAt: string
  medicationName: string
  genericName?: string
  nhiDrugCode?: string
  quantity?: number
  copayment?: number
  dosage?: string
  frequency?: string
  route?: string
  durationDays?: number
  isActive: boolean
  startDate?: string
  endDate?: string
  source: 'manual' | 'nhi_import'
  note?: string
  createdAt: string
}
