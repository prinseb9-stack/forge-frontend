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

// Per-platform character limits (0 = no limit).
// Mirrors the limits enforced by each platform's API.
const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  x: 280,
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
  threads: 500,
  tiktok: 2200,
  'youtube-shorts': 5000,
  pinterest: 500,
  blog: 0,
  newsletter: 0,
};

const COPY_FEEDBACK_MS = 1500;

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  results,
  isLoading,
  error,
  onShare,
  onSchedule,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

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
      return;
    }

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
          <p className="loading-title">Generating your content…</p>
          <p className="loading-hint">This may take up to 20 seconds.</p>
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
          const charCount = r.content.length;
          const limit = PLATFORM_CHAR_LIMITS[r.platform] ?? 0;
          const isOver = limit > 0 && charCount > limit;

          return (
            <div key={r.id} className="output-result-card">
              <div className="output-result-header">
                <div className="output-result-meta">
                  <span className="output-result-platform">
                    {PLATFORM_LABELS[r.platform] ?? r.platform}
                  </span>
                  <span
                    className={`output-char-counter ${isOver ? 'over' : ''}`}
                    title={
                      limit > 0
                        ? `${formatNumber(charCount)} of ${formatNumber(limit)} characters`
                        : `${formatNumber(charCount)} characters`
                    }
                  >
                    {limit > 0
                      ? `${formatNumber(charCount)} / ${formatNumber(limit)} chars`
                      : `${formatNumber(charCount)} chars`}
                  </span>
                </div>
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
              {isOver && (
                <div className="output-char-warning">
                  ⚠️ {formatNumber(charCount - limit)} characters over the{' '}
                  {PLATFORM_LABELS[r.platform] ?? r.platform} limit
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
