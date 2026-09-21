import React, { useEffect, useRef, useState } from 'react';
import type { GeneratedContent } from '../types';

interface OutputPanelProps {
  results: GeneratedContent[] | null;
  isLoading: boolean;
  error: string | null;
  onShare?: (content: GeneratedContent) => void;
  onSchedule?: (content: GeneratedContent) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  blog: 'Blog',
  newsletter: 'Newsletter',
  threads: 'Threads',
  tiktok: 'TikTok',
  'youtube-shorts': 'YouTube Shorts',
  pinterest: 'Pinterest',
};

const COPY_FEEDBACK_MS = 1500;

export const OutputPanel: React.FC<OutputPanelProps> = ({
  results,
  isLoading,
  error,
  onShare,
  onSchedule,
}) => {
  // Tracks which result's Copy button was most recently clicked so we
  // can show per-card "Copied!" feedback without affecting other cards.
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // Clear any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function copyOne(id: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Clipboard API can fail on insecure contexts. Fail silently —
      // the button just won't show "Copied!".
      return;
    }

    // Cancel any previous timer so rapid clicks reset cleanly
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    setCopiedId(id);
    timerRef.current = window.setTimeout(() => {
      setCopiedId(null);
      timerRef.current = null;
    }, COPY_FEEDBACK_MS);
  }

  if (isLoading) {
    return (
      <div className="output-panel loading">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Generating your content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="output-panel error">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="output-panel empty">
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>Your generated content will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="output-panel">
      <div className="output-header">
        <h3>Generated Content</h3>
        <span className="output-count">{results.length} platforms</span>
      </div>
      <div className="output-results">
        {results.map((r) => {
          const justCopied = copiedId === r.id;
          return (
            <div key={r.id} className="output-result-card">
              <div className="output-result-header">
                <span className="output-result-platform">
                  {PLATFORM_LABELS[r.platform] ?? r.platform}
                </span>
                <div className="output-result-actions">
                  <button
                    onClick={() => copyOne(r.id, r.content)}
                    className={`copy-btn ${justCopied ? 'copied' : ''}`}
                    type="button"
                    aria-live="polite"
                  >
                    {justCopied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  {onShare && (
                    <button
                      onClick={() => onShare(r)}
                      className="share-btn"
                      type="button"
                    >
                      📤 Share
                    </button>
                  )}
                  {onSchedule && (
                    <button
                      onClick={() => onSchedule(r)}
                      className="schedule-btn"
                      type="button"
                    >
                      📅 Schedule
                    </button>
                  )}
                </div>
              </div>
              <pre className="output-result-content">{r.content}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
