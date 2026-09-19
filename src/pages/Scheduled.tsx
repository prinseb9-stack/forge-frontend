import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import {
  getScheduledPosts,
  deleteScheduledPost,
  type ScheduledPost,
} from '../services/api';

const STATUS_LABELS: Record<string, string> = {
  pending:   'Scheduled',
  posted:    'Posted',
  failed:    'Failed',
  cancelled: 'Cancelled',
};

const PLATFORM_LABELS: Record<string, string> = {
  x: 'X (Twitter)',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  tiktok: 'TikTok',
  blog: 'Blog / Newsletter',
};

export function Scheduled() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getScheduledPosts();
      if (!res.success) {
        setError(res.error ?? 'Failed to load scheduled posts');
        return;
      }
      setPosts(res.posts ?? []);
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Cancel this scheduled post?')) return;
    setDeletingId(id);
    try {
      const res = await deleteScheduledPost(id);
      if (!res.success) {
        setError(res.error ?? 'Failed to cancel');
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="scheduled-page">
          <div className="scheduled-hero">
            <h1 className="scheduled-title">📅 Scheduled Posts</h1>
            <p className="scheduled-subtitle">
              Manage the content you've scheduled with FORGE.
            </p>
          </div>

          {error && <div className="scheduled-error-banner">{error}</div>}

          {isLoading && (
            <div className="scheduled-loading">
              <div className="loading-spinner"></div>
              <p>Loading your scheduled posts…</p>
            </div>
          )}

          {!isLoading && posts.length === 0 && !error && (
            <div className="scheduled-empty">
              <div className="scheduled-empty-icon">📭</div>
              <h3>No scheduled posts yet</h3>
              <p>
                Generate content on the Dashboard and click <strong>📅 Schedule</strong> on any result.
              </p>
            </div>
          )}

          {!isLoading && posts.length > 0 && (
            <div className="scheduled-list">
              {posts.map((p) => {
                const when = new Date(p.scheduledFor);
                const isPending = p.status === 'pending';
                return (
                  <div key={p.id} className="scheduled-card">
                    <div className="scheduled-card-header">
                      <span className="scheduled-card-platform">
                        {PLATFORM_LABELS[p.platform] ?? p.platform}
                      </span>
                      <span className={`scheduled-status scheduled-status-${p.status}`}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </div>

                    <div className="scheduled-card-when">
                      🗓 {when.toLocaleDateString()} · {when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <pre className="scheduled-card-content">{p.content}</pre>

                    {p.notes && (
                      <div className="scheduled-card-notes">
                        <strong>Notes:</strong> {p.notes}
                      </div>
                    )}

                    <div className="scheduled-card-actions">
                      <button
                        className="scheduled-cancel-btn"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id || !isPending}
                        title={isPending ? 'Cancel this schedule' : 'Only pending posts can be cancelled'}
                      >
                        {deletingId === p.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="scheduled-note">
            <h3>About scheduled posts</h3>
            <p>
              Scheduled posts are saved to your account. FORGE will <strong>not</strong> auto-post
              them yet — auto-publishing requires connecting your account (OAuth), which is coming soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
