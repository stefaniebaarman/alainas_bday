import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { findOrCreateTeam } from '../lib/firestore'
import {
  clearStoredTeam,
  getStoredTeamId,
  getStoredTeamName,
  setStoredTeam,
} from '../lib/storage'
import { useAuth } from '../hooks/useAuth'

export function TeamPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading, error: authError } = useAuth()
  const storedTeamId = getStoredTeamId()
  const storedTeamName = getStoredTeamName()
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const team = await findOrCreateTeam(teamName)
      setStoredTeam(team.id, team.name)
      navigate('/challenges')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleSwitchTeam() {
    clearStoredTeam()
    setSwitching(true)
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="page-center">
          <p className="loading-text">Getting ready…</p>
        </div>
      </Layout>
    )
  }

  if (storedTeamId && storedTeamName && !switching) {
    return (
      <Layout>
        <div className="page-header">
          <h1>Your Team</h1>
          <p>You&apos;re hunting with:</p>
        </div>

        <div className="team-current">
          <span className="team-current__name">{storedTeamName}</span>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => navigate('/challenges')}
        >
          Back to Challenges
        </button>

        <button
          type="button"
          className="btn btn--ghost btn--lg"
          onClick={handleSwitchTeam}
        >
          Switch Team
        </button>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Pick Your Team</h1>
        <p>Enter a team name. Friends can join the same name later — no duplicates!</p>
      </div>

      {(authError || error) && (
        <div className="alert alert--error" role="alert">
          {authError || error}
        </div>
      )}

      <form className="team-form" onSubmit={handleSubmit}>
        <label htmlFor="team-name" className="sr-only">
          Team name
        </label>
        <input
          id="team-name"
          type="text"
          className="input input--lg"
          placeholder="e.g. Birthday Bashers"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          maxLength={40}
          autoComplete="off"
          autoFocus
          required
        />
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={loading || !teamName.trim() || !user}
        >
          {loading ? 'Joining…' : 'Start Hunting'}
        </button>
      </form>

      <p className="form-hint">
        Already have a team? Type the exact same name to join them.
      </p>
    </Layout>
  )
}
