# BodyRecord.Web — CLAUDE.md v2

## 專案概述

BodyRecord 個人健康紀錄 Web 前端。對應後端 HealthRecord.API v2。
以時間軸為核心瀏覽模式，支援 Light/Dark 雙主題。

---

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite**
- **Tailwind CSS** (含 dark mode: `class` 策略)
- **Axios**（API client）
- **Chart.js**（趨勢圖）
- **date-fns**（日期處理）
- **Pinia**（狀態管理）

---

## 環境變數

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 設計系統

### 雙主題定義

**Light Mode — Clinical Precision**
醫療儀器感，純白底、細線條、藍色資料點。

**Dark Mode — Slate Dashboard**
深色石板、冷調科技感、螢光藍數據、等寬數值字型。

### Design Tokens（Tailwind CSS 自訂）

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          primary: 'var(--surface-primary)',     // 主背景
          card: 'var(--surface-card)',            // 卡片
          alt: 'var(--surface-alt)',              // 次要表面（統計卡）
        },
        border: {
          DEFAULT: 'var(--border-default)',
          active: 'var(--border-active)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
        },
        status: {
          success: 'var(--status-success)',
          'success-bg': 'var(--status-success-bg)',
          warning: 'var(--status-warning)',
          'warning-bg': 'var(--status-warning-bg)',
          danger: 'var(--status-danger)',
          'danger-bg': 'var(--status-danger-bg)',
        },
        timeline: {
          line: 'var(--timeline-line)',
          dot: 'var(--timeline-dot)',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
    },
  },
}
```

### CSS Variables

```css
:root {
  /* Light Mode — Clinical Precision */
  --surface-primary: #F7F8FA;
  --surface-card: #FFFFFF;
  --surface-alt: #F0F2F5;
  --border-default: #E2E5EA;
  --border-active: #94A3B8;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-tertiary: #94A3B8;
  --accent: #3B82F6;
  --accent-light: #DBEAFE;
  --accent-dark: #1D4ED8;
  --status-success: #10B981;
  --status-success-bg: #D1FAE5;
  --status-warning: #F59E0B;
  --status-warning-bg: #FEF3C7;
  --status-danger: #EF4444;
  --status-danger-bg: #FEE2E2;
  --timeline-line: #CBD5E1;
  --timeline-dot: #3B82F6;
  --radius-card: 8px;
  --cat-bp: #3B82F6;
  --cat-bp-bg: #DBEAFE;
  --cat-lab: #10B981;
  --cat-lab-bg: #D1FAE5;
  --cat-visit: #F59E0B;
  --cat-visit-bg: #FEF3C7;
  --cat-med: #8B5CF6;
  --cat-med-bg: #EDE9FE;
}

.dark {
  /* Dark Mode — Slate Dashboard */
  --surface-primary: #0F172A;
  --surface-card: #1E293B;
  --surface-alt: #334155;
  --border-default: #334155;
  --border-active: #475569;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --accent: #38BDF8;
  --accent-light: #0C4A6E;
  --accent-dark: #7DD3FC;
  --status-success: #34D399;
  --status-success-bg: #064E3B;
  --status-warning: #FBBF24;
  --status-warning-bg: #422006;
  --status-danger: #FB7185;
  --status-danger-bg: #4C1D2A;
  --timeline-line: #475569;
  --timeline-dot: #38BDF8;
  --radius-card: 12px;
  --cat-bp: #38BDF8;
  --cat-bp-bg: #0C4A6E;
  --cat-lab: #34D399;
  --cat-lab-bg: #064E3B;
  --cat-visit: #FBBF24;
  --cat-visit-bg: #422006;
  --cat-med: #A78BFA;
  --cat-med-bg: #2E1065;
}
```

### 字型規則

| 用途 | Light | Dark | 大小 | 粗細 |
|------|-------|------|------|------|
| 頁面標題 | font-sans | font-sans | 20px | 600 |
| 卡片標題 | font-sans | font-sans | 14px | 600 |
| 數值（血壓、檢驗值） | font-sans | **font-mono** | 20px | 700 |
| 統計卡數值 | font-sans | **font-mono** | 24px | 600 |
| 說明文字 | font-sans | font-sans | 12-13px | 400 |
| 時間標籤 | font-sans | font-sans | 11px | 600 |

> Dark Mode 的數值使用等寬字型（JetBrains Mono），強化科技儀表板感。

### 類別色彩

| 類別 | 色碼（Light） | 色碼（Dark） | 用途 |
|------|-------------|-------------|------|
| 血壓 | #3B82F6 / #DBEAFE | #38BDF8 / #0C4A6E | badge、時間軸標記 |
| 檢驗 | #10B981 / #D1FAE5 | #34D399 / #064E3B | badge、趨勢線 |
| 回診 | #F59E0B / #FEF3C7 | #FBBF24 / #422006 | badge |
| 用藥 | #8B5CF6 / #EDE9FE | #A78BFA / #2E1065 | badge |

---

## 頁面結構

### 主要路由

```
/                     → Dashboard（時間軸 + 統計摘要）
/blood-pressure       → 血壓紀錄列表 + 新增
/blood-pressure/:id   → 血壓詳情/編輯
/lab-results          → 檢驗紀錄列表
/lab-results/trend    → 趨勢圖（選擇指標）
/lab-items            → 我的檢驗項目管理
/visits               → 回診紀錄列表
/medications          → 用藥紀錄列表
/nhi/import           → 健保存摺匯入
/profile              → 個人資料 + 緊急聯絡人
/settings             → 設定（主題切換等）
/login                → 登入
/register             → 註冊
```

### Dashboard 佈局

```
┌──────────────────────────────────┐
│  Logo    搜尋    [Dark/Light] 頭像 │  ← TopNav
├──────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │平均 │ │最近 │ │本月 │ │下次 │   │  ← 統計卡 (4欄)
│  │血壓 │ │Cr  │ │量測 │ │回診 │   │
│  └────┘ └────┘ └────┘ └────┘   │
├──────────────────────────────────┤
│  [全部][血壓][檢驗][回診][用藥]    │  ← 類別篩選 pills
│           [1月][3月][6月][1年]    │  ← 時間範圍（預設3月）
├──────────────────────────────────┤
│  4月 ─────────────────────       │
│  01 ● ─ 血壓量測 128/82 mmHg    │  ← 時間軸
│  日  │                          │
│     │                          │
│  3月 ─────────────────────       │
│  28 ● ─ 腎功能追蹤 Cr 1.15      │
│  六  │                          │
│  28 ● ─ 腎臟科門診 高雄榮總       │
│  六  │                          │
│  15 ● ─ 血壓量測 135/88 ⚠️       │
│  日  │                          │
│  ...                            │
└──────────────────────────────────┘
```

### 時間軸組件規格

```
左欄（36px寬）：
  日期數字（11px, font-weight 600, text-secondary）
  週幾（9px, text-tertiary）
  圓點（8px, 填色 timeline-dot）
  連接線（1.5px, timeline-line）

月份分隔：
  月份標籤（12px, font-weight 600, text-tertiary, 大寫, tracking-wide）
  水平線可選

右側卡片：
  背景 surface-card
  邊框 1px border-default
  圓角 radius-card
  內距 12px 16px
  hover: border-active + 微抬升 shadow

卡片內容：
  第一行：StatusDot + 標題(14px/600) + 類別Badge(右對齊)
  第二行：數值(20px/700, dark mode 用 font-mono) + 單位(12px/tertiary)
  第三行：說明(12px/secondary)
```

---

## 元件清單

### 通用元件

| 元件 | 說明 |
|------|------|
| AppLayout | 整體佈局（TopNav + 內容區） |
| TopNav | 上方導航列（Logo、搜尋、主題切換、使用者頭像） |
| ThemeToggle | Light/Dark 切換按鈕 |
| StatCard | 統計摘要卡片（標籤 + 數值 + 副標） |
| CategoryPills | 類別篩選按鈕組 |
| DateRangePicker | 時間範圍選擇（1月/3月/6月/1年 + 自訂） |
| TimelineView | 時間軸主元件（日期列 + 連接線 + 卡片） |
| TimelineCard | 時間軸中的紀錄卡片 |
| StatusDot | 狀態圓點（normal/warning/danger/info） |
| CatBadge | 類別標籤 |
| EmptyState | 無資料狀態提示 |

### 功能元件

| 元件 | 說明 |
|------|------|
| BpForm | 血壓新增/編輯表單 |
| BpChart | 血壓趨勢圖（Chart.js line） |
| LabForm | 檢驗新增/編輯表單（項目從 API 動態取得） |
| LabTrendChart | 檢驗趨勢圖（項目選單從 GET /user-lab-items） |
| LabItemManager | 我的檢驗項目管理（CRUD） |
| VisitCard | 回診卡片（含多診斷展開） |
| MedCard | 用藥卡片 |
| NhiImportView | NHI 匯入介面 + 結果顯示 |
| ProfileForm | 個人資料編輯 |
| EmergencyContactList | 緊急聯絡人 CRUD |

---

## API Client

### 基本設定

```typescript
// src/api/client.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

### 端點（對應後端 v2）

```typescript
// Auth
POST /auth/register
POST /auth/login
POST /auth/refresh

// Blood Pressure
GET    /blood-pressure?page=1&pageSize=20&startDate=...&endDate=...
GET    /blood-pressure/{id}
POST   /blood-pressure
PUT    /blood-pressure/{id}
DELETE /blood-pressure/{id}
GET    /blood-pressure/statistics?startDate=...&endDate=...

// Lab Results
GET    /lab-results
POST   /lab-results
GET    /lab-results/trend?itemCode=09015C&itemName=CRE(肌酸酐)

// User Lab Items（新增）
GET    /user-lab-items
POST   /user-lab-items
PUT    /user-lab-items/{id}
DELETE /user-lab-items/{id}

// Visits
GET    /visits
GET    /visits/{id}
POST   /visits
PUT    /visits/{id}
DELETE /visits/{id}

// Medications
GET    /medications
POST   /medications
PUT    /medications/{id}
DELETE /medications/{id}

// NHI Import
POST   /nhi/import          (multipart/form-data)
GET    /nhi/import-logs
DELETE /nhi/import-logs/{id}
```

---

## 主題切換實作

```typescript
// src/composables/useTheme.ts
import { ref, watchEffect } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

export function useTheme() {
  const toggle = () => { isDark.value = !isDark.value }
  return { isDark, toggle }
}
```

---

## 已移除項目

- `src/constants/labPresets.ts` — 不再需要，改從 GET /user-lab-items 取得
- 舊的趨勢圖查詢參數 `?itemCode=Cr` — 改為 `?itemCode=09015C&itemName=CRE(肌酸酐)`

---

## 重構 Prompt（給 Claude Code）

```
我已將 CLAUDE.md 更新為 v2 版本，請閱讀完整內容後進行以下重構：

## 設計系統

1. 安裝 @fontsource/jetbrains-mono（Dark Mode 數值字型）
2. tailwind.config.js 新增自訂 colors/fonts/borderRadius
3. 新增 CSS variables（:root + .dark）到 src/assets/main.css
4. 實作 useTheme composable + ThemeToggle 元件

## 頁面重構

5. Dashboard 改為時間軸佈局：
   - 頂部 4 欄統計卡（StatCard）
   - 類別篩選 pills（CategoryPills）
   - 時間範圍選擇（DateRangePicker，預設 3 個月）
   - 時間軸（TimelineView + TimelineCard）
6. 統一所有頁面使用新的 Design Tokens
7. Dark Mode 數值使用 font-mono

## API 調整

8. 移除 labPresets.ts，改為呼叫 GET /user-lab-items
9. 趨勢圖查詢改為 itemCode + itemName 兩參數
10. 新增 UserLabItem API client（CRUD）
11. 新增 LabItemManager 頁面（/lab-items）
12. NHI 匯入結果顯示新增：newItemCount、skippedLabCount、duplicateLabCount

## 完成後

13. 確認 Light/Dark 切換正常
14. 確認所有頁面在兩個主題下視覺一致
```
