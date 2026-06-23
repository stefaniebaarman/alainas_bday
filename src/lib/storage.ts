const TEAM_ID_KEY = 'alaina_hunt_team_id'
const TEAM_NAME_KEY = 'alaina_hunt_team_name'

export function getStoredTeamId(): string | null {
  return localStorage.getItem(TEAM_ID_KEY)
}

export function getStoredTeamName(): string | null {
  return localStorage.getItem(TEAM_NAME_KEY)
}

export function setStoredTeam(teamId: string, teamName: string): void {
  localStorage.setItem(TEAM_ID_KEY, teamId)
  localStorage.setItem(TEAM_NAME_KEY, teamName)
}

export function clearStoredTeam(): void {
  localStorage.removeItem(TEAM_ID_KEY)
  localStorage.removeItem(TEAM_NAME_KEY)
}
