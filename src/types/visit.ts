// ── GET /visits/timeline ──

export interface VisitTimelineItem {
  visitId: number
  recordedAt: string
  institution?: string
  primaryDiagnosis?: string
  medicationCount: number
  labCount: number
  labAbnormalCount: number
  bpOnDay?: BloodPressureSimple
  keyLabs: KeyLab[]
}

export interface BloodPressureSimple {
  systolic: number
  diastolic: number
  pulse?: number
}

export interface KeyLab {
  displayName?: string
  value?: number
  unit?: string
  status: 'normal' | 'high' | 'low' | 'unknown'
}

// ── GET /visits/{id}/related ──

export interface VisitRelatedResponse {
  visit: VisitInfo
  medications: VisitMedication[]
  labResults: LabResultWithStatus[]
  bloodPressures: BloodPressureWithDate[]
  summary: VisitSummary
}

export interface VisitInfo {
  id: number
  recordedAt: string
  institution?: string
  institutionCode?: string
  visitTypeCode?: string
  diagnoses: Diagnosis[]
  copaymentCode?: string
  medicalCost?: number
  source: string
}

export interface Diagnosis {
  code: string
  name: string
}

export interface VisitMedication {
  id: number
  medicationName: string
  genericName?: string
  nhiDrugCode?: string
  quantity?: number
  copayment?: number
  dosage?: string
  frequency?: string
  durationDays?: number
}

export interface LabResultWithStatus {
  id: number
  itemCode: string
  itemName: string
  displayName?: string
  category?: string
  value?: number
  valueText?: string
  isNumeric: boolean
  unit?: string
  referenceRange?: string
  normalMin?: number
  normalMax?: number
  status: 'normal' | 'high' | 'low' | 'unknown'
}

export interface BloodPressureWithDate {
  id: number
  recordedAt: string
  systolic: number
  diastolic: number
  pulse?: number
  daysFromVisit: number
}

export interface VisitSummary {
  labCount: number
  labAbnormalCount: number
  medicationCount: number
  bpCount: number
  bpAvgSystolic?: number
  bpAvgDiastolic?: number
}
