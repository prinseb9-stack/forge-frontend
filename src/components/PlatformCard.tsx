import React from 'react';
import type { PlatformCatalogEntry } from '../data/platforms';
import {
  CAPABILITY_LABELS,
  CAPABILITY_ICONS,
  isConnectable,
} from '../data/platforms';

interface PlatformCardProps {
  platform: PlatformCatalogEntry;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const connectable = isConnectable(platform);

  return (
    <div className="platforms-card">
      <div className="platforms-card-header">
        <span className="platforms-card-icon">{platform.icon}</span>
        <div className="platforms-card-title">
          <h3>{platform.name}</h3>
          <p className="platforms-card-description">{platform.description}</p>
        </div>
      </div>

      <div className="platforms-card-capabilities">
        <CapabilityRow label="Connect"   status={platform.capabilities.connect} />
        <CapabilityRow label="Publish"   status={platform.capabilities.publish} />
        <CapabilityRow label="Schedule"  status={platform.capabilities.schedule} />
        <CapabilityRow label="Analytics" status={platform.capabilities.analytics} />
      </div>

      <div className="platforms-card-footer">
        <button
          className="platforms-card-btn"
          disabled
          title={
            connectable
              ? 'Connect to ' + platform.name
              : platform.name + ' is not available to connect yet.'
          }
        >
          {connectable ? 'Connect' : 'Coming soon'}
        </button>
      </div>
    </div>
  );
};

interface CapabilityRowProps {
  label: string;
  status: 'available' | 'planned' | 'coming_soon';
}

const CapabilityRow: React.FC<CapabilityRowProps> = ({ label, status }) => {
  return (
    <div className="platforms-capability-row">
      <span className="platforms-capability-icon">{CAPABILITY_ICONS[status]}</span>
      <span className="platforms-capability-label">{label}</span>
      <span className={`platforms-capability-status platforms-status-${status}`}>
        {CAPABILITY_LABELS[status]}
      </span>
    </div>
  );
};
