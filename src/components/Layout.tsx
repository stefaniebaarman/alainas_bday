import type { CSSProperties, ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface LayoutProps {
  children: ReactNode
  showNav?: boolean
  className?: string
}

export function Layout({ children, showNav = true, className = '' }: LayoutProps) {
  return (
    <div className={`app-shell ${className}`}>
      <div className="sparkle-field" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="sparkle" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <main className="app-main">{children}</main>
      {showNav && <BottomNav />}
    </div>
  )
}
