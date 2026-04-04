# Phase 2 Feature 1 — 回診關聯查詢（Web 前端）

請閱讀 CLAUDE.md 後，實作回診關聯查詢前端。

## 新增頁面

### 1. /visits/timeline — 回診時間軸

使用既有的 TimelineView 元件風格，但內容改為回診摘要卡片：

- 頂部：DateRangePicker（預設 3 個月）
- 每張 VisitSummaryCard 顯示：
  - 日期 + 機構名稱
  - 主診斷（第一個非空診斷）
  - 指標預覽 keyLabs（最多 3 個，異常值用 status-danger 色，正常用 status-success 色）
  - 右下角小字：「檢驗 18 項 · 用藥 5 種」
- 點擊卡片 → 路由到 /visits/{id}

API：`GET /visits/timeline?startDate=...&endDate=...`

### 2. /visits/:id — 回診詳情（VisitRelatedView）

四個區塊垂直排列：

**回診資訊**
- 機構 + 日期
- 所有診斷（最多 5 組 ICD + 名稱，空值不顯示）
- 費用點數

**檢驗結果（RelatedLabSection）**
- 依 category 分組（腎功能、免疫、血液...）
- 每組一個 section，可收合
- 每項顯示：displayName、value（Dark Mode 用 font-mono）、unit、status 圓點
- 異常值：整行用 status-danger-bg 淡底色
- 標題顯示「18 項，2 項異常」

**用藥（RelatedMedSection）**
- 列表：藥品名稱 + 數量 + 自付額
- 簡潔行列，不需卡片

**血壓趨勢（RelatedBpSection）**
- Chart.js line chart，X 軸為日期（±3 天），Y 軸為血壓值
- 收縮壓 + 舒張壓雙線
- 回診當天用垂直虛線標記
- 下方文字：「平均 130/83 mmHg · 5 筆」
- 圖表顏色遵循 Design Tokens（accent 線 + border 軸線）

API：`GET /visits/{id}/related`

### 3. API Client 新增

```typescript
// src/api/visit.ts
export const getVisitTimeline = (startDate: string, endDate: string) =>
  api.get('/visits/timeline', { params: { startDate, endDate } })

export const getVisitRelated = (id: number) =>
  api.get(`/visits/${id}/related`)
```

### 4. 路由新增

```typescript
{ path: '/visits/timeline', component: VisitTimelinePage },
{ path: '/visits/:id', component: VisitRelatedView },
```

### 5. Dashboard 整合

在 Dashboard 時間軸中，回診類型的 TimelineCard 加上 keyLabs 預覽（如果有的話）。

### 6. 設計注意

- 遵循 Clinical Precision（Light）/ Slate Dashboard（Dark）雙主題
- 異常值用 `var(--status-danger)` / `var(--status-danger-bg)`
- 正常值用 `var(--status-success)`
- 數值在 Dark Mode 使用 `font-mono`
- 卡片圓角 `var(--radius-card)`

完成後確認 Light/Dark 兩個主題顯示正確。
