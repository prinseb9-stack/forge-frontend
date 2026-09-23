import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <div className="landing">
      {/* ─── Landing Header ─── */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-mark">⚡</span>
            <span className="landing-logo-text">FORGE</span>
          </Link>
          <div className="landing-header-actions">
            <Link to="/login" className="landing-signin">
              Sign In
            </Link>
            <Link to="/login" className="landing-cta-small">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {/* ─── Hero ─── */}
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <h1 className="landing-hero-title">
              Turn one piece of content into posts for{' '}
              <span className="landing-highlight">every platform</span>
            </h1>
            <p className="landing-hero-subtitle">
              Paste your content once, choose where you want to publish, and
              let FORGE adapt it into platform-ready content.
            </p>
            <div className="landing-hero-actions">
              <Link to="/login" className="landing-cta-primary">
                Get Started Free
              </Link>
            </div>
            <p className="landing-hero-note">
              Free plan includes 10 generations per month. No credit card
              required.
            </p>

            <div className="landing-hero-preview">
              <div className="landing-preview-card">
                <div className="landing-preview-platform">🐦 X</div>
                <div className="landing-preview-line" />
                <div className="landing-preview-line landing-preview-line-short" />
              </div>
              <div className="landing-preview-card">
                <div className="landing-preview-platform">💼 LinkedIn</div>
                <div className="landing-preview-line" />
                <div className="landing-preview-line landing-preview-line-short" />
              </div>
              <div className="landing-preview-card">
                <div className="landing-preview-platform">📸 Instagram</div>
                <div className="landing-preview-line" />
                <div className="landing-preview-line landing-preview-line-short" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="landing-section">
          <div className="landing-section-inner">
            <h2 className="landing-section-title">How it works</h2>
            <p className="landing-section-subtitle">
              Three steps from source content to ready-to-post drafts.
            </p>

            <div className="landing-steps">
              <div className="landing-step">
                <div className="landing-step-number">01</div>
                <h3 className="landing-step-title">Paste</h3>
                <p className="landing-step-text">
                  Add your article, transcript, idea, or other source content.
                </p>
              </div>
              <div className="landing-step">
                <div className="landing-step-number">02</div>
                <h3 className="landing-step-title">Select</h3>
                <p className="landing-step-text">
                  Choose the platforms you want to create content for.
                </p>
              </div>
              <div className="landing-step">
                <div className="landing-step-number">03</div>
                <h3 className="landing-step-title">Generate</h3>
                <p className="landing-step-text">
                  FORGE creates platform-specific versions ready to copy,
                  share, or schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="landing-section landing-section-alt">
          <div className="landing-section-inner">
            <h2 className="landing-section-title">What FORGE does</h2>
            <p className="landing-section-subtitle">
              Everything below ships today. Some features are Pro or Higher
              Pro only.
            </p>

            <div className="landing-features">
              <div className="landing-feature">
                <div className="landing-feature-icon">📝</div>
                <h3 className="landing-feature-title">Multi-platform content</h3>
                <p className="landing-feature-text">
                  Generate posts for X, Instagram, Facebook, LinkedIn, Blog,
                  and Newsletter in one request.
                </p>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">🤖</div>
                <h3 className="landing-feature-title">AI-powered generation</h3>
                <p className="landing-feature-text">
                  Platform-aware outputs that adapt tone and format to each
                  channel.
                </p>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">📅</div>
                <h3 className="landing-feature-title">Scheduling</h3>
                <p className="landing-feature-text">
                  Save generated content to your scheduled queue. (Automatic
                  publishing coming with account connections.)
                </p>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">📊</div>
                <h3 className="landing-feature-title">Character awareness</h3>
                <p className="landing-feature-text">
                  Every result shows its character count and flags over-limit
                  posts before you copy them.
                </p>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">🌍</div>
                <h3 className="landing-feature-title">24-platform hub</h3>
                <p className="landing-feature-text">
                  A transparent directory of every platform FORGE plans to
                  support, with honest capability states.
                </p>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">🎨</div>
                <h3 className="landing-feature-title">Image generation</h3>
                <p className="landing-feature-text">
                  Generate images from prompts. Available on Pro and Higher
                  Pro plans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing preview ─── */}
        <section className="landing-section">
          <div className="landing-section-inner">
            <h2 className="landing-section-title">Simple pricing</h2>
            <p className="landing-section-subtitle">
              Start free. Upgrade when you need more.
            </p>

            <div className="landing-pricing">
              <div className="landing-price-card">
                <div className="landing-price-tier">Free</div>
                <div className="landing-price-amount">
                  $0<span className="landing-price-period">/month</span>
                </div>
                <ul className="landing-price-list">
                  <li>10 text generations per rolling 30 days</li>
                  <li>X, Instagram, Facebook</li>
                  <li>Character awareness</li>
                  <li>Platform directory</li>
                </ul>
                <Link to="/login" className="landing-price-cta">
                  Get Started Free
                </Link>
              </div>

              <div className="landing-price-card landing-price-card-featured">
                <div className="landing-price-badge">Most popular</div>
                <div className="landing-price-tier">Pro</div>
                <div className="landing-price-amount">
                  $26<span className="landing-price-period">/month</span>
                </div>
                <ul className="landing-price-list">
                  <li>Unlimited text generation</li>
                  <li>All 6 content platforms</li>
                  <li>Image generation</li>
                  <li>Scheduling</li>
                </ul>
                <Link to="/login" className="landing-price-cta">
                  Get Started
                </Link>
              </div>

              <div className="landing-price-card">
                <div className="landing-price-tier">Higher Pro</div>
                <div className="landing-price-amount">
                  $52<span className="landing-price-period">/month</span>
                </div>
                <ul className="landing-price-list">
                  <li>Everything in Pro</li>
                  <li>Unlimited image generation</li>
                  <li>Priority access to new features</li>
                  <li>Video generation when available</li>
                </ul>
                <Link to="/login" className="landing-price-cta">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="landing-section landing-cta-section">
          <div className="landing-section-inner">
            <h2 className="landing-section-title">
              Ready to create more from what you already have?
            </h2>
            <div className="landing-hero-actions">
              <Link to="/login" className="landing-cta-primary">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
