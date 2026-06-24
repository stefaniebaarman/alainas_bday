import type { Challenge } from '../types'

export const challenges: Challenge[] = [
  {
    id: 'hot-dog',
    title: 'Eat a Hot Dog',
    description: 'Grab a hot dog and snap a photo of your team enjoying it.',
    points: 10,
    requiresPhoto: true,
    icon: '🌭',
  },
  {
    id: 'other-celebration',
    title: 'Crash Another Party',
    description: 'Find another group celebrating something — birthday, bachelorette, etc. Photo with the crew required.',
    points: 12,
    requiresPhoto: true,
    icon: '🎊',
  },
  {
    id: 'bouncer-pic',
    title: 'Bouncer Buddies',
    description: 'Take a picture with a bouncer.',
    points: 10,
    requiresPhoto: true,
    icon: '🚪',
  },
  {
    id: 'cop-selfie',
    title: 'Cop Selfie',
    description: 'Take a selfie with a cop. Be respectful — ask first!',
    points: 15,
    requiresPhoto: true,
    icon: '👮',
  },
  {
    id: 'jello-shot',
    title: 'Jell-O Shot',
    description: 'Take a Jell-O shot and capture the moment on camera.',
    points: 10,
    requiresPhoto: true,
    icon: '🍮',
  },
  {
    id: 'fellow-redhead',
    title: 'Fellow Redhead',
    description: 'Take a pic with another redhead.',
    points: 10,
    requiresPhoto: true,
    icon: '🦊',
  },
  {
    id: 'buy-alaina-drink',
    title: 'Buy Alaina a Drink',
    description: 'Buy Alaina a drink. Photo proof of the gesture counts.',
    points: 12,
    requiresPhoto: true,
    icon: '🍹',
  },
  {
    id: 'tequila-shot',
    title: 'Tequila Shot',
    description: 'Take a tequila shot — cheers to the birthday girl!',
    points: 10,
    requiresPhoto: true,
    icon: '🥃',
  },
  {
    id: 'emergency-vehicle',
    title: 'Emergency Vehicle',
    description: 'Find an ambulance or fire truck and snap a pic.',
    points: 15,
    requiresPhoto: true,
    icon: '🚑',
  },
  {
    id: 'album-cover',
    title: 'Album Cover Recreate',
    description: 'Recreate an album cover. Commit to the bit.',
    points: 12,
    requiresPhoto: true,
    icon: '💿',
  },
  {
    id: 'alainas-type',
    title: "Alaina's Type",
    description: 'Find someone who is "Alaina\'s type" and get a photo. Team decides what counts.',
    points: 12,
    requiresPhoto: true,
    icon: '💘',
  },
  {
    id: 'celebrity-doppelganger',
    title: 'Celebrity Doppelgänger',
    description: 'Find a celebrity doppelgänger in the wild. Photo required.',
    points: 12,
    requiresPhoto: true,
    icon: '⭐',
  },
  {
    id: 'specialty-cocktail',
    title: "Alaina's Specialty Cocktail",
    description: "Order Alaina's specialty cocktail — tequila Red Bull. Photo of the drink required.",
    points: 10,
    requiresPhoto: true,
    icon: '⚡',
  },
]

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}

export const totalPossiblePoints = challenges.reduce((sum, c) => sum + c.points, 0)

export const challengeMap = new Map(challenges.map((c) => [c.id, c]))
