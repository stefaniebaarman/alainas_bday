import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <Layout showNav={false} className="landing">
      <div className="landing__content">
        <div className="landing__hero-icon" aria-hidden="true">
          🎂
        </div>
        <p className="eyebrow">The Bullpen · Washington, DC</p>
        <h1 className="landing__title">
          Alaina&apos;s
          <span className="landing__title-accent"> Bullpen Birthday Hunt</span>
        </h1>
        <p className="landing__tagline">
          Teams. Chaos. Points. Glory.
          <br />
          Snap wild photos, stalk the proof wall, and fight for #1 tonight.
        </p>

        <div className="landing__badges">
          <span className="pill">🎯 13 challenges</span>
          <span className="pill">📸 Proof wall</span>
          <span className="pill">🏆 Live scores</span>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--xl landing__cta"
          onClick={() => navigate('/team')}
        >
          Let&apos;s Go 🚀
        </button>

        <p className="landing__hint">No account needed — just pick a team name and hunt.</p>
      </div>
    </Layout>
  )
}
