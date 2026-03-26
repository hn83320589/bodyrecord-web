import client from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => client.post('/auth/login', data),
  register: (data: RegisterRequest): Promise<AuthResponse> => client.post('/auth/register', data),
}
