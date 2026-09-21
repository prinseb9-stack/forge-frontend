import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PlatformCard } from '../components/PlatformCard';
import { getConnectors } from '../services/api';
import {
  FALLBACK_CONNECTORS,
  type ConnectorInfo,
} from '../types/connectors';

export function Platforms() {
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const response = await getConnectors();

      if (cancelled) return;

      if (response.success && response.connectors.length > 0) {
        setConnectors(response.connectors);
        setUsedFallback(false);
      } else {
        setConnectors(FALLBACK_CONNECTORS);
        setUsedFallback(true);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

          {usedFallback && (
            <div className="platforms-fallback-notice">
              ⚠️ Couldn't reach FORGE's server. Showing a limited catalog.
            </div>
          )}

          {isLoading && (
            <div className="platforms-loading">
              <div className="loading-spinner"></div>
              <p>Loading platforms…</p>
            </div>
          )}

          {!isLoading && connectors.length > 0 && (
            <div className="platforms-grid">
              {connectors.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          )}

          <div className="platforms-note">
            <h3>About capability states</h3>
            <ul>
              <li><strong>Available</strong> — FORGE can do this today.</li>
              <li><strong>Planned</strong> — on the roadmap, but not built yet.</li>
              <li><strong>Coming soon</strong> — far out; no committed timeline.</li>
              <li><strong>Unavailable</strong> — blocked by platform limits.</li>
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
