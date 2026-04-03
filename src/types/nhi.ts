export interface NhiImportResult {
  logId: number
  importedAt: string
  dataDate?: string
  dateRangeStart?: string
  dateRangeEnd?: string
  recordCount: number
  visitCount: number
  medicationCount: number
  labCount: number
  skippedLabCount: number
  duplicateLabCount: number
  newItemCount: number
}

export interface NhiImportLog {
  id: number
  importedAt: string
  fileName?: string
  dataDate?: string
  dateRangeStart?: string
  dateRangeEnd?: string
  recordCount: number
  visitCount: number
  medicationCount: number
  labCount: number
  skippedLabCount: number
  duplicateLabCount: number
  newItemCount: number
}
