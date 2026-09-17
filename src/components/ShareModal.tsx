import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PLATFORMS, CAPABILITY_LABELS, CAPABILITY_ICONS } from '../data/platforms';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional: the content the user is trying to share */
  contentPreview?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  contentPreview,
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  function handleGoToPlatforms() {
    onClose();
    navigate('/platforms');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <span className="modal-icon">📤</span>
          <h2 className="modal-title">Share to Platforms</h2>
          <p className="modal-reason">
            Choose where to send this content.
          </p>
        </div>

        {contentPreview && (
          <div className="share-preview">
            <div className="share-preview-label">Content preview</div>
            <div className="share-preview-content">
              {contentPreview.length > 200
                ? contentPreview.slice(0, 200) + '…'
                : contentPreview}
            </div>
          </div>
        )}

        <div className="share-platform-list">
          {PLATFORMS.map((platform) => {
            // Feature #2 — no platforms are connected yet (OAuth not built).
            // Every row shows "Not connected" and is disabled.
            const connectable = platform.capabilities.connect === 'available';

            return (
              <div
                key={platform.id}
                className={`share-platform-row ${connectable ? '' : 'share-platform-row-disabled'}`}
              >
                <span className="share-platform-icon">{platform.icon}</span>
                <div className="share-platform-info">
                  <div className="share-platform-name">{platform.name}</div>
                  <div className="share-platform-status">
                    {connectable
                      ? 'Ready to share'
                      : 'Not connected'}
                  </div>
                </div>
                <span className="share-platform-checkbox">
                  {connectable ? '✓' : '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="share-modal-notice">
          ⚠️ Connect a platform first to enable sharing.
        </div>

        <div className="share-modal-actions">
          <button className="share-modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="share-modal-btn-primary" onClick={handleGoToPlatforms}>
            Go to Platforms
          </button>
        </div>

        <div className="share-modal-footer">
          <span className="share-modal-capability-badge">
            {CAPABILITY_ICONS.coming_soon} {CAPABILITY_LABELS.coming_soon} — OAuth coming next
          </span>
        </div>
      </div>
    </div>
  );
};
