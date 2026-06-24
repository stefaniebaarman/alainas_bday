export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  requiresPhoto: boolean
  icon: string
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
  photoStoragePath?: string
  points: number
  completedAt: Date
}

export interface LeaderboardEntry {
  teamId: string
  teamName: string
  totalPoints: number
  completedCount: number
}

export interface GalleryPhoto {
  id: string
  teamId: string
  teamName: string
  challengeId: string
  challengeTitle: string
  challengeIcon: string
  photoUrl: string
  points: number
  completedAt: Date
}
