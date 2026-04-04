// 後端以 DateTime（無時區）存本地時間，但 JSON 序列化加上 Z 後綴。
// 前端一律用 UTC 方法讀取，避免瀏覽器再做 UTC→本地 的時區轉換。

export function formatDate(dateStr: string, style: 'full' | 'short' = 'full'): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  if (style === 'short') {
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
  }
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${formatDate(dateStr)} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}
