export function classifyLabValue(value: number, normalMin?: number, normalMax?: number): 'high' | 'low' | 'normal' {
  if (normalMax != null && value > normalMax) return 'high'
  if (normalMin != null && value < normalMin) return 'low'
  return 'normal'
}
