import client from './client'
import type { UserProfile, UpdateProfileRequest, EmergencyContact, CreateEmergencyContactRequest } from '@/types/profile'

export const profileApi = {
  get: (): Promise<UserProfile> => client.get('/profile'),
  update: (data: UpdateProfileRequest): Promise<UserProfile> => client.put('/profile', data),
  getEmergencyContacts: (): Promise<EmergencyContact[]> =>
    client.get('/profile/emergency-contacts'),
  addEmergencyContact: (data: CreateEmergencyContactRequest): Promise<EmergencyContact> =>
    client.post('/profile/emergency-contacts', data),
  deleteEmergencyContact: (id: number): Promise<void> =>
    client.delete(`/profile/emergency-contacts/${id}`),
}
