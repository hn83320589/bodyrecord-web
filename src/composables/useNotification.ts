import { medicationLogApi } from '@/api/medicationLog'

export function useNotification() {
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const scheduleCheck = () => {
    setInterval(async () => {
      try {
        const logs = await medicationLogApi.getToday()
        const now = new Date()
        for (const log of logs) {
          if (log.status === 'pending') {
            const scheduled = new Date(log.scheduledAt)
            const diffMin = (now.getTime() - scheduled.getTime()) / 60000
            if (diffMin >= 0 && diffMin < 1.5) {
              new Notification('服藥提醒', {
                body: `該吃 ${log.medicationName} ${log.dosage ?? ''} 了`,
                tag: `med-${log.id}`,
              })
            }
          }
        }
      } catch {
        // API not available yet, silently ignore
      }
    }, 60000)
  }

  return { requestPermission, scheduleCheck }
}
