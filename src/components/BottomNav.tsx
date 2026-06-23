import { Link, useLocation } from 'react-router-dom'
import { getStoredTeamName } from '../lib/storage'

export function BottomNav() {
  const location = useLocation()
  const teamName = getStoredTeamName()

  const links = [
    { to: '/challenges', label: 'Hunt', icon: '🎯' },
    { to: '/leaderboard', label: 'Scores', icon: '🏆' },
    { to: '/team', label: teamName ? 'Team' : 'Join', icon: '👯' },
  ]

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {links.map(({ to, label, icon }) => {
        const active = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={`bottom-nav__link ${active ? 'bottom-nav__link--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
