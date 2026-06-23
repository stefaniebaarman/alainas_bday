import {
  collection,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { LeaderboardEntry } from '../types'

export function subscribeToLeaderboard(
  onUpdate: (entries: LeaderboardEntry[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let teams: { id: string; name: string }[] = []
  let completionDocs: Array<{ teamId: string; points: number }> = []

  function publish() {
    const pointsByTeam = new Map<string, { points: number; count: number }>()

    for (const team of teams) {
      pointsByTeam.set(team.id, { points: 0, count: 0 })
    }

    for (const doc of completionDocs) {
      const current = pointsByTeam.get(doc.teamId) ?? { points: 0, count: 0 }
      current.points += doc.points
      current.count += 1
      pointsByTeam.set(doc.teamId, current)
    }

    const entries: LeaderboardEntry[] = teams
      .map((team) => {
        const stats = pointsByTeam.get(team.id) ?? { points: 0, count: 0 }
        return {
          teamId: team.id,
          teamName: team.name,
          totalPoints: stats.points,
          completedCount: stats.count,
        }
      })
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        return b.completedCount - a.completedCount
      })

    onUpdate(entries)
  }

  const unsubTeams = onSnapshot(
    collection(db, 'teams'),
    (snapshot) => {
      teams = snapshot.docs.map((snap) => ({
        id: snap.id,
        name: snap.data().name as string,
      }))
      publish()
    },
    (err) => onError?.(err),
  )

  const unsubCompletions = onSnapshot(
    collection(db, 'completions'),
    (snapshot) => {
      completionDocs = snapshot.docs.map((snap) => {
        const data = snap.data()
        return {
          teamId: data.teamId as string,
          points: data.points as number,
        }
      })
      publish()
    },
    (err) => onError?.(err),
  )

  return () => {
    unsubTeams()
    unsubCompletions()
  }
}
