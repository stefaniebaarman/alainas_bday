import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <Layout showNav={false} className="landing">
      <div className="landing__content">
        <p className="eyebrow">The Bullpen · Washington, DC</p>
        <h1 className="landing__title">
          Alaina&apos;s
          <span className="landing__title-accent"> Bullpen Birthday Hunt</span>
        </h1>
        <p className="landing__tagline">
          Teams. Chaos. Points. Glory.
          <br />
          Complete bar challenges, upload proof, and climb the leaderboard tonight.
        </p>

        <div className="landing__badges">
          <span className="pill">🍹 Bar vibes</span>
          <span className="pill">📸 Photo proof</span>
          <span className="pill">🏆 Live scores</span>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--xl landing__cta"
          onClick={() => navigate('/team')}
        >
          Join the Hunt
        </button>

        <p className="landing__hint">No account needed — just pick a team name and go.</p>
      </div>

      <div className="confetti-strip" aria-hidden="true" />
    </Layout>
  )
}
