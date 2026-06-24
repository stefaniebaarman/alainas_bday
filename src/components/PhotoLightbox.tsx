import type { GalleryPhoto } from '../types'

interface PhotoLightboxProps {
  photo: GalleryPhoto
  onClose: () => void
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo by ${photo.teamName}`}
      onClick={onClose}
    >
      <div className="lightbox__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img
          src={photo.photoUrl}
          alt={`${photo.teamName} — ${photo.challengeTitle}`}
          className="lightbox__img"
        />
        <div className="lightbox__meta">
          <span className="lightbox__icon" aria-hidden="true">
            {photo.challengeIcon}
          </span>
          <div>
            <p className="lightbox__team">{photo.teamName}</p>
            <p className="lightbox__challenge">{photo.challengeTitle}</p>
            <p className="lightbox__time">
              +{photo.points} pts · {timeAgo(photo.completedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
