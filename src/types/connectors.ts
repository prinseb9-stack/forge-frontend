// Types that mirror the backend's /api/connectors response.
// Authoritative source is Go's internal/connectors package.

export type CapabilityStatus =
  | 'available'
  | 'planned'
  | 'coming_soon'
  | 'unavailable';

export interface PlatformCapabilities {
  connect: CapabilityStatus;
  publish: CapabilityStatus;
  schedule: CapabilityStatus;
  analytics: CapabilityStatus;
}

export interface ConnectorInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  capabilities: PlatformCapabilities;
}

export interface ConnectorsResponse {
  success: boolean;
  connectors: ConnectorInfo[];
  count: number;
  error?: string;
}

export const CAPABILITY_LABELS: Record<CapabilityStatus, string> = {
  available:   'Available',
  planned:     'Planned',
  coming_soon: 'Coming soon',
  unavailable: 'Unavailable',
};

export const CAPABILITY_ICONS: Record<CapabilityStatus, string> = {
  available:   '✅',
  planned:     '📅',
  coming_soon: '🚧',
  unavailable: '⛔',
};

export function isConnectable(c: ConnectorInfo): boolean {
  return c.capabilities.connect === 'available';
}

// ─── Fallback catalog ───
// Used ONLY when /api/connectors is unreachable. Keeps the UI functional
// with honest "coming_soon" states. The backend remains the source of
// truth for what platforms exist and what they can do.
export const FALLBACK_CONNECTORS: ConnectorInfo[] = [
  { id: 'x', name: 'X (Twitter)', icon: '🐦',
    description: 'Short-form posts and conversations.', category: 'social',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼',
    description: 'Professional posts and business content.', category: 'professional',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'instagram', name: 'Instagram', icon: '📸',
    description: 'Visual posts, reels, and stories.', category: 'visual',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
  { id: 'facebook', name: 'Facebook', icon: '👍',
    description: 'Pages, posts, and community content.', category: 'professional',
    capabilities: { connect: 'coming_soon', publish: 'planned', schedule: 'planned', analytics: 'planned' } },
];
