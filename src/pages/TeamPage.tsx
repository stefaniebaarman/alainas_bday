import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { deleteTeam, findOrCreateTeam, renameTeam } from '../lib/firestore'
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
  const [renameValue, setRenameValue] = useState(storedTeamName ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !storedTeamId) return

    setLoading(true)
    setError(null)

    try {
      const team = await renameTeam(storedTeamId, renameValue)
      setStoredTeam(team.id, team.name)
      setShowRename(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not rename team')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!user || !storedTeamId) return

    setLoading(true)
    setError(null)

    try {
      await deleteTeam(storedTeamId)
      clearStoredTeam()
      setConfirmDelete(false)
      setSwitching(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete team')
    } finally {
      setLoading(false)
    }
  }

  function handleSwitchTeam() {
    clearStoredTeam()
    setSwitching(true)
    setShowRename(false)
    setConfirmDelete(false)
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
          <p className="eyebrow">Squad check</p>
          <h1>Your Team 👯</h1>
          <p>You&apos;re hunting as:</p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <div className="team-current">
          <span className="team-current__name">{storedTeamName}</span>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => navigate('/challenges')}
        >
          Back to Hunt
        </button>

        <div className="team-settings">
          {!showRename ? (
            <button
              type="button"
              className="btn btn--secondary btn--lg"
              onClick={() => {
                setRenameValue(storedTeamName)
                setShowRename(true)
                setConfirmDelete(false)
                setError(null)
              }}
              disabled={loading}
            >
              ✏️ Rename Team
            </button>
          ) : (
            <form className="team-rename-form" onSubmit={handleRename}>
              <label htmlFor="rename-team" className="sr-only">
                New team name
              </label>
              <input
                id="rename-team"
                type="text"
                className="input input--lg"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                maxLength={40}
                autoComplete="off"
                autoFocus
                required
              />
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={loading || !renameValue.trim()}
              >
                {loading ? 'Saving…' : 'Save Name'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setShowRename(false)
                  setRenameValue(storedTeamName)
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              className="btn btn--danger btn--lg"
              onClick={() => {
                setConfirmDelete(true)
                setShowRename(false)
                setError(null)
              }}
              disabled={loading}
            >
              🗑️ Delete Team
            </button>
          ) : (
            <div className="team-delete-confirm">
              <p>
                Delete <strong>{storedTeamName}</strong>? This removes all photos, scores, and
                completions. This cannot be undone.
              </p>
              <button
                type="button"
                className="btn btn--danger btn--lg"
                onClick={() => void handleDelete()}
                disabled={loading}
              >
                {loading ? 'Deleting…' : 'Yes, Delete Everything'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setConfirmDelete(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleSwitchTeam}
            disabled={loading}
          >
            Switch Team
          </button>
        </div>
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
          placeholder=""
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
