import React from 'react';
import type { ConnectorInfo, CapabilityStatus, Connection } from '../types/connectors';
import {
  CAPABILITY_LABELS,
  CAPABILITY_ICONS,
  isConnectable,
} from '../types/connectors';

interface PlatformCardProps {
  platform: ConnectorInfo;
  connection?: Connection;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  connection,
  onConnect,
  onDisconnect,
}) => {
  const connectable = isConnectable(platform);
  const isConnected = connection?.status === 'active';

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
        {isConnected ? (
          <div className="platform-connected">
            <span className="platform-connected-status">
              ✓ Connected as @{connection.handle}
            </span>
            <button
              type="button"
              className="platform-disconnect-btn"
              onClick={() => onDisconnect?.(platform.id)}
            >
              Disconnect
            </button>
          </div>
        ) : connectable ? (
          <button
            type="button"
            className="platforms-card-btn platform-connect-btn"
            onClick={() => onConnect?.(platform.id)}
          >
            Connect
          </button>
        ) : (
          <button
            className="platforms-card-btn"
            disabled
            title={platform.name + ' is not available to connect yet.'}
          >
            Coming soon
          </button>
        )}
      </div>
    </div>
  );
};

interface CapabilityRowProps {
  label: string;
  status: CapabilityStatus;
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
