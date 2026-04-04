import client from './client'
import type {
  MedicationReminder,
  CreateMedicationReminderRequest,
  UpdateMedicationReminderRequest,
} from '@/types/medicationReminder'

export const medicationReminderApi = {
  getAll: (): Promise<MedicationReminder[]> =>
    client.get('/medication-reminders'),

  create: (data: CreateMedicationReminderRequest): Promise<MedicationReminder> =>
    client.post('/medication-reminders', data),

  update: (id: number, data: UpdateMedicationReminderRequest): Promise<MedicationReminder> =>
    client.put(`/medication-reminders/${id}`, data),

  delete: (id: number): Promise<void> =>
    client.delete(`/medication-reminders/${id}`),

  toggle: (id: number): Promise<MedicationReminder> =>
    client.patch(`/medication-reminders/${id}/toggle`),

  createFromMedication: (medId: number): Promise<MedicationReminder> =>
    client.post(`/medication-reminders/from-medication/${medId}`),
}
