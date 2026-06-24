import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { challengeMap } from '../data/challenges'
import { db } from './firebase'
import type { GalleryPhoto } from '../types'

function toDate(value: unknown): Date {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate()
  }
  if (value instanceof Date) return value
  return new Date()
}

export function subscribeToGallery(
  onUpdate: (photos: GalleryPhoto[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let teams = new Map<string, string>()
  let completions: Array<{
    id: string
    teamId: string
    challengeId: string
    photoUrl?: string
    points: number
    completedAt: Date
  }> = []

  function publish() {
    const photos: GalleryPhoto[] = completions
      .filter((c) => Boolean(c.photoUrl))
      .map((c) => {
        const challenge = challengeMap.get(c.challengeId)
        return {
          id: c.id,
          teamId: c.teamId,
          teamName: teams.get(c.teamId) ?? 'Mystery Team',
          challengeId: c.challengeId,
          challengeTitle: challenge?.title ?? 'Challenge',
          challengeIcon: challenge?.icon ?? '📸',
          photoUrl: c.photoUrl!,
          points: c.points,
          completedAt: c.completedAt,
        }
      })
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())

    onUpdate(photos)
  }

  const unsubTeams = onSnapshot(
    collection(db, 'teams'),
    (snapshot) => {
      teams = new Map(
        snapshot.docs.map((snap) => [snap.id, snap.data().name as string]),
      )
      publish()
    },
    (err) => onError?.(err),
  )

  const unsubCompletions = onSnapshot(
    collection(db, 'completions'),
    (snapshot) => {
      completions = snapshot.docs.map((snap) => {
        const data = snap.data()
        return {
          id: snap.id,
          teamId: data.teamId as string,
          challengeId: data.challengeId as string,
          photoUrl: data.photoUrl as string | undefined,
          points: data.points as number,
          completedAt: toDate(data.completedAt),
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
