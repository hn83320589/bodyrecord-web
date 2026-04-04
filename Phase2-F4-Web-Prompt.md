# Phase 2 Feature 4 — 回診前彙整 PDF 匯出（Web 前端）

請閱讀 CLAUDE.md 後，實作回診摘要預覽與 PDF 下載功能。

## 功能說明

在回診詳情頁（VisitRelatedView）新增「匯出摘要」功能，
使用者可預覽摘要內容後下載 PDF。

## 修改頁面

### 1. VisitRelatedView 新增匯出按鈕

在頁面頂部或底部加一個按鈕列：

```
┌──────────────────────────────────────┐
│  ← 返回    回診詳情         [匯出摘要] │
├──────────────────────────────────────┤
│  ... 既有的回診詳情內容 ...             │
```

點擊「匯出摘要」→ 開啟 VisitSummaryModal

### 2. VisitSummaryModal — 預覽 + 下載

全螢幕 modal，顯示 PDF 內容的 Web 版本（非 PDF 嵌入，是 HTML 排版的預覽）。

**資料來源**：`GET /visits/{id}/summary-json`

**佈局**：

```
┌──────────────────────────────────────────┐
│  回診摘要預覽          [下載 PDF]  [✕ 關閉] │
├──────────────────────────────────────────┤
│                                          │
│  ■ 回診資訊                               │
│  2026/03/28 高雄榮總 腎臟科                │
│  M3214 全身性紅斑性狼瘡腎絲球疾病            │
│                                          │
│  ■ 近 3 個月血壓                          │
│  ┌─────────────────────────────┐        │
│  │ 平均 130/83 · 最高 152/96   │        │
│  │ [Chart.js 每週平均折線圖]     │        │
│  └─────────────────────────────┘        │
│                                          │
│  ■ 檢驗結果（18 項，2 項異常）             │
│  [分組表格，異常值紅色高亮]                 │
│                                          │
│  ■ 核心指標趨勢（6 個月）                  │
│  [Chart.js 多線折線圖：Cr + eGFR + C3]   │
│                                          │
│  ■ 目前用藥 + 服藥率                      │
│  [表格 + 服藥率百分比]                     │
│                                          │
│  ■ 近 30 天症狀                           │
│  [類型 × 次數 + 平均嚴重度]               │
│                                          │
│  生成時間：2026/04/04 10:30               │
│  此報告由系統自動生成，內容僅供參考           │
│                                          │
│                          [下載 PDF]       │
└──────────────────────────────────────────┘
```

**預覽比 PDF 更豐富**：Web 預覽可以包含互動式圖表（Chart.js），
而 PDF 因為 QuestPDF 限制只用數值序列表示趨勢。

### 3. PDF 下載邏輯

```typescript
const downloadPdf = async (visitId: number) => {
  try {
    const response = await api.get(`/visits/${visitId}/summary-pdf`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `visit-summary-${visitId}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    // 錯誤處理
  }
}
```

### 4. 圖表設計（預覽用）

**血壓每週趨勢**
- Chart.js line chart
- 兩條線：收縮壓（accent 色）+ 舒張壓（accent-dark 色）
- X 軸：週次，Y 軸：mmHg
- 背景：surface-alt

**核心指標趨勢**
- Chart.js line chart，最多 3 條線
- 每條線不同顏色（Cr=accent、eGFR=success、C3=warning）
- X 軸：日期，Y 軸：各指標值
- 可用雙 Y 軸（Cr 和 C3 的量級不同）

### 5. 元件清單

| 元件 | 說明 |
|------|------|
| VisitSummaryModal | 全螢幕預覽 modal |
| SummaryBpSection | 血壓統計 + 折線圖 |
| SummaryLabTable | 檢驗結果分組表格 |
| SummaryLabTrendChart | 核心指標趨勢圖 |
| SummaryMedTable | 用藥 + 服藥率表格 |
| SummarySymptomSection | 症狀摘要 |
| PdfDownloadButton | 下載按鈕（含 loading 狀態） |

### 6. API Client 新增

```typescript
// src/api/visitSummary.ts
export const getVisitSummaryJson = (visitId: number) =>
  api.get(`/visits/${visitId}/summary-json`)

export const downloadVisitSummaryPdf = async (visitId: number) => {
  const response = await api.get(`/visits/${visitId}/summary-pdf`, {
    responseType: 'blob'
  })
  return response.data  // Blob
}
```

### 7. 回診時間軸整合

在 VisitTimelinePage 的每張 VisitSummaryCard 右上角加一個小圖示按鈕（下載 icon），
直接觸發 PDF 下載，不需進入詳情頁。

### 8. 設計注意

- 預覽 modal 背景用 surface-primary，模擬 PDF 的列印感
- 表格用細邊框，行距緊湊（模擬紙本報告感）
- 下載按鈕 loading 狀態（PDF 生成可能需要 1-2 秒）
- Dark Mode 預覽照常用 dark 色系，但 PDF 本身永遠是白底黑字
- 圖表在 modal 中用 surface-alt 背景區隔

完成後確認：
1. PDF 下載正常、中文顯示正確
2. 預覽內容與 PDF 內容一致（除了圖表）
3. Light/Dark 預覽都正常
