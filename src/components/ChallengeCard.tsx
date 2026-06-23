import { useRef, useState } from 'react'
import type { Challenge, Completion } from '../types'
import { uploadPhoto } from '../lib/cloudinary'
import { completeChallenge } from '../lib/firestore'

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
      let photoUrl: string | undefined
      if (challenge.requiresPhoto && file) {
        photoUrl = await uploadPhoto(file)
      }
      await completeChallenge(teamId, challenge.id, challenge.points, photoUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete challenge')
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
    </article>
  )
}
