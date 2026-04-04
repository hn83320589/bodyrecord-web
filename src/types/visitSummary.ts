// ── GET /visits/{id}/summary-json ──

export interface VisitSummaryJson {
  visit: VisitSummaryVisit
  bloodPressure: VisitSummaryBp
  labResults: VisitSummaryLab
  labTrends: VisitSummaryLabTrend[]
  medications: VisitSummaryMed
  symptoms: VisitSummarySymptoms
  generatedAt: string
}

export interface VisitSummaryVisit {
  date: string
  institution?: string
  department?: string
  diagnoses: { code: string; name: string }[]
}

export interface VisitSummaryBp {
  recentAvg: { systolic: number; diastolic: number }
  recentMax: { systolic: number; diastolic: number }
  recentMin: { systolic: number; diastolic: number }
  trend: { weekStart: string; avgSystolic: number; avgDiastolic: number }[]
  totalMeasurements: number
  periodMonths: number
}

export interface VisitSummaryLabItem {
  displayName?: string
  value?: number
  valueText?: string
  unit?: string
  status: string
}

export interface VisitSummaryLabCategory {
  category: string
  items: VisitSummaryLabItem[]
}

export interface VisitSummaryLab {
  abnormalCount: number
  totalCount: number
  byCategory: VisitSummaryLabCategory[]
}

export interface VisitSummaryLabTrendPoint {
  date: string
  value: number
}

export interface VisitSummaryLabTrend {
  displayName?: string
  unit?: string
  points: VisitSummaryLabTrendPoint[]
  trendDirection: string
}

export interface VisitSummaryMedItem {
  name: string
  frequency?: string
  adherenceRate: number
}

export interface VisitSummaryMed {
  current: VisitSummaryMedItem[]
  overallAdherenceRate: number
  adherencePeriodDays: number
}

export interface VisitSummarySymptomType {
  type: string
  count: number
  avgSeverity: number
}

export interface VisitSummarySymptoms {
  periodDays: number
  totalCount: number
  byType: VisitSummarySymptomType[]
}
