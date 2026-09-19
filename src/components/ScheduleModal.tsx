import React, { useState, useEffect } from 'react';
import { createScheduledPost } from '../services/api';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  platform: string;
  content: string;
}

const PLATFORM_OPTIONS = [
  { value: 'x',              label: 'X (Twitter)' },
  { value: 'linkedin',       label: 'LinkedIn' },
  { value: 'instagram',      label: 'Instagram' },
  { value: 'facebook',       label: 'Facebook' },
  { value: 'threads',        label: 'Threads' },
  { value: 'tiktok',         label: 'TikTok' },
  { value: 'youtube-shorts', label: 'YouTube Shorts' },
  { value: 'pinterest',      label: 'Pinterest' },
  { value: 'blog',           label: 'Blog / Newsletter' },
];

/** Returns "YYYY-MM-DD" for a date offset from today */
function defaultDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Returns "HH:MM" rounded up to the next 15-min slot */
function defaultTimeNextSlot(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 15);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
  d.setSeconds(0);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  open,
  onClose,
  platform,
  content,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState(platform || 'x');
  const [date, setDate] = useState(defaultDatePlusDays(1));
  const [time, setTime] = useState(defaultTimeNextSlot());
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset whenever the modal opens for a new post
  useEffect(() => {
    if (open) {
      setSelectedPlatform(platform || 'x');
      setDate(defaultDatePlusDays(1));
      setTime(defaultTimeNextSlot());
      setNotes('');
      setError(null);
      setSuccess(false);
    }
  }, [open, platform]);

  if (!open) return null;

  function buildRFC3339(): string | null {
    if (!date || !time) return null;
    const iso = `${date}T${time}:00`;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  async function handleSubmit() {
    setError(null);

    if (!content.trim()) {
      setError('Content is empty');
      return;
    }
    if (!selectedPlatform) {
      setError('Please select a platform');
      return;
    }

    const iso = buildRFC3339();
    if (!iso) {
      setError('Please enter a valid date and time');
      return;
    }

    const scheduled = new Date(iso);
    const now = new Date();
    const diffMs = scheduled.getTime() - now.getTime();

    if (diffMs < 60 * 1000) {
      setError('Scheduled time must be at least 1 minute in the future');
      return;
    }
    if (diffMs > 90 * 24 * 60 * 60 * 1000) {
      setError('Cannot schedule more than 90 days in advance');
      return;
    }

    setIsLoading(true);
    try {
      const res = await createScheduledPost({
        platform: selectedPlatform,
        content,
        scheduledFor: iso,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error ?? 'Failed to schedule post');
        return;
      }

      setSuccess(true);
      // Auto-close after a beat
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="schedule-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="modal-header">
          <span className="modal-icon">📅</span>
          <h2 className="modal-title">Schedule post</h2>
          <p className="modal-reason">
            FORGE will save this to your scheduled queue.
          </p>
        </div>

        <div className="schedule-preview">
          <div className="schedule-preview-label">Content preview</div>
          <div className="schedule-preview-content">
            {content.length > 240 ? content.slice(0, 240) + '…' : content}
          </div>
        </div>

        <div className="schedule-field">
          <label className="schedule-label">Platform</label>
          <select
            className="schedule-input"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            disabled={isLoading}
          >
            {PLATFORM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="schedule-row">
          <div className="schedule-field">
            <label className="schedule-label">Date</label>
            <input
              type="date"
              className="schedule-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="schedule-field">
            <label className="schedule-label">Time</label>
            <input
              type="time"
              className="schedule-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="schedule-field">
          <label className="schedule-label">Notes (optional)</label>
          <input
            type="text"
            className="schedule-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any reminders for yourself…"
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        {error && <div className="schedule-error">{error}</div>}
        {success && (
          <div className="schedule-success">
            ✅ Scheduled. It will appear in your Scheduled Posts.
          </div>
        )}

        <div className="schedule-modal-notice">
          ⚠️ Auto-posting requires connecting {selectedPlatform} first (coming with OAuth).
        </div>

        <div className="schedule-modal-actions">
          <button
            className="share-modal-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="share-modal-btn-primary"
            onClick={handleSubmit}
            disabled={isLoading || success}
          >
            {isLoading ? 'Scheduling…' : success ? 'Scheduled' : 'Schedule post'}
          </button>
        </div>
      </div>
    </div>
  );
};
