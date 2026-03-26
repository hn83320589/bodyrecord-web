export interface BloodPressureRecord {
  id: number
  healthRecordId?: number | null
  recordedAt: string
  systolic: number
  diastolic: number
  pulse: number
  measurementPosition?: string
  source: 'manual' | 'healthkit'
  note?: string
  createdAt: string
}

export interface CreateBloodPressureRequest {
  recordedAt: string
  systolic: number
  diastolic: number
  pulse: number
  measurementPosition?: string
  note?: string
  healthRecordId?: number | null
}

export interface BloodPressureChartPoint {
  recordedAt: string
  systolic: number
  diastolic: number
  pulse: number
}
