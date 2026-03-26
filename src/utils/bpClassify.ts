export type BPCategory = 'normal' | 'elevated' | 'high1' | 'high2' | 'crisis'

export function classifyBP(systolic: number, diastolic: number): BPCategory {
  if (systolic >= 180 || diastolic >= 120) return 'crisis'
  if (systolic >= 140 || diastolic >= 90) return 'high2'
  if (systolic >= 130 || diastolic >= 80) return 'high1'
  if (systolic >= 120 && diastolic < 80) return 'elevated'
  return 'normal'
}

export const BP_CATEGORY_LABEL: Record<BPCategory, string> = {
  normal: '正常',
  elevated: '偏高',
  high1: '高血壓一期',
  high2: '高血壓二期',
  crisis: '高血壓危象',
}

export const BP_CATEGORY_COLOR: Record<BPCategory, string> = {
  normal: 'text-green-600',
  elevated: 'text-yellow-600',
  high1: 'text-orange-600',
  high2: 'text-red-600',
  crisis: 'text-red-800',
}
