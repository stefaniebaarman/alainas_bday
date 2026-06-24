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

  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <Layout>
      <div className="page-header">
        <p className="eyebrow">Tonight&apos;s standings</p>
        <h1>Leaderboard 🏆</h1>
        <p>Who&apos;s crushing the hunt at The Bullpen?</p>
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
        <>
          {podium.length > 0 && (
            <div className="podium">
              {[1, 0, 2].map((rankIndex) => {
                const entry = podium[rankIndex]
                if (!entry) return <div key={rankIndex} className="podium__slot podium__slot--empty" />
                const place = rankIndex + 1
                const isMe = entry.teamId === myTeamId
                return (
                  <div
                    key={entry.teamId}
                    className={`podium__slot podium__slot--${place} ${isMe ? 'podium__slot--me' : ''}`}
                  >
                    <span className="podium__medal">{MEDALS[place - 1]}</span>
                    <span className="podium__name">{entry.teamName}</span>
                    <span className="podium__pts">{entry.totalPoints} pts</span>
                    <span className="podium__bar" />
                  </div>
                )
              })}
            </div>
          )}

          <ol className="leaderboard">
            {rest.map((entry, index) => {
              const rank = index + 4
              const isMe = entry.teamId === myTeamId

              return (
                <li
                  key={entry.teamId}
                  className={`leaderboard__row ${isMe ? 'leaderboard__row--me' : ''}`}
                >
                  <span className="leaderboard__rank" aria-label={`Rank ${rank}`}>
                    {rank}
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
        </>
      )}
    </Layout>
  )
}
