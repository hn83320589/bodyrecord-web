export interface MedicationRecord {
  id: number
  healthRecordId?: number | null
  recordedAt: string
  drugName: string
  nhiDrugCode?: string
  quantity?: number
  days?: number
  drugType: string
  source: 'manual' | 'nhi_import'
  note?: string
  createdAt: string
}
