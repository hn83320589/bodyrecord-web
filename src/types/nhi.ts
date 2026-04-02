export interface NhiImportResult {
  logId: number
  importedAt: string
  dataDate: string
  dateRangeStart: string
  dateRangeEnd: string
  healthRecordCount: number
  medicationCount: number
  labCount: number
  skippedLabs: number
  newItemCount: number  // 本次自動新增的新檢驗項目數
}

export interface NhiImportLog {
  id: number
  importedAt: string
  dataDate: string
  dateRangeStart: string
  dateRangeEnd: string
  healthRecordCount: number
  medicationCount: number
  labCount: number
  skippedLabs: number
}
