import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscription } from '../services/api';

export function PaymentCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [plan, setPlan] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10; // 10 attempts x 2 seconds = 20 seconds

    async function checkSubscription() {
      attempts++;

      try {
        const response = await getSubscription();

        if (cancelled) return;

        if (response.success && response.plan !== 'free') {
          setPlan(response.plan);
          setStatus('success');

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            if (!cancelled) navigate('/');
          }, 3000);
          return;
        }

        // Still not updated — the webhook may be delayed. Retry.
        if (attempts < maxAttempts) {
          setTimeout(checkSubscription, 2000);
        } else {
          setStatus('error');
          setError(
            'Your payment was received but the subscription has not activated yet. ' +
            'Please refresh in a minute or contact support if the issue persists.'
          );
        }
      } catch (err) {
        console.error(err);
        if (!cancelled && attempts < maxAttempts) {
          setTimeout(checkSubscription, 2000);
        } else {
          setStatus('error');
          setError('Network error while verifying payment.');
        }
      }
    }

    checkSubscription();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="payment-callback">
      <div className="payment-callback-card">
        {status === 'checking' && (
          <>
            <div className="loading-spinner"></div>
            <h2>Verifying your payment…</h2>
            <p>This usually takes a few seconds.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="payment-callback-icon">✅</div>
            <h2>Payment successful!</h2>
            <p>
              Welcome to <strong>{plan === 'higher_pro' ? 'Higher Pro' : 'Pro'}</strong>.
            </p>
            <p className="payment-callback-hint">Redirecting to your dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="payment-callback-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button
              className="payment-callback-btn"
              onClick={() => navigate('/')}
            >
              Back to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
