# CHANGE-001：檢驗項目改為動態維護（對應後端 CHANGE-001）

## 背景

對應後端 CHANGE-001，`LabItemPresets` 常數改為資料庫維護。
前端需要從 API 取得項目清單，並新增管理頁面。

---

## 變更內容

### 1. 新增型別 types/userLabItem.ts

```typescript
export interface UserLabItem {
  id: number
  itemCode: string       // '09015C'（即 NHI 申報代碼）
  itemName: string       // 'CRE(肌酸酐)'
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
  isPreset: boolean
}

export interface CreateUserLabItemRequest {
  itemCode: string
  itemName: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
}

export interface UpdateUserLabItemRequest {
  itemName?: string
  unit?: string
  category?: string
  normalMin?: number
  normalMax?: number
}
```

### 2. 新增 api/userLabItem.ts

```typescript
import client from './client'
import type { UserLabItem, CreateUserLabItemRequest, UpdateUserLabItemRequest } from '@/types/userLabItem'

export const userLabItemApi = {
  getAll: (): Promise<UserLabItem[]> =>
    client.get('/user-lab-items'),

  create: (data: CreateUserLabItemRequest): Promise<UserLabItem> =>
    client.post('/user-lab-items', data),

  update: (id: number, data: UpdateUserLabItemRequest): Promise<UserLabItem> =>
    client.put(`/user-lab-items/${id}`, data),

  delete: (id: number): Promise<void> =>
    client.delete(`/user-lab-items/${id}`),
}
```

### 3. 修改 LabFormView

原本從 `labPresets.ts` 常數讀取選單，改為：

```typescript
// 改為從 API 取得
const userLabItems = ref<UserLabItem[]>([])
onMounted(async () => {
  userLabItems.value = await userLabItemApi.getAll()
})
```

選擇項目後帶入 `itemCode`（'09015C'）和 `itemName`（'CRE(肌酸酐)'）送出。

### 4. 修改 LabTrendView 查詢參數

```typescript
// 原本
GET /lab-results/trend?itemCode=Cr

// 改為
GET /lab-results/trend?itemCode=09015C&itemName=CRE(肌酸酐)
```

趨勢圖的項目選單同樣改從 `GET /user-lab-items` 取得。

### 5. 新增 UserLabItemView（/lab/items）

功能：
- 列表顯示所有檢驗項目（`is_preset` 的顯示 🔒 icon，不可刪除）
- 可編輯 unit、normalMin、normalMax、category
- 可新增自訂項目
- 可刪除非預設項目（`is_preset=false`）

路由加入：
```
/lab/items    → UserLabItemView
```

### 6. 修改 NhiImportView 結果顯示

```typescript
// NhiImportResult 新增欄位
newItemCount: number   // 本次自動新增的新項目數

// 顯示：
// 看診 N 筆 / 用藥 M 項 / 檢驗 K 筆 / 新增項目 X 個 / 跳過 0 項
```

### 7. 可移除的舊代碼

- `src/constants/labPresets.ts`（不再需要，從 API 取得）

---

## 開發 Prompt

```
請依照 CHANGES/CHANGE-001.md 進行以下變更（對應後端 CHANGE-001）：

1. 新增 types/userLabItem.ts
2. 新增 api/userLabItem.ts（CRUD）
3. 修改 LabFormView：項目選單從 GET /user-lab-items 取得，
   送出時帶 itemCode（NHI申報代碼）+ itemName（NHI子項目名稱）
4. 修改 LabTrendView：查詢參數改為 itemCode + itemName，
   選單同樣從 GET /user-lab-items 取得
5. 新增 UserLabItemView（/lab/items）：
   - 列表 + 編輯 unit/normalMin/normalMax/category
   - 新增自訂項目
   - 刪除（is_preset=true 不顯示刪除按鈕）
6. 修改 NhiImportView：結果顯示新增「新增項目 X 個」
7. 移除 src/constants/labPresets.ts

注意：
- itemCode 現在存的是 NHI 申報代碼（如 '09015C'），不是舊的 'Cr'
- 趨勢圖需要 itemCode + itemName 兩個參數才能唯一識別
```
