import type { CSSProperties, ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface LayoutProps {
  children: ReactNode
  showNav?: boolean
  className?: string
}

const FLOATERS = ['🎂', '🍹', '🎉', '✨', '🥳', '🔥']

export function Layout({ children, showNav = true, className = '' }: LayoutProps) {
  return (
    <div className={`app-shell ${className}`}>
      <div className="bg-mesh" aria-hidden="true" />
      <div className="sparkle-field" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="sparkle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <div className="floaters" aria-hidden="true">
        {FLOATERS.map((emoji, i) => (
          <span key={emoji} className="floater" style={{ '--i': i } as CSSProperties}>
            {emoji}
          </span>
        ))}
      </div>
      <main className="app-main">{children}</main>
      {showNav && <BottomNav />}
      <div className="confetti-strip" aria-hidden="true" />
    </div>
  )
}
