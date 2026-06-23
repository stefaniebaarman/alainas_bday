import type { Challenge } from '../types'

export const challenges: Challenge[] = [
  {
    id: 'birthday-cheer',
    title: 'Birthday Cheer',
    description: 'Get the whole bar to shout "Happy Birthday Alaina!" — video or group photo counts.',
    points: 15,
    requiresPhoto: true,
  },
  {
    id: 'bullpen-selfie',
    title: 'Bullpen Selfie',
    description: 'Snap a team selfie with The Bullpen sign or field visible in the background.',
    points: 10,
    requiresPhoto: true,
  },
  {
    id: 'birthday-shot',
    title: 'Birthday Shot',
    description: 'Everyone on the team takes a birthday shot together. Cheers to Alaina!',
    points: 12,
    requiresPhoto: true,
  },
  {
    id: 'stranger-high-five',
    title: 'Stranger High-Five',
    description: 'High-five a stranger and get a photo of the moment. Bonus if they wish Alaina happy birthday!',
    points: 8,
    requiresPhoto: true,
  },
  {
    id: 'menu-mission',
    title: 'Menu Mission',
    description: 'Order something none of your teammates have tried before. Photo of the dish required.',
    points: 10,
    requiresPhoto: true,
  },
  {
    id: 'dance-floor',
    title: 'Dance Floor Moment',
    description: 'Capture your team doing a silly birthday dance — anywhere in the bar counts.',
    points: 12,
    requiresPhoto: true,
  },
  {
    id: 'toast-to-alaina',
    title: 'Toast to Alaina',
    description: 'Raise your glasses and toast the birthday girl. Photo proof of the toast.',
    points: 10,
    requiresPhoto: true,
  },
  {
    id: 'team-huddle',
    title: 'Team Huddle',
    description: 'Strike your best sports-team huddle pose. Channel those Bullpen vibes!',
    points: 8,
    requiresPhoto: true,
  },
  {
    id: 'neon-glow',
    title: 'Neon Glow',
    description: 'Find the best neon sign or lit-up spot in the bar and snap a pic with your team.',
    points: 8,
    requiresPhoto: true,
  },
  {
    id: 'scoreboard-check',
    title: 'Scoreboard Check',
    description: 'Photo your team next to any TV showing a game. Extra chaos if you pretend to call the play.',
    points: 7,
    requiresPhoto: true,
  },
  {
    id: 'birthday-card',
    title: 'Birthday Card',
    description: 'Write a short birthday message for Alaina on a napkin or coaster and photograph it.',
    points: 10,
    requiresPhoto: true,
  },
  {
    id: 'wildcard',
    title: 'Wildcard Challenge',
    description: 'Do something uniquely chaotic that screams "birthday at The Bullpen." Photo required — judges (your team) decide if it counts!',
    points: 15,
    requiresPhoto: true,
  },
]

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}

export const totalPossiblePoints = challenges.reduce((sum, c) => sum + c.points, 0)
