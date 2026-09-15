import React from 'react';

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
  if (!open) return null;

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
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-upgrade-btn" disabled>
            💳 Coming soon — payment integration in progress
          </button>
          <p className="modal-footer-hint">
            We're launching soon. Your account will remain free until then.
          </p>
        </div>
      </div>
    </div>
  );
};
