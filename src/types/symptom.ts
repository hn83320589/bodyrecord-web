export interface SymptomLog {
  id: number
  loggedAt: string
  symptomType: string
  severity: number        // 1-10
  bodyLocation?: string
  durationMinutes?: number
  triggers?: string       // comma-separated from backend
  note?: string
  createdAt: string
}

export interface CreateSymptomRequest {
  loggedAt: string
  symptomType: string
  severity: number
  bodyLocation?: string
  durationMinutes?: number
  triggers?: string
  note?: string
}

export interface UpdateSymptomRequest {
  loggedAt?: string
  symptomType?: string
  severity?: number
  bodyLocation?: string
  durationMinutes?: number
  triggers?: string
  note?: string
}

export interface SymptomSummary {
  totalCount: number
  mostCommonType?: string
  avgSeverity?: number
  mostCommonTrigger?: string
  calendar: CalendarDay[]
  severityTrend: SeverityTrendPoint[]
  topTriggers: TriggerCount[]
  typeDistribution: TypeCount[]
}

export interface CalendarDay {
  date: string
  count: number
  maxSeverity: number
}

export interface SeverityTrendPoint {
  week: string
  avgSeverity: number
}

export interface TriggerCount {
  trigger: string
  count: number
}

export interface TypeCount {
  type: string
  count: number
}
