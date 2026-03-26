# BodyRecord.Web — Claude Code Prompt

## 🚀 Phase 1 初始化

```
請依照 CLAUDE.md 建立 BodyRecord.Web 專案（Vue3 + Vite + TypeScript）。

【專案建立】
1. npm create vite@latest BodyRecord.Web -- --template vue-ts
2. 安裝套件：
   axios pinia vue-router echarts vue-echarts naive-ui
   tailwindcss @tailwindcss/vite

【型別與常數】
3. 建立 src/constants/labPresets.ts（37 項，與後端 LabItemPresets 對應）
   每項包含：itemName / itemCode / unit / category / normalMin / normalMax
4. 建立 src/types/：
   api.ts（ApiResponse<T>）、auth.ts、profile.ts、bloodPressure.ts、
   lab.ts（LabResultDetail 自帶項目定義，無 labItemId）、
   healthRecord.ts / medication.ts / nhi.ts
   （參照 .claude/skills/api-client.md 的型別定義）

【API 層】
5. 建立 Axios client + interceptors（參照 .claude/skills/api-client.md）
6. 建立 src/api/：auth.ts / profile.ts / bloodPressure.ts / lab.ts /
   healthRecord.ts / medication.ts / nhi.ts（multipart 上傳）

【狀態管理 + 路由】
7. Pinia stores：auth / profile / bloodPressure / lab / healthRecord / medication
8. Vue Router，Navigation Guard 未登入跳 /login

【共用元件】
9. SourceBadge.vue（manual 灰 / nhi_import 藍 · 醫院名 / healthkit 綠）
10. LoadingSpinner / PageHeader

【Auth】
11. LoginView + RegisterView

【Profile】
12. ProfileView：身體數據、慢性病史/過敏史、緊急聯絡人 CRUD

【血壓】
13. RecordListView（列表，含 SourceBadge）
14. RecordFormView（新增，healthRecordId 可選帶入）
15. StatsView（BPTrendChart，切換 7d / 30d / all）

【檢驗】
16. LabListView（依日期分組，每組顯示 SourceBadge）
17. LabFormView（手動新增，從 labPresets 選單選指標，填數值）
    每筆帶入完整項目定義（itemName / itemCode / unit / normalMin / normalMax）
18. LabTrendView（選 itemCode，ECharts 趨勢圖）
    參照 .claude/skills/lab-trend-chart.md

【看診（唯讀 + 可刪除）】
19. HealthRecordListView（列表，顯示就醫日期/醫院/主診斷）
20. HealthRecordDetailView（
    - 主診斷 + 次診斷
    - 同 health_record_id 的用藥清單（drug_type='medication'）
    - 同 health_record_id 的檢驗結果
    - DELETE 按鈕（二次確認，僅 source='nhi_import'）
）

【用藥（唯讀 + 可刪除）】
21. MedicationListView（預設只顯示 drug_type='medication'）
    DELETE 按鈕（二次確認，僅 source='nhi_import'）

【NHI 匯入】
22. NhiImportView：
    - 拖曳 / 點擊上傳 .json，accept=".json"
    - 上傳後顯示檔名 + 大小
    - 「開始匯入」按鈕，loading 狀態
    - 成功後顯示：看診 N 筆 / 用藥 M 項 / 檢驗 K 筆 / 跳過 X 項 / 日期範圍
    - 下方匯入歷史列表（NhiImportLogList），含撤銷按鈕（n-popconfirm 二次確認）
23. NhiImportUploader / NhiImportLogList 元件

【Dashboard】
24. DashboardView：最近血壓摘要 + 最近一次異常檢驗值（含 SourceBadge）

【收尾】
25. .env.development / .env.production 範本
26. 建立 README.md
```

---

## 🔧 後續 Prompt

### Phase 2
```
新增 HealthRecordFormView（手動新增看診）、MedicationFormView（手動新增用藥）。
血壓/檢驗新增表單加上「關聯本次看診」選項（healthRecordId 下拉選單）。
```

### PWA
```
安裝 vite-plugin-pwa，設定 manifest 和 offline 快取策略。
```
