import type { CSSProperties } from 'react'
import type { GalleryPhoto } from '../types'

interface GalleryCardProps {
  photo: GalleryPhoto
  isMine: boolean
  tilt: number
  onOpen: () => void
}

export function GalleryCard({ photo, isMine, tilt, onOpen }: GalleryCardProps) {
  return (
    <button
      type="button"
      className={`gallery-card ${isMine ? 'gallery-card--mine' : ''}`}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
      onClick={onOpen}
    >
      <div className="gallery-card__frame">
        <img
          src={photo.photoUrl}
          alt={`${photo.teamName} — ${photo.challengeTitle}`}
          className="gallery-card__img"
          loading="lazy"
        />
      </div>
      <div className="gallery-card__caption">
        <span className="gallery-card__icon" aria-hidden="true">
          {photo.challengeIcon}
        </span>
        <div className="gallery-card__text">
          <span className="gallery-card__team">
            {photo.teamName}
            {isMine && <span className="gallery-card__you"> · you</span>}
          </span>
          <span className="gallery-card__challenge">{photo.challengeTitle}</span>
        </div>
        <span className="gallery-card__pts">+{photo.points}</span>
      </div>
    </button>
  )
}
