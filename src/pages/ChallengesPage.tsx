import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ChallengeCard } from '../components/ChallengeCard'
import { Layout } from '../components/Layout'
import { challenges, totalPossiblePoints } from '../data/challenges'
import { subscribeToTeamCompletions } from '../lib/firestore'
import { getStoredTeamId, getStoredTeamName } from '../lib/storage'
import type { Completion } from '../types'

export function ChallengesPage() {
  const teamId = getStoredTeamId()
  const teamName = getStoredTeamName()
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!teamId) return

    const unsubscribe = subscribeToTeamCompletions(
      teamId,
      (data) => {
        setCompletions(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [teamId])

  if (!teamId) {
    return <Navigate to="/team" replace />
  }

  const completionMap = new Map(completions.map((c) => [c.challengeId, c]))
  const teamPoints = completions.reduce((sum, c) => sum + c.points, 0)

  return (
    <Layout>
      <div className="page-header">
        <p className="eyebrow">{teamName}</p>
        <h1>Your Challenges</h1>
        <div className="score-pill">
          <span className="score-pill__value">{teamPoints}</span>
          <span className="score-pill__label">
            / {totalPossiblePoints} pts · {completions.length}/{challenges.length} done
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading challenges…</p>
      ) : (
        <div className="challenge-list">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              completion={completionMap.get(challenge.id)}
              teamId={teamId}
            />
          ))}
        </div>
      )}
    </Layout>
  )
}
