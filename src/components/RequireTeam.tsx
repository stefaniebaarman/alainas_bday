import { Navigate, useLocation } from 'react-router-dom'
import { getStoredTeamId } from '../lib/storage'

export function RequireTeam({ children }: { children: React.ReactNode }) {
  const teamId = getStoredTeamId()
  const location = useLocation()

  if (!teamId) {
    return <Navigate to="/team" state={{ from: location }} replace />
  }

  return <>{children}</>
}
