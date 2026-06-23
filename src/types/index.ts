export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  requiresPhoto: boolean
}

export interface Team {
  id: string
  name: string
  normalizedName: string
  createdAt: Date
}

export interface Completion {
  id: string
  teamId: string
  challengeId: string
  photoUrl?: string
  points: number
  completedAt: Date
}

export interface LeaderboardEntry {
  teamId: string
  teamName: string
  totalPoints: number
  completedCount: number
}
