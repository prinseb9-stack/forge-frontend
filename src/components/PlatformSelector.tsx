import React from 'react';
import type { Platform } from '../types';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformsChange: (platforms: Platform[]) => void;
  maxPlatforms?: number;
  onLimitHit?: () => void;
}

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'x',          label: 'X',          icon: '🐦' },
  { value: 'instagram',  label: 'Instagram',  icon: '📸' },
  { value: 'facebook',   label: 'Facebook',   icon: '👍' },
  { value: 'linkedin',   label: 'LinkedIn',   icon: '💼' },
  { value: 'blog',       label: 'Blog',       icon: '📝' },
  { value: 'newsletter', label: 'Newsletter', icon: '📧' },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformsChange,
  maxPlatforms,
  onLimitHit,
}) => {
  const isLimited = maxPlatforms !== undefined && maxPlatforms > 0;

  function toggle(platform: Platform) {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform));
      return;
    }

    // If selecting a new one would exceed the limit
    if (isLimited && selectedPlatforms.length >= maxPlatforms) {
      if (onLimitHit) onLimitHit();
      return;
    }

    onPlatformsChange([...selectedPlatforms, platform]);
  }

  return (
    <div className="platform-selector">
      <div className="platform-selector-header">
        <label className="platform-label">
          Platforms{' '}
          <span className="platform-count">({selectedPlatforms.length} selected)</span>
        </label>
        {isLimited && (
          <span className="platform-limit-badge">
            Max {maxPlatforms} on Free plan
          </span>
        )}
      </div>
      <div className="platform-buttons">
        {PLATFORMS.map(({ value, label, icon }) => {
          const active = selectedPlatforms.includes(value);
          const locked = isLimited && !active && selectedPlatforms.length >= maxPlatforms;

          return (
            <button
              key={value}
              type="button"
              className={`platform-btn ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => toggle(value)}
              aria-pressed={active}
            >
              <span className="platform-icon">{locked ? '🔒' : icon}</span>
              <span className="platform-name">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
