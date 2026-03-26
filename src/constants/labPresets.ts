export interface LabPreset {
  itemName: string
  itemCode: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
}

export const LAB_PRESETS: LabPreset[] = [
  { itemName: '肌酸酐', itemCode: 'Cr', unit: 'mg/dL', category: '腎功能', normalMin: 0.7, normalMax: 1.3 },
  { itemName: '尿素氮', itemCode: 'BUN', unit: 'mg/dL', category: '腎功能', normalMin: 7, normalMax: 25 },
  { itemName: '腎絲球過濾率', itemCode: 'eGFR', unit: 'mL/min/1.73m²', category: '腎功能', normalMin: 60 },
  { itemName: '尿酸', itemCode: 'UA', unit: 'mg/dL', category: '代謝', normalMin: 3.5, normalMax: 7.2 },
  { itemName: '空腹血糖', itemCode: 'AC', unit: 'mg/dL', category: '血糖', normalMin: 70, normalMax: 100 },
  { itemName: '糖化血色素', itemCode: 'HbA1c', unit: '%', category: '血糖', normalMin: 4.0, normalMax: 5.6 },
  { itemName: '總膽固醇', itemCode: 'T-CHO', unit: 'mg/dL', category: '血脂', normalMax: 200 },
  { itemName: '三酸甘油酯', itemCode: 'TG', unit: 'mg/dL', category: '血脂', normalMax: 150 },
  { itemName: '高密度脂蛋白', itemCode: 'HDL', unit: 'mg/dL', category: '血脂', normalMin: 40 },
  { itemName: '低密度脂蛋白', itemCode: 'LDL', unit: 'mg/dL', category: '血脂', normalMax: 130 },
  { itemName: '天門冬氨酸轉胺酶', itemCode: 'AST', unit: 'U/L', category: '肝功能', normalMin: 10, normalMax: 40 },
  { itemName: '丙氨酸轉胺酶', itemCode: 'ALT', unit: 'U/L', category: '肝功能', normalMin: 7, normalMax: 40 },
  { itemName: '鹼性磷酸酶', itemCode: 'ALP', unit: 'U/L', category: '肝功能', normalMin: 44, normalMax: 147 },
  { itemName: '總膽紅素', itemCode: 'T-BIL', unit: 'mg/dL', category: '肝功能', normalMin: 0.2, normalMax: 1.2 },
  { itemName: '白蛋白', itemCode: 'ALB', unit: 'g/dL', category: '肝功能', normalMin: 3.5, normalMax: 5.0 },
  { itemName: '甲狀腺刺激素', itemCode: 'TSH', unit: 'μIU/mL', category: '甲狀腺', normalMin: 0.4, normalMax: 4.0 },
  { itemName: '游離四碘甲狀腺素', itemCode: 'Free T4', unit: 'ng/dL', category: '甲狀腺', normalMin: 0.8, normalMax: 1.8 },
  { itemName: '紅血球數', itemCode: 'RBC', unit: '10⁶/μL', category: '血液常規', normalMin: 4.2, normalMax: 5.4 },
  { itemName: '血紅素', itemCode: 'Hb', unit: 'g/dL', category: '血液常規', normalMin: 12.0, normalMax: 16.0 },
  { itemName: '血容比', itemCode: 'Hct', unit: '%', category: '血液常規', normalMin: 37, normalMax: 47 },
  { itemName: '白血球數', itemCode: 'WBC', unit: '10³/μL', category: '血液常規', normalMin: 4.5, normalMax: 11.0 },
  { itemName: '血小板數', itemCode: 'PLT', unit: '10³/μL', category: '血液常規', normalMin: 150, normalMax: 400 },
  { itemName: '鈉', itemCode: 'Na', unit: 'mEq/L', category: '電解質', normalMin: 136, normalMax: 145 },
  { itemName: '鉀', itemCode: 'K', unit: 'mEq/L', category: '電解質', normalMin: 3.5, normalMax: 5.0 },
  { itemName: '鈣', itemCode: 'Ca', unit: 'mg/dL', category: '電解質', normalMin: 8.5, normalMax: 10.5 },
  { itemName: '磷', itemCode: 'P', unit: 'mg/dL', category: '電解質', normalMin: 2.5, normalMax: 4.5 },
  { itemName: '鐵', itemCode: 'Fe', unit: 'μg/dL', category: '鐵代謝', normalMin: 60, normalMax: 170 },
  { itemName: '鐵蛋白', itemCode: 'Ferritin', unit: 'ng/mL', category: '鐵代謝', normalMin: 12, normalMax: 150 },
  { itemName: 'C反應蛋白', itemCode: 'CRP', unit: 'mg/L', category: '發炎指標', normalMax: 5.0 },
  { itemName: '紅血球沉降速率', itemCode: 'ESR', unit: 'mm/hr', category: '發炎指標', normalMax: 20 },
  { itemName: '補體C3', itemCode: 'C3', unit: 'mg/dL', category: '免疫指標', normalMin: 87, normalMax: 200 },
  { itemName: '補體C4', itemCode: 'C4', unit: 'mg/dL', category: '免疫指標', normalMin: 16, normalMax: 47 },
  { itemName: '抗核抗體', itemCode: 'ANA', unit: 'titer', category: '免疫指標' },
  { itemName: '維生素D', itemCode: 'Vit-D', unit: 'ng/mL', category: '維生素', normalMin: 30, normalMax: 100 },
  { itemName: '維生素B12', itemCode: 'Vit-B12', unit: 'pg/mL', category: '維生素', normalMin: 200, normalMax: 900 },
  { itemName: '葉酸', itemCode: 'Folate', unit: 'ng/mL', category: '維生素', normalMin: 3.0 },
  { itemName: '攝護腺特異抗原', itemCode: 'PSA', unit: 'ng/mL', category: '腫瘤標記', normalMax: 4.0 },
]
