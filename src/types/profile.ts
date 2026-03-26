// 後端 ProfileResponse（扁平結構）
export interface UserProfile {
  id: number
  email: string
  displayName: string
  birthDate?: string
  gender?: string
  heightCm?: number
  weightKg?: number
  bloodType?: string
  chronicConditions?: string
  allergies?: string
}

export interface UpdateProfileRequest {
  displayName: string
  birthDate?: string
  gender?: string
  heightCm?: number
  weightKg?: number
  bloodType?: string
  chronicConditions?: string
  allergies?: string
}

export interface EmergencyContact {
  id: number
  name: string
  relationship: string
  phone: string
  note?: string
  sortOrder: number
}

export interface CreateEmergencyContactRequest {
  name: string
  relationship: string
  phone: string
  note?: string
  sortOrder?: number
}
