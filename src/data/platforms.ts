export type CapabilityStatus =
  | 'available'
  | 'planned'
  | 'coming_soon';

export interface PlatformCapabilities {
  connect: CapabilityStatus;
  publish: CapabilityStatus;
  schedule: CapabilityStatus;
  analytics: CapabilityStatus;
}

export interface PlatformCatalogEntry {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: PlatformCapabilities;
}

export const PLATFORMS: PlatformCatalogEntry[] = [
  { id: 'x', name: 'X (Twitter)', icon: '🐦',
    description: 'Short-form posts and conversations.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼',
    description: 'Professional posts and business content.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'instagram', name: 'Instagram', icon: '📸',
    description: 'Visual posts, reels, and stories.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'facebook', name: 'Facebook', icon: '👍',
    description: 'Pages, posts, and community content.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'threads', name: 'Threads', icon: '🧵',
    description: 'Short-form conversations.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'tiktok', name: 'TikTok', icon: '🎵',
    description: 'Short-form video content.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'youtube-shorts', name: 'YouTube Shorts', icon: '🎬',
    description: 'Short-form video content.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'pinterest', name: 'Pinterest', icon: '📌',
    description: 'Pins and visual discovery.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'blog', name: 'Blog / Newsletter', icon: '📝',
    description: 'Long-form publishing and newsletters.',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
];

export const CAPABILITY_LABELS: Record<CapabilityStatus, string> = {
  available:   'Available',
  planned:     'Planned',
  coming_soon: 'Coming soon',
};

export const CAPABILITY_ICONS: Record<CapabilityStatus, string> = {
  available:   '✅',
  planned:     '📅',
  coming_soon: '🚧',
};

export function isConnectable(p: PlatformCatalogEntry): boolean {
  return p.capabilities.connect === 'available';
}
