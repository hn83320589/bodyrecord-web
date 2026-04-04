# Phase 2 Feature 2 — 症狀日誌（Web 前端）

請閱讀 CLAUDE.md 後，實作症狀日誌功能。

## 新增頁面

### 1. /symptoms — 症狀日誌主頁

三個區塊：

**頂部統計卡片（2~3 欄）**
- 本月紀錄數
- 最常見症狀 + 平均嚴重度
- 最常見觸發因子

API：`GET /symptoms/summary?months=3`

**日曆熱力圖**
- 月曆格狀視圖，每格依 maxSeverity 填色：
  - 0 次：透明
  - severity 1-3：`var(--status-success)` 淡色
  - severity 4-6：`var(--status-warning)` 淡色
  - severity 7-10：`var(--status-danger)` 淡色
- 點擊日期 → 展開該日的症狀列表
- 資料來源：summary response 的 `calendar` 欄位

**症狀列表（時間軸模式）**
- 複用 TimelineView 元件風格
- 每張卡片：日期 + 症狀類型 badge + severity 條（1-10 橫條）+ 說明
- DateRangePicker（預設 3 個月）
- 類型篩選（從 GET /symptoms/types 取得選項）

API：`GET /symptoms?startDate=...&endDate=...&type=...`

### 2. 快速記錄表單（SymptomQuickForm）

設計為 modal 或側邊抽屜，目標 3 秒完成一筆記錄：

**步驟 1：選症狀類型**
- 顯示常用類型 pill 按鈕（從 GET /symptoms/types）
- 最後一個 pill 為「其他」→ 展開自訂輸入框

**步驟 2：嚴重度滑桿**
- range slider 1-10
- 滑桿顏色隨數值變化：1-3 綠 → 4-6 橙 → 7-10 紅
- 數字即時顯示

**步驟 3（可選展開）：詳細資訊**
- 身體部位（文字輸入）
- 持續時間（分鐘，數字輸入）
- 觸發因子（常用選項 pills + 自訂輸入）：睡眠不足、天氣變化、壓力大、經期前、飲食、運動
- 備註

**送出按鈕**

API：`POST /symptoms`

### 3. /symptoms/trends — 趨勢分析頁

**每週平均嚴重度折線圖**
- Chart.js line chart
- X 軸：週次
- Y 軸：平均嚴重度 (1-10)
- 資料：summary response 的 `severityTrend`

**類型分佈圓環圖**
- Chart.js doughnut
- 各類型的 count 比例
- 顏色：每種症狀固定色（關節痛=藍、疲倦=橙、水腫=綠...）

**觸發因子排行**
- 水平柱狀圖或簡單列表
- 資料：`topTriggers`

### 4. 元件清單

| 元件 | 說明 |
|------|------|
| SymptomPage | 主頁佈局（統計 + 熱力圖 + 列表） |
| SymptomQuickForm | 快速記錄 modal |
| SymptomCalendarHeatmap | 日曆熱力圖 |
| SymptomTimelineList | 時間軸列表（複用 TimelineView 風格） |
| SymptomTrendsPage | 趨勢分析頁 |
| SeverityBar | 嚴重度橫條（1-10，顏色漸變） |
| SeveritySlider | 嚴重度滑桿（表單用） |
| TriggerPills | 觸發因子選擇 pills |

### 5. API Client 新增

```typescript
// src/api/symptom.ts
export const getSymptoms = (params: { startDate?: string; endDate?: string; type?: string }) =>
  api.get('/symptoms', { params })

export const createSymptom = (data: CreateSymptomRequest) =>
  api.post('/symptoms', data)

export const updateSymptom = (id: number, data: UpdateSymptomRequest) =>
  api.put(`/symptoms/${id}`, data)

export const deleteSymptom = (id: number) =>
  api.delete(`/symptoms/${id}`)

export const getSymptomSummary = (months: number = 3) =>
  api.get('/symptoms/summary', { params: { months } })

export const getSymptomTypes = () =>
  api.get('/symptoms/types')
```

### 6. 路由新增

```typescript
{ path: '/symptoms', component: SymptomPage },
{ path: '/symptoms/trends', component: SymptomTrendsPage },
```

### 7. Dashboard 整合

- Dashboard 時間軸中加入症狀紀錄卡片（cat = '症狀'）
- 新增類別色：症狀 = `#EC4899` (pink) / Dark: `#F472B6` / bg: `#FDF2F8` / Dark bg: `#500724`
- CategoryPills 新增「症狀」選項

### 8. 回診詳情擴充

在 VisitRelatedView 中新增 **RelatedSymptomSection**：
- 顯示回診前後 ±7 天的症狀日誌
- 列表：日期 + 類型 + severity bar + daysFromVisit

### 9. 設計注意

- SeverityBar 顏色漸變：1-3 success → 4-6 warning → 7-10 danger
- 熱力圖格子用 `border-radius: 2px`，gap: 2px
- 快速記錄表單動線要流暢，減少不必要的欄位
- Light/Dark 雙主題都要驗證

完成後確認 Light/Dark 模式顯示正確。
