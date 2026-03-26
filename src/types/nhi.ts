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
