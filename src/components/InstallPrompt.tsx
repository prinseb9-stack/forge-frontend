import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('Install outcome:', outcome);
    setDeferredPrompt(null);
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <span className="install-prompt-icon">⚡</span>
        <div>
          <div className="install-prompt-title">Install FORGE</div>
          <div className="install-prompt-subtitle">
            Add to your home screen for faster access
          </div>
        </div>
      </div>
      <div className="install-prompt-actions">
        <button className="install-prompt-dismiss" onClick={() => setDismissed(true)}>
          Later
        </button>
        <button className="install-prompt-install" onClick={install}>
          Install
        </button>
      </div>
    </div>
  );
}
