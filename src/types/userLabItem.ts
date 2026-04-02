export interface UserLabItem {
  id: number
  itemCode: string     // NHI 申報代碼，如 '09015C'
  itemName: string     // NHI 子項目名稱，如 'CRE(肌酸酐)'
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
  isPreset: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserLabItemRequest {
  itemCode: string
  itemName: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
}

// 後端 UpdateUserLabItemRequest 只允許更新這 4 個欄位
export interface UpdateUserLabItemRequest {
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
}
