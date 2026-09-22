import { useEffect, useRef } from 'react';

export type ToastVariant = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  /** Called by the toast when its display duration elapses */
  onDismiss: () => void;
  /** Milliseconds the toast remains visible. Default: 2500 */
  durationMs?: number;
}

export function Toast({
  message,
  variant = 'success',
  onDismiss,
  durationMs = 2500,
}: ToastProps) {
  // Keep a stable reference to onDismiss so the timer doesn't reset
  // if the parent passes a new function each render.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismissRef.current();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  const icon =
    variant === 'success' ? '✅' :
    variant === 'error'   ? '⚠️' :
    'ℹ️';

  return (
    <div className={`toast toast-${variant}`} role="status" aria-live="polite">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
