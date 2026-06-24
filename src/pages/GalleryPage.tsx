import { useEffect, useMemo, useState } from 'react'
import { GalleryCard } from '../components/GalleryCard'
import { Layout } from '../components/Layout'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { subscribeToGallery } from '../lib/gallery'
import { getStoredTeamId } from '../lib/storage'
import type { GalleryPhoto } from '../types'

export function GalleryPage() {
  const myTeamId = getStoredTeamId()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teamFilter, setTeamFilter] = useState<string>('all')
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToGallery(
      (data) => {
        setPhotos(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const teams = useMemo(() => {
    const names = new Map<string, string>()
    for (const photo of photos) {
      names.set(photo.teamId, photo.teamName)
    }
    return [...names.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [photos])

  const filtered = useMemo(() => {
    if (teamFilter === 'all') return photos
    return photos.filter((p) => p.teamId === teamFilter)
  }, [photos, teamFilter])

  return (
    <Layout>
      <div className="page-header">
        <p className="eyebrow">Live feed</p>
        <h1>The Proof Wall 📸</h1>
        <p>Every team&apos;s wildest moments from tonight — scroll, spy, celebrate.</p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {!loading && photos.length > 0 && (
        <div className="filter-chips" role="tablist" aria-label="Filter by team">
          <button
            type="button"
            role="tab"
            aria-selected={teamFilter === 'all'}
            className={`filter-chip ${teamFilter === 'all' ? 'filter-chip--active' : ''}`}
            onClick={() => setTeamFilter('all')}
          >
            All teams
          </button>
          {teams.map(([id, name]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={teamFilter === id}
              className={`filter-chip ${teamFilter === id ? 'filter-chip--active' : ''}`}
              onClick={() => setTeamFilter(id)}
            >
              {name}
              {id === myTeamId && ' ★'}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading the wall…</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__emoji" aria-hidden="true">
            📷
          </p>
          <p>No photos yet — be the first to post proof!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              isMine={photo.teamId === myTeamId}
              tilt={(index % 5) - 2}
              onOpen={() => setSelected(photo)}
            />
          ))}
        </div>
      )}

      {selected && <PhotoLightbox photo={selected} onClose={() => setSelected(null)} />}
    </Layout>
  )
}
