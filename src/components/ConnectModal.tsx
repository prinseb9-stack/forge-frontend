import React, { useState, useEffect } from 'react';
import { connectBluesky } from '../services/api';

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  platformId: string;
  platformName: string;
  onSuccess?: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  open,
  onClose,
  platformId,
  platformName,
  onSuccess,
}) => {
  const [handle, setHandle] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setHandle('');
      setAppPassword('');
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  if (!open) return null;

  // Only Bluesky is supported right now
  if (platformId !== 'bluesky') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="connect-modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          <div className="modal-header">
            <span className="modal-icon">🔗</span>
            <h2 className="modal-title">Connect {platformName}</h2>
          </div>
          <p className="connect-unsupported">
            {platformName} integration is not available yet.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!handle.trim()) {
      setError('Please enter your Bluesky handle');
      return;
    }
    if (!appPassword.trim()) {
      setError('Please enter your app password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await connectBluesky(handle.trim(), appPassword.trim());
      if (!res.success) {
        setError(res.error ?? 'Failed to connect');
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="connect-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-header">
          <span className="modal-icon">🦋</span>
          <h2 className="modal-title">Connect {platformName}</h2>
          <p className="modal-reason">
            Enter your Bluesky handle and an app password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="connect-form">
          <label className="connect-label">
            Handle
            <input
              type="text"
              className="connect-input"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="user.bsky.social"
              autoComplete="username"
              disabled={isLoading || success}
            />
          </label>

          <label className="connect-label">
            App password
            <input
              type="password"
              className="connect-input"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              autoComplete="off"
              disabled={isLoading || success}
            />
          </label>

          <div className="connect-help">
            Don't have an app password? Create one at{' '}
            <a
              href="https://bsky.app/settings/app-passwords"
              target="_blank"
              rel="noopener noreferrer"
            >
              bsky.app/settings/app-passwords
            </a>
          </div>

          {error && <div className="connect-error">{error}</div>}
          {success && <div className="connect-success">✅ Connected successfully</div>}

          <div className="connect-actions">
            <button
              type="button"
              className="share-modal-btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="share-modal-btn-primary"
              disabled={isLoading || success}
            >
              {isLoading ? 'Connecting…' : success ? 'Connected' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
