import { useRef, useState } from 'react'
import type { Challenge, Completion } from '../types'
import { deletePhoto, uploadPhoto } from '../lib/photoStorage'
import { completeChallenge, uncompleteChallenge } from '../lib/firestore'

interface ChallengeCardProps {
  challenge: Challenge
  completion?: Completion
  teamId: string
}

export function ChallengeCard({ challenge, completion, teamId }: ChallengeCardProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const isComplete = Boolean(completion)

  async function handleComplete(file?: File) {
    if (isComplete) return

    if (challenge.requiresPhoto && !file) {
      fileRef.current?.click()
      return
    }

    setUploading(true)
    setError(null)

    try {
      let photo: { url: string; storagePath: string } | undefined
      if (challenge.requiresPhoto && file) {
        photo = await uploadPhoto(teamId, challenge.id, file)
      }
      await completeChallenge(teamId, challenge.id, challenge.points, photo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete challenge')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (!completion) return

    setUploading(true)
    setError(null)

    try {
      if (completion.photoStoragePath) {
        await deletePhoto(completion.photoStoragePath)
      }
      await uncompleteChallenge(teamId, challenge.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove photo')
    } finally {
      setUploading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleComplete(file)
    e.target.value = ''
  }

  return (
    <article className={`challenge-card ${isComplete ? 'challenge-card--complete' : ''}`}>
      <div className="challenge-card__header">
        <div>
          <h2 className="challenge-card__title">{challenge.title}</h2>
          <p className="challenge-card__points">{challenge.points} pts</p>
        </div>
        {isComplete && (
          <span className="challenge-card__badge" aria-label="Completed">
            ✓ Done
          </span>
        )}
      </div>

      <p className="challenge-card__desc">{challenge.description}</p>

      {completion?.photoUrl && (
        <div className="challenge-card__photo-wrap">
          <a
            href={completion.photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="challenge-card__photo-link"
          >
            <img
              src={completion.photoUrl}
              alt={`Proof for ${challenge.title}`}
              className="challenge-card__photo"
              loading="lazy"
            />
          </a>
          <button
            type="button"
            className="btn btn--ghost challenge-card__remove-btn"
            onClick={() => void handleRemove()}
            disabled={uploading}
          >
            {uploading ? 'Removing…' : 'Remove photo'}
          </button>
        </div>
      )}

      {error && (
        <p className="challenge-card__error" role="alert">
          {error}
        </p>
      )}

      {!isComplete && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple={false}
            className="sr-only"
            onChange={onFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            type="button"
            className="btn btn--secondary btn--lg challenge-card__btn"
            onClick={() => void handleComplete()}
            disabled={uploading}
          >
            {uploading
              ? 'Uploading…'
              : challenge.requiresPhoto
                ? '📸 Snap & Complete'
                : 'Mark Complete'}
          </button>
        </>
      )}

      {isComplete && !completion?.photoUrl && (
        <button
          type="button"
          className="btn btn--ghost challenge-card__btn"
          onClick={() => void handleRemove()}
          disabled={uploading}
        >
          {uploading ? 'Undoing…' : 'Undo'}
        </button>
      )}
    </article>
  )
}
