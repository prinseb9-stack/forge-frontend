import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PlatformCard } from '../components/PlatformCard';
import { PLATFORMS } from '../data/platforms';

export function Platforms() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="platforms-page">
          <div className="platforms-hero">
            <h1 className="platforms-title">🌍 Connected Platforms</h1>
            <p className="platforms-subtitle">
              Explore the platforms FORGE plans to support. Each platform
              shows exactly what is available today and what's planned for
              the future.
            </p>
          </div>

          <div className="platforms-grid">
            {PLATFORMS.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>

          <div className="platforms-note">
            <h3>About capability states</h3>
            <ul>
              <li><strong>Available</strong> — FORGE can do this today.</li>
              <li><strong>Planned</strong> — on the roadmap, but not built yet.</li>
              <li><strong>Coming soon</strong> — far out; no committed timeline.</li>
            </ul>
            <p>
              We only mark something as <em>Available</em> when the
              integration is actually working. No fake buttons.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
