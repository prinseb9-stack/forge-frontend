import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { PlatformSelector } from '../components/PlatformSelector';
import { ContentInput } from '../components/ContentInput';
import { GenerateButton } from '../components/GenerateButton';
import { OutputPanel } from '../components/OutputPanel';
import { Footer } from '../components/Footer';
import { TabSwitcher, type Tab } from '../components/TabSwitcher';
import { ImageGenerator } from '../components/ImageGenerator';
import { UpgradeModal } from '../components/UpgradeModal';
import { generateContent, getMe, type UsageInfo, type MeUserInfo } from '../services/api';
import type { Platform, GeneratedContent } from '../types';
import { ShareModal } from '../components/ShareModal';
import { ScheduleModal } from '../components/ScheduleModal';
import { Toast } from '../components/Toast';

const PLAN_LIMITS = {
  free:         { maxWords: 500,    maxPlatforms: 1 },
  pro:          { maxWords: 5000,   maxPlatforms: 6 },
  higher_pro:   { maxWords: -1,     maxPlatforms: 6 },
} as const;

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('text');
  const [me, setMe] = useState<MeUserInfo | null>(null);
  const [meLoading, setMeLoading] = useState(true);

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['x']);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[] | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Share modal state
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<GeneratedContent | null>(null);

  // Schedule modal state
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<GeneratedContent | null>(null);

  // Transient success/info toast (Polish #8)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'info' | 'error' } | null>(null);

  // Upgrade modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string | undefined>(undefined);

  // Load user plan on mount
  useEffect(() => {
    (async () => {
      const res = await getMe();
      if (res.success && res.user) {
        setMe(res.user);
        if (res.user.textGeneration) setUsage(res.user.textGeneration);
      }
      setMeLoading(false);
    })();
  }, []);

  const currentPlan = me?.plan ?? 'free';
  const limits = PLAN_LIMITS[currentPlan] ?? PLAN_LIMITS.free;

  async function handleGenerate() {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setToast(null);

    try {
      const response = await generateContent({
        content: topic,
        platforms: selectedPlatforms,
      });

      if (!response.success) {
        if (
          response.code === 'PLATFORM_LIMIT_EXCEEDED' ||
          response.code === 'INPUT_TOO_LONG'
        ) {
          setModalReason(response.error);
          setModalOpen(true);
        }
        setError(response.error ?? 'Generation failed');
        return;
      }

      const normalized: GeneratedContent[] = (response.results ?? []).map(
        (r, i) => ({
          id: `${i}-${r.platform}`,
          platform: r.platform as Platform,
          content: r.content,
          timestamp: new Date(),
        })
      );

      setResults(normalized);
      if (response.usage) setUsage(response.usage);
      setToast({ message: 'Content generated', variant: 'success' });
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function openUpgrade(reason: string) {
    setModalReason(reason);
    setModalOpen(true);
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Hero />

        {/* Usage banner */}
        {!meLoading && usage && (
          <div className={`usage-banner ${usage.limit === -1 ? 'usage-banner-unlimited' : ''}`}>
            {usage.limit === -1 ? (
              <span className="usage-label">✨ Unlimited generations</span>
            ) : (
              <>
                <span className="usage-label">
                  {currentPlan} plan: <strong>{usage.used}/{usage.limit}</strong> used
                </span>
                <span className="usage-hint">
                  {usage.remaining} remaining this period
                </span>
              </>
            )}
          </div>
        )}

        <TabSwitcher active={tab} onChange={setTab} />

        {tab === 'text' && (
          <div className="dashboard-container">
            <div className="input-section">
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
                maxPlatforms={limits.maxPlatforms}
                onLimitHit={() =>
                  openUpgrade(
                    `The Free plan allows only ${limits.maxPlatforms} platform per generation. Upgrade to Pro to use all 6 platforms.`
                  )
                }
              />
              <ContentInput
                topic={topic}
                onTopicChange={setTopic}
                maxWords={limits.maxWords}
                onOverLimit={() =>
                  openUpgrade(
                    `The Free plan allows up to ${limits.maxWords} words. Upgrade to Pro for up to 5,000 words.`
                  )
                }
              />
              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
                isDisabled={!topic.trim() || selectedPlatforms.length === 0}
              />
            </div>
            <div className="output-section">
              <OutputPanel
                results={results}
                isLoading={isLoading}
                error={error}
                onShare={(content) => {
                  setShareTarget(content);
                  setShareOpen(true);
                }}
                onSchedule={(content) => {
                  setScheduleTarget(content);
                  setScheduleOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {tab === 'image' && (
          <div className="dashboard-container dashboard-single">
            <ImageGenerator />
          </div>
        )}
      </main>
      <Footer />

      <ShareModal
        open={shareOpen}
        onClose={() => {
          setShareOpen(false);
          setShareTarget(null);
        }}
        contentPreview={shareTarget?.content}
      />

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setScheduleTarget(null);
        }}
        platform={scheduleTarget?.platform ?? 'x'}
        content={scheduleTarget?.content ?? ''}
      />

      <UpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reason={modalReason}
        requiredPlan={currentPlan === 'free' ? 'pro' : 'higher_pro'}
      />

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
