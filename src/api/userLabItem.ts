import client from './client'
import type { UserLabItem, CreateUserLabItemRequest, UpdateUserLabItemRequest } from '@/types/userLabItem'

export const userLabItemApi = {
  getAll: (): Promise<UserLabItem[]> =>
    client.get('/user-lab-items'),
  create: (data: CreateUserLabItemRequest): Promise<UserLabItem> =>
    client.post('/user-lab-items', data),
  update: (id: number, data: UpdateUserLabItemRequest): Promise<UserLabItem> =>
    client.put(`/user-lab-items/${id}`, data),
  delete: (id: number): Promise<void> =>
    client.delete(`/user-lab-items/${id}`),
}
