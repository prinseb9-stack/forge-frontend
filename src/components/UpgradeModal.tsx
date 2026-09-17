import React, { useState } from 'react';
import { createCheckout } from '../services/api';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
  requiredPlan?: 'pro' | 'higher_pro';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
  reason,
  requiredPlan = 'pro',
}) => {
  const [loading, setLoading] = useState<'pro' | 'higher_pro' | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleUpgrade(plan: 'pro' | 'higher_pro') {
    setLoading(plan);
    setError(null);

    try {
      const response = await createCheckout(plan);

      if (!response.success || !response.checkoutURL) {
        setError(response.error ?? 'Failed to start checkout');
        return;
      }

      // Redirect to Flutterwave checkout
      window.location.href = response.checkoutURL;
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <span className="modal-icon">🚀</span>
          <h2 className="modal-title">Unlock more with Pro</h2>
          {reason && <p className="modal-reason">{reason}</p>}
        </div>

        <div className="modal-pricing">
          <div className={`pricing-card ${requiredPlan === 'pro' ? 'pricing-card-featured' : ''}`}>
            <div className="pricing-tier">Pro</div>
            <div className="pricing-price-large">
              $15<span className="pricing-period">/mo</span>
            </div>
            <ul className="pricing-features">
              <li>✅ 150 text generations/mo</li>
              <li>✅ All 6 platforms</li>
              <li>✅ Up to 5,000 words input</li>
              <li>✅ 30 images/mo</li>
              <li>✅ 10 videos/mo</li>
              <li>✅ Generation history</li>
            </ul>
            <button
              className="modal-upgrade-btn"
              onClick={() => handleUpgrade('pro')}
              disabled={loading !== null}
            >
              {loading === 'pro' ? 'Redirecting…' : 'Upgrade to Pro'}
            </button>
          </div>

          <div className={`pricing-card ${requiredPlan === 'higher_pro' ? 'pricing-card-featured' : ''}`}>
            <div className="pricing-tier">Higher Pro</div>
            <div className="pricing-price-large">
              $49<span className="pricing-period">/mo</span>
            </div>
            <ul className="pricing-features">
              <li>✅ Unlimited everything</li>
              <li>✅ Unlimited words input</li>
              <li>✅ Team accounts (5 seats)</li>
              <li>✅ Bulk CSV generation</li>
              <li>✅ Custom brand voices</li>
              <li>✅ Priority support</li>
            </ul>
            <button
              className="modal-upgrade-btn"
              onClick={() => handleUpgrade('higher_pro')}
              disabled={loading !== null}
            >
              {loading === 'higher_pro' ? 'Redirecting…' : 'Upgrade to Higher Pro'}
            </button>
          </div>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-footer">
          <p className="modal-footer-hint">
            Secure payment powered by Flutterwave. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
