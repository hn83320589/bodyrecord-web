# BodyRecord.Web

## 專案概述
個人身體紀錄 Web 前端，Vue3 SPA。後端：HealthRecord.API

---

## Phase 1 功能範圍
- 帳號登入/註冊
- 個人資料（身體數據、緊急聯絡人）
- 血壓紀錄（CRUD、統計、趨勢圖）
- 檢驗紀錄（手動 CRUD、趨勢圖）
- 看診紀錄（唯讀 + 可刪除，NHI 匯入後可查）
- 用藥紀錄（唯讀 + 可刪除，NHI 匯入後可查）
- 健保存摺 JSON 匯入

---

## Tech Stack
- **Vue 3** + **Vite** + **TypeScript**
- **Pinia** / **Vue Router 4**
- **Axios**（含 interceptor）
- **ECharts 5** + **vue-echarts**
- **Naive UI** + **TailwindCSS v4**

---

## 環境變數

```env
VITE_API_BASE_URL=http://localhost:5000   # .env.development
VITE_API_BASE_URL=https://api.zeabur.app  # .env.production
```

---

## 目錄結構

```
src/
├── api/
│   ├── client.ts             ← Axios instance + interceptors
│   ├── auth.ts
│   ├── profile.ts
│   ├── bloodPressure.ts
│   ├── lab.ts
│   ├── healthRecord.ts        ← GET + DELETE only
│   ├── medication.ts         ← GET + DELETE only
│   └── nhi.ts
├── constants/
│   └── labPresets.ts         ← 37 個預設指標（與後端 LabItemPresets 對應）
├── stores/
│   ├── auth.ts / profile.ts / bloodPressure.ts / lab.ts
│   ├── healthRecord.ts / medication.ts
├── views/
│   ├── auth/         LoginView / RegisterView
│   ├── dashboard/    DashboardView
│   ├── records/      RecordListView / RecordFormView
│   ├── lab/          LabListView / LabFormView / LabTrendView
│   ├── health-records/  HealthRecordListView / HealthRecordDetailView（唯讀）
│   ├── medication/   MedicationListView（唯讀）
│   ├── nhi/          NhiImportView
│   ├── stats/        StatsView
│   └── profile/      ProfileView
├── components/
│   ├── charts/       BPTrendChart / LabTrendChart
│   ├── common/       SourceBadge / PageHeader / LoadingSpinner
│   └── nhi/          NhiImportUploader / NhiImportLogList
├── types/
│   ├── api.ts / auth.ts / profile.ts
│   ├── bloodPressure.ts
│   ├── lab.ts                ← LabResultDetail（自帶項目定義，無 labItemId）
│   ├── healthRecord.ts / medication.ts / nhi.ts
└── utils/
    ├── dateTime.ts / bpClassify.ts / labClassify.ts
```

---

## 路由

| 路徑 | 說明 | 需登入 |
|------|------|--------|
| `/login` / `/register` | 認證 | — |
| `/` | Dashboard | ✓ |
| `/records` | 血壓列表 | ✓ |
| `/records/new` | 新增血壓 | ✓ |
| `/stats` | 血壓統計 | ✓ |
| `/lab` | 檢驗列表 | ✓ |
| `/lab/new` | 手動新增 | ✓ |
| `/lab/trend` | 趨勢圖 | ✓ |
| `/health-records` | 看診列表 | ✓ |
| `/health-records/:id` | 看診詳情 | ✓ |
| `/medications` | 用藥列表 | ✓ |
| `/nhi` | 健保匯入 | ✓ |
| `/profile` | 個人資料 | ✓ |

---

## 關鍵設計說明

### LabResultDetail 沒有 labItemId
每筆 LabResultDetail 直接帶 `itemName / itemCode / unit / category / normalMin / normalMax`，
不需要查另一張表。

手動新增時，使用者從 `labPresets.ts` 常數選單選擇指標，前端直接帶定義欄位送出。

```typescript
// constants/labPresets.ts
export const LAB_PRESETS = [
  { itemName: '肌酸酐', itemCode: 'Cr', unit: 'mg/dL', category: '腎功能', normalMin: 0.7, normalMax: 1.3 },
  { itemName: '補體C3', itemCode: 'C3', unit: 'mg/dL', category: '免疫指標', normalMin: 87, normalMax: 200 },
  // ... 37 項
]
```

### health_record_id 弱關聯
血壓、檢驗、用藥新增時，`healthRecordId` 可以為 null（單獨輸入）或帶入看診 id（關聯某次看診）。

### SourceBadge 元件
```
source='manual'     → 灰色「手動輸入」
source='nhi_import' → 藍色「健保存摺 · 高雄榮總」（顯示 hospital）
source='healthkit'  → 綠色「Apple Health」
```

---

## 程式碼慣例
- `<script setup lang="ts">` Composition API
- View 不直接呼叫 API，透過 store 或 composable
- DELETE 看診 / 用藥 → 二次確認 dialog
- NHI 匯入拖曳 / 點擊上傳，接受 `.json`
