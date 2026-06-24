import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Completion, Team } from '../types'

const TEAMS = 'teams'
const COMPLETIONS = 'completions'

function normalizeTeamName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

function toDate(value: Timestamp | Date | undefined): Date {
  if (!value) return new Date()
  if (value instanceof Date) return value
  return value.toDate()
}

export async function findOrCreateTeam(displayName: string): Promise<Team> {
  const trimmed = displayName.trim()
  if (!trimmed) {
    throw new Error('Team name cannot be empty.')
  }

  const normalizedName = normalizeTeamName(trimmed)
  const teamsRef = collection(db, TEAMS)
  const existing = await getDocs(
    query(teamsRef, where('normalizedName', '==', normalizedName)),
  )

  if (!existing.empty) {
    const snap = existing.docs[0]
    const data = snap.data()
    return {
      id: snap.id,
      name: data.name as string,
      normalizedName: data.normalizedName as string,
      createdAt: toDate(data.createdAt as Timestamp | undefined),
    }
  }

  const newRef = doc(collection(db, TEAMS))
  await setDoc(newRef, {
    name: trimmed,
    normalizedName,
    createdAt: serverTimestamp(),
  })

  return {
    id: newRef.id,
    name: trimmed,
    normalizedName,
    createdAt: new Date(),
  }
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const snap = await getDoc(doc(db, TEAMS, teamId))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    name: data.name as string,
    normalizedName: data.normalizedName as string,
    createdAt: toDate(data.createdAt as Timestamp | undefined),
  }
}

function completionDocId(teamId: string, challengeId: string): string {
  return `${teamId}_${challengeId}`
}

function mapCompletionData(
  id: string,
  data: Record<string, unknown>,
): Completion {
  return {
    id,
    teamId: data.teamId as string,
    challengeId: data.challengeId as string,
    photoUrl: data.photoUrl as string | undefined,
    photoStoragePath: data.photoStoragePath as string | undefined,
    points: data.points as number,
    completedAt: toDate(data.completedAt as Timestamp | undefined),
  }
}

export interface ChallengePhoto {
  url: string
  storagePath: string
}

export async function completeChallenge(
  teamId: string,
  challengeId: string,
  points: number,
  photo?: ChallengePhoto,
): Promise<Completion> {
  const id = completionDocId(teamId, challengeId)
  const ref = doc(db, COMPLETIONS, id)
  const existing = await getDoc(ref)

  if (existing.exists()) {
    return mapCompletionData(id, existing.data())
  }

  await setDoc(ref, {
    teamId,
    challengeId,
    points,
    ...(photo
      ? {
          photoUrl: photo.url,
          photoStoragePath: photo.storagePath,
        }
      : {}),
    completedAt: serverTimestamp(),
  })

  return {
    id,
    teamId,
    challengeId,
    photoUrl: photo?.url,
    photoStoragePath: photo?.storagePath,
    points,
    completedAt: new Date(),
  }
}

export async function uncompleteChallenge(
  teamId: string,
  challengeId: string,
): Promise<void> {
  const id = completionDocId(teamId, challengeId)
  await deleteDoc(doc(db, COMPLETIONS, id))
}

export function subscribeToTeamCompletions(
  teamId: string,
  onUpdate: (completions: Completion[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const q = query(collection(db, COMPLETIONS), where('teamId', '==', teamId))

  return onSnapshot(
    q,
    (snapshot) => {
      const completions = snapshot.docs.map((snap) =>
        mapCompletionData(snap.id, snap.data()),
      )
      onUpdate(completions)
    },
    (err) => onError?.(err),
  )
}
