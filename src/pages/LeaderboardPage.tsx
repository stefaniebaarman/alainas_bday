import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { subscribeToLeaderboard } from '../lib/leaderboard'
import { getStoredTeamId } from '../lib/storage'
import { challenges } from '../data/challenges'
import type { LeaderboardEntry } from '../types'

const MEDALS = ['🥇', '🥈', '🥉']

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const myTeamId = getStoredTeamId()

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard(
      (data) => {
        setEntries(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return (
    <Layout>
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Live scores from every team at The Bullpen tonight.</p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading scores…</p>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__emoji" aria-hidden="true">
            🎉
          </p>
          <p>No teams yet — be the first to join the hunt!</p>
        </div>
      ) : (
        <ol className="leaderboard">
          {entries.map((entry, index) => {
            const isMe = entry.teamId === myTeamId
            const medal = index < 3 ? MEDALS[index] : null

            return (
              <li
                key={entry.teamId}
                className={`leaderboard__row ${isMe ? 'leaderboard__row--me' : ''}`}
              >
                <span className="leaderboard__rank" aria-label={`Rank ${index + 1}`}>
                  {medal ?? index + 1}
                </span>
                <div className="leaderboard__info">
                  <span className="leaderboard__name">
                    {entry.teamName}
                    {isMe && <span className="leaderboard__you"> (you)</span>}
                  </span>
                  <span className="leaderboard__meta">
                    {entry.completedCount}/{challenges.length} challenges
                  </span>
                </div>
                <span className="leaderboard__points">{entry.totalPoints} pts</span>
              </li>
            )
          })}
        </ol>
      )}
    </Layout>
  )
}
