export type TrafficPoint = { day: string; visits: number }
export type RevenuePoint = { day: string; revenue: number }

export type UserStatus = 'active' | 'invited' | 'disabled'
export type UserRole = 'admin' | 'editor' | 'viewer'

export type ApiUser = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
}
