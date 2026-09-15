import React from 'react';

export type Tab = 'text' | 'image';

interface TabSwitcherProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'image', label: 'Image', icon: '🎨' },
];

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ active, onChange }) => {
  return (
    <div className="tab-switcher">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`tab-btn ${active === tab.value ? 'active' : ''}`}
          onClick={() => onChange(tab.value)}
          aria-pressed={active === tab.value}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
