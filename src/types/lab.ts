// 後端 CreateLabResultItem（每筆帶自己的 recordedAt）
export interface CreateLabResultItem {
  recordedAt: string
  itemName: string
  itemCode: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
  isAbnormal: boolean
  note?: string
  healthRecordId?: number | null
}

export interface CreateLabResultsRequest {
  items: CreateLabResultItem[]
}

export interface LabResultDetail {
  id: number
  healthRecordId: number | null
  recordedAt: string
  itemName: string
  itemCode: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
  isAbnormal: boolean
  nhiCode?: string
  source: 'manual' | 'nhi_import'
  note?: string
  createdAt: string
}

// 後端 LabResultsByDateGroup（date: DateOnly, items: LabResultResponse[]）
export interface LabResultGroup {
  date: string
  items: LabResultDetail[]
}

// 後端趨勢點（只有 recordedAt + value）
export interface LabTrendRawPoint {
  recordedAt: string
  value: number
}

// Chart component 使用的完整趨勢資料（含 preset 資訊）
export interface LabTrendResponse {
  itemCode: string
  itemName: string
  unit: string
  normalMin?: number
  normalMax?: number
  points: LabTrendPoint[]
}

export interface LabTrendPoint {
  recordedAt: string
  value: number
  isAbnormal: boolean
}
