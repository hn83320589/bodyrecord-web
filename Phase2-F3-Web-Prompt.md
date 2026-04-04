# Phase 2 Feature 3 — 服藥提醒（Web 前端）

請閱讀 CLAUDE.md 後，實作服藥提醒與服藥紀錄功能。

## 新增頁面

### 1. /medications/reminders — 服藥提醒主頁

**今日服藥卡片（頂部，最重要）**

一張全寬卡片，列出今天所有排定的服藥：

```
┌──────────────────────────────────────────┐
│  今日服藥                    4/6 已完成    │
│  ┌────────────────────────────────────┐  │
│  │ 08:00  Prednisolone 5mg    [✓ 已服] │  │ ← 綠色已完成
│  │ 08:00  MMF 1000mg          [✓ 已服] │  │
│  │ 08:00  HCQ 200mg           [● 服藥] │  │ ← accent 按鈕
│  │ 14:00  MMF 1000mg          [待服藥]  │  │ ← 灰色未到時間
│  │ 20:00  MMF 1000mg          [待服藥]  │  │
│  │ 20:00  HCQ 200mg           [待服藥]  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- 已過時間 + pending → 紅色「已錯過」
- 已過時間 + taken → 綠色「已服」+ 打勾
- 已過時間 + late → 橙色「遲服」
- 已過時間 + skipped → 灰色刪除線「已跳過」
- 未到時間 + pending → 灰色「待服藥」
- 點擊「服藥」按鈕 → POST /medication-logs/{id}/take
- 長按或右鍵 → 選項：跳過 / 撤銷

API：`GET /medication-logs/today`

**服藥率統計卡片（3 欄）**
- 整體服藥率（圓環進度條）
- 本月最佳藥物
- 本月最差藥物

API：`GET /medication-logs/adherence?days=30`

**提醒列表**
- 所有設定的提醒，依啟用/停用分組
- 每張卡片：藥名 + 劑量 + 時間 + 啟用 toggle
- 右上角「+ 新增提醒」按鈕
- 點擊 → 編輯 modal

API：`GET /medication-reminders`

### 2. ReminderFormModal — 新增/編輯提醒

Modal 表單：

- 藥品名稱（text input，必填）
- 劑量（text input）
- 頻率快捷：QD / BID / TID 按鈕 → 自動填入 remind_times
  - QD → ["08:00"]
  - BID → ["08:00", "20:00"]
  - TID → ["08:00", "14:00", "20:00"]
- 自訂時間：time picker，可新增多個
- 星期幾：7 個 toggle（預設全選）
- 開始/結束日期（date picker，可選）
- 啟用 toggle

API：`POST /medication-reminders` 或 `PUT /medication-reminders/{id}`

### 3. 從已有用藥快速建立

在用藥紀錄列表（/medications）的每筆用藥卡片上加一個「設定提醒」按鈕：
- 點擊 → 自動帶入藥名和劑量，開啟 ReminderFormModal
- API：`POST /medication-reminders/from-medication/{medicationDetailId}`

### 4. /medications/adherence — 服藥率詳細頁

**整體服藥率圓環圖**
- Chart.js doughnut：taken + late vs skipped + missed
- 中心顯示百分比

**各藥物服藥率柱狀圖**
- Chart.js horizontal bar
- 每種藥物一條
- 顏色：>90% 綠、70-90% 橙、<70% 紅

**每日趨勢折線圖**
- Chart.js line
- X: 日期，Y: 當日服藥率 %
- 參考線 80% 水平虛線

API：`GET /medication-logs/adherence?days=30`

### 5. 瀏覽器通知（Web Notification API）

```typescript
// src/composables/useNotification.ts
export function useNotification() {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const scheduleCheck = () => {
    // 每分鐘檢查是否有到期的提醒
    setInterval(async () => {
      const logs = await api.get('/medication-logs/today')
      const now = new Date()
      for (const log of logs) {
        if (log.status === 'pending') {
          const scheduled = new Date(log.scheduledAt)
          const diff = (now - scheduled) / 60000  // 分鐘
          if (diff >= 0 && diff < 1) {
            new Notification('服藥提醒', {
              body: `該吃 ${log.medicationName} ${log.dosage || ''} 了`,
              icon: '/icon-192.png',
              tag: `med-${log.id}`,
            })
          }
        }
      }
    }, 60000)
  }

  return { requestPermission, scheduleCheck }
}
```

在 App.vue 的 onMounted 中呼叫 `requestPermission()` + `scheduleCheck()`。

> 注意：瀏覽器通知只在頁面開啟時有效。若需要背景通知，未來可考慮 Service Worker + Web Push，但 Phase 2 先做簡單版。

### 6. 元件清單

| 元件 | 說明 |
|------|------|
| MedicationReminderPage | 主頁佈局 |
| TodayMedCard | 今日服藥卡片 |
| MedLogItem | 單筆服藥紀錄行（含狀態按鈕） |
| ReminderFormModal | 新增/編輯提醒 modal |
| ReminderCard | 提醒列表卡片（含 toggle） |
| AdherencePage | 服藥率詳細頁 |
| AdherenceRing | 圓環進度條 |
| FrequencyQuickPick | QD/BID/TID 快捷按鈕 |
| TimePickerList | 多個 time picker 管理 |

### 7. API Client 新增

```typescript
// src/api/medicationReminder.ts
export const getReminders = () => api.get('/medication-reminders')
export const createReminder = (data) => api.post('/medication-reminders', data)
export const updateReminder = (id, data) => api.put(`/medication-reminders/${id}`, data)
export const deleteReminder = (id) => api.delete(`/medication-reminders/${id}`)
export const toggleReminder = (id) => api.patch(`/medication-reminders/${id}/toggle`)
export const createFromMedication = (medId, data?) =>
  api.post(`/medication-reminders/from-medication/${medId}`, data)

// src/api/medicationLog.ts
export const getTodayLogs = () => api.get('/medication-logs/today')
export const getLogs = (params) => api.get('/medication-logs', { params })
export const takeMed = (id) => api.post(`/medication-logs/${id}/take`)
export const skipMed = (id, note?) => api.post(`/medication-logs/${id}/skip`, { note })
export const undoMed = (id) => api.post(`/medication-logs/${id}/undo`)
export const getAdherence = (days = 30) =>
  api.get('/medication-logs/adherence', { params: { days } })
```

### 8. 路由新增

```typescript
{ path: '/medications/reminders', component: MedicationReminderPage },
{ path: '/medications/adherence', component: AdherencePage },
```

### 9. Dashboard 整合

- Dashboard 頂部新增一張「今日服藥」迷你卡：顯示 X/Y 已完成 + 下一個服藥時間
- 點擊 → 跳轉 /medications/reminders

### 10. 設計注意

- 今日服藥卡是整個功能的核心互動，按鈕要大、狀態要明確
- 服藥率 < 70% 用 danger 色，70-90% 用 warning，> 90% 用 success
- 圓環進度條在 Dark Mode 背景要清楚可辨
- Light/Dark 雙主題驗證

完成後確認通知功能在 Chrome 中正常運作。
