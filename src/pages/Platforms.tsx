import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PlatformCard } from '../components/PlatformCard';
import { getConnectors } from '../services/api';
import {
  FALLBACK_CONNECTORS,
  type ConnectorInfo,
} from '../types/connectors';

// Category filter options (labels are pretty-cased versions of the
// backend's category values).
const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',          label: 'All' },
  { value: 'social',       label: 'Social' },
  { value: 'professional', label: 'Professional' },
  { value: 'visual',       label: 'Visual' },
  { value: 'video',        label: 'Video' },
  { value: 'publishing',   label: 'Publishing' },
  { value: 'messaging',    label: 'Messaging' },
];

export function Platforms() {
  const [connectors, setConnectors] = useState<ConnectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

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

  // ─── Filtering ───
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return connectors.filter((c) => {
      // Category filter
      if (category !== 'all' && c.category !== category) return false;

      // Search filter — match against id, name, or description
      if (q) {
        const haystack = `${c.id} ${c.name} ${c.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [connectors, category, search]);

  const totalCount = connectors.length;
  const visibleCount = filtered.length;
  const isFiltered = category !== 'all' || search.trim().length > 0;

  function clearFilters() {
    setSearch('');
    setCategory('all');
  }

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

          {/* Filters */}
          {!isLoading && connectors.length > 0 && (
            <div className="platforms-filters">
              <input
                type="search"
                className="platforms-search"
                placeholder="Search platforms…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search platforms"
              />

              <div className="platforms-category-chips">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`platforms-chip ${category === opt.value ? 'active' : ''}`}
                    onClick={() => setCategory(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {isFiltered && (
                <div className="platforms-filter-summary">
                  Showing {visibleCount} of {totalCount} platforms
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="platforms-loading">
              <div className="loading-spinner"></div>
              <p>Loading platforms…</p>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="platforms-grid">
              {filtered.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} />
              ))}
            </div>
          )}

          {!isLoading && connectors.length > 0 && filtered.length === 0 && (
            <div className="platforms-no-results">
              <div className="platforms-no-results-icon">🔍</div>
              <h3>No platforms match your filter</h3>
              <p>Try a different search or category.</p>
              <button
                type="button"
                className="platforms-clear-btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>
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
