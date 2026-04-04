# BodyRecord.Web

## 專案概述

個人健康紀錄 Web 前端，對應後端 HealthRecord.API。
以時間軸為核心瀏覽模式，支援 Light/Dark 雙主題。

---

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** + **TypeScript**
- **Tailwind CSS v4**（`@tailwindcss/vite` plugin，無 tailwind.config.js）
- **Pinia**（狀態管理）
- **Vue Router 5**
- **Axios**（API client，interceptor 使用 localStorage 避免 Pinia 循環依賴）
- **ECharts 5** + **vue-echarts**（趨勢圖）
- **@fontsource/jetbrains-mono**（Dark Mode 等寬數值字型）

---

## 環境變數

```env
VITE_API_BASE_URL=http://localhost:5090   # .env.development
VITE_API_BASE_URL=https://api.zeabur.app  # .env.production
```

---

## 設計系統

### 雙主題

- **Light Mode — Clinical Precision**：純白底、細線條、藍色資料點
- **Dark Mode — Slate Dashboard**：深色石板、螢光藍數據、等寬數值字型（JetBrains Mono）

### Design Tokens

Tailwind v4 使用 CSS `@theme` 區塊定義（在 `src/style.css`），配合 `:root` / `.dark` CSS Variables 切換主題。

**主要 token 前綴：**

| 前綴 | 用途 | 範例 class |
|------|------|-----------|
| `surface-*` | 背景色 | `bg-surface-primary`, `bg-surface-card`, `bg-surface-alt` |
| `content-*` | 文字色 | `text-content-primary`, `text-content-secondary`, `text-content-tertiary` |
| `border-*` | 邊框色 | `border-border-default`, `border-border-active` |
| `accent*` | 主色 | `bg-accent`, `text-accent`, `bg-accent-light` |
| `status-*` | 狀態色 | `text-status-danger`, `bg-status-success-bg` |
| `timeline-*` | 時間軸 | `bg-timeline-line`, `bg-timeline-dot` |
| `cat-*` | 類別色 | `bg-cat-bp`, `text-cat-lab`（血壓/檢驗/回診/用藥） |

### 字型規則

| 用途 | Light | Dark |
|------|-------|------|
| 一般文字 | font-sans | font-sans |
| 數值（血壓、檢驗值、統計卡） | font-sans | **font-mono**（`.font-data` class） |

### 主題切換

```typescript
// src/composables/useTheme.ts
// 使用 localStorage 持久化，同步 classList.toggle('dark')
// 注意：不使用 module-level watchEffect，避免干擾 Vue 初始化
```

---

## 目錄結構

```
src/
├── api/
│   ├── client.ts             ← Axios instance（interceptor 用 localStorage，不 import Pinia store）
│   ├── auth.ts
│   ├── profile.ts
│   ├── bloodPressure.ts
│   ├── lab.ts
│   ├── healthRecord.ts
│   ├── medication.ts
│   ├── nhi.ts                ← 獨立 Axios instance（multipart 上傳，timeout 60s）
│   └── userLabItem.ts        ← CRUD（GET /user-lab-items）
├── composables/
│   └── useTheme.ts           ← Light/Dark 切換
├── stores/
│   ├── auth.ts / profile.ts / bloodPressure.ts / lab.ts
│   ├── healthRecord.ts / medication.ts
├── views/
│   ├── auth/         LoginView / RegisterView
│   ├── dashboard/    DashboardView（時間軸 + 統計卡）
│   ├── records/      RecordListView / RecordFormView
│   ├── lab/          LabListView / LabFormView / LabTrendView / UserLabItemView
│   ├── health-records/  HealthRecordListView / HealthRecordDetailView
│   ├── medication/   MedicationListView
│   ├── nhi/          NhiImportView
│   ├── stats/        StatsView
│   └── profile/      ProfileView
├── components/
│   ├── charts/       BPTrendChart / LabTrendChart / LabValueBadge
│   ├── common/       AppLayout / PageHeader / LoadingSpinner / SourceBadge
│   │                 ThemeToggle / StatCard / CategoryPills / DateRangePicker / TimelineCard
│   └── nhi/          NhiImportUploader / NhiImportLogList
├── types/
│   ├── api.ts / auth.ts / profile.ts
│   ├── bloodPressure.ts
│   ├── lab.ts                ← LabResultDetail（自帶項目定義，無 labItemId）
│   ├── healthRecord.ts / medication.ts / nhi.ts
│   └── userLabItem.ts        ← UserLabItem / CreateUserLabItemRequest / UpdateUserLabItemRequest
├── utils/
│   ├── dateTime.ts / bpClassify.ts / labClassify.ts
└── style.css                 ← Tailwind @theme + CSS Variables + @fontsource imports
```

---

## 路由

| 路徑 | 說明 | 需登入 |
|------|------|--------|
| `/login` / `/register` | 認證 | — |
| `/` | Dashboard（時間軸 + 統計摘要） | ✓ |
| `/records` | 血壓列表 | ✓ |
| `/records/new` | 新增血壓 | ✓ |
| `/stats` | 血壓統計（趨勢圖） | ✓ |
| `/lab` | 檢驗列表 | ✓ |
| `/lab/new` | 手動新增檢驗 | ✓ |
| `/lab/trend` | 檢驗趨勢圖 | ✓ |
| `/lab/items` | 檢驗項目管理（CRUD） | ✓ |
| `/health-records` | 看診列表 | ✓ |
| `/health-records/:id` | 看診詳情 | ✓ |
| `/medications` | 用藥列表 | ✓ |
| `/nhi` | 健保存摺匯入 | ✓ |
| `/profile` | 個人資料 + 緊急聯絡人 | ✓ |

---

## 關鍵設計說明

### API Client 不 import Pinia Store

`api/client.ts` 的 request/response interceptor 直接使用 `localStorage` 讀取 token 和處理 401 登出，
**不 import `useAuthStore`**，避免 `router → store → api → store` 的循環依賴導致 Pinia 初始化失敗。

### 檢驗項目動態維護

- 舊的 `labPresets.ts` 常數已移除
- 檢驗項目從 `GET /user-lab-items` API 動態取得
- `itemCode` 為 NHI 申報代碼（如 `09015C`），非舊的縮寫（如 `Cr`）
- 趨勢圖查詢需 `itemCode + itemName` 兩個參數唯一識別

### LabResultDetail 沒有 labItemId

每筆 LabResultDetail 直接帶 `itemName / itemCode / unit / category / normalMin / normalMax`，
不需要查另一張表。手動新增時，使用者從 API 取得的項目清單選擇。

### health_record_id 弱關聯

血壓、檢驗、用藥新增時，`healthRecordId` 可為 null（單獨輸入）或帶入看診 id。

### SourceBadge 元件

```
source='manual'     → surface-alt「手動輸入」
source='nhi_import' → accent-light「健保存摺 · 醫院名」
source='healthkit'  → success-bg「Apple Health」
```

### Dashboard 時間軸

- 頂部 4 欄統計卡（StatCard）
- 類別篩選 pills（CategoryPills：全部/血壓/檢驗/回診/用藥）
- 時間範圍選擇（DateRangePicker：1月/3月/6月/1年，預設 3 月）
- 時間軸（TimelineCard）：從 4 個 store 取資料，依時間排序合併，偵測月份邊界插入分隔

---

## API 端點

```
# Auth
POST /auth/login
POST /auth/register

# Blood Pressure
GET    /blood-pressure              → PagedResult<BloodPressureResponse>
POST   /blood-pressure
DELETE /blood-pressure/{id}
GET    /blood-pressure/chart-data?period=30d  → List<BloodPressureChartPoint>

# Lab Results
GET    /lab-results/by-date         → List<LabResultsByDateGroup>
POST   /lab-results
DELETE /lab-results/{id}
GET    /lab-results/trend?itemCode=09015C&itemName=CRE(肌酸酐) → List<LabTrendPoint>

# User Lab Items
GET    /user-lab-items              → List<UserLabItemResponse>
POST   /user-lab-items
PUT    /user-lab-items/{id}
DELETE /user-lab-items/{id}

# Health Records
GET    /health-records              → PagedResult<HealthRecordResponse>
GET    /health-records/{id}         → HealthRecordDetailResponse
DELETE /health-records/{id}

# Medications
GET    /medications                 → PagedResult<MedicationResponse>
DELETE /medications/{id}

# Profile
GET    /profile                     → ProfileResponse（扁平結構）
PUT    /profile
GET    /profile/emergency-contacts
POST   /profile/emergency-contacts
DELETE /profile/emergency-contacts/{id}

# NHI Import
POST   /nhi/import                  → NhiImportResponse（multipart/form-data）
GET    /nhi/import/logs
DELETE /nhi/import/{logId}
```

---

## 程式碼慣例

- `<script setup lang="ts">` Composition API
- View 不直接呼叫 API，透過 store 或 composable
- DELETE 看診 / 用藥 → 二次確認 dialog
- NHI 匯入拖曳 / 點擊上傳，接受 `.json`
- 所有頁面使用 design token class（`bg-surface-card`），不使用硬編碼色碼（`bg-white`）
- Dark Mode 數值加 `font-data` class（自動套用 JetBrains Mono）

---

## 已知注意事項

- Safari 開發時需注意模組快取：修改後若無效果，先 `rm -rf node_modules/.vite` + 清除瀏覽器快取
- `api/nhi.ts` 有獨立的 Axios instance（不共用 client.ts），timeout 較長（60s）
- 看診紀錄的 `secondaryDiagnoses` 是 JSON 字串，前端需 `JSON.parse` 後顯示
