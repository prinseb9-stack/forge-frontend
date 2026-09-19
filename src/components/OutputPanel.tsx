import React from 'react';
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

export const OutputPanel: React.FC<OutputPanelProps> = ({
  results,
  isLoading,
  error,
  onShare,
  onSchedule,
}) => {
  function copyOne(content: string) {
    navigator.clipboard.writeText(content);
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
        {results.map((r) => (
          <div key={r.id} className="output-result-card">
            <div className="output-result-header">
              <span className="output-result-platform">
                {PLATFORM_LABELS[r.platform] ?? r.platform}
              </span>
              <div className="output-result-actions">
                <button
                  onClick={() => copyOne(r.content)}
                  className="copy-btn"
                  type="button"
                >
                  📋 Copy
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
        ))}
      </div>
    </div>
  );
};
