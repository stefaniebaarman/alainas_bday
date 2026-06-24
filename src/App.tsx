import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { TeamPage } from './pages/TeamPage'
import { ChallengesPage } from './pages/ChallengesPage'
import { GalleryPage } from './pages/GalleryPage'
import { LeaderboardPage } from './pages/LeaderboardPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
