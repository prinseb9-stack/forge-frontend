import React from 'react';

interface BeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
  downloadUrl: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeUrl,
  afterUrl,
  downloadUrl,
}) => {
  return (
    <div className="before-after">
      <div className="before-after-grid">
        <div className="before-after-cell">
          <span className="before-after-label">Before</span>
          <img src={beforeUrl} alt="Original" className="before-after-img" />
        </div>
        <div className="before-after-cell">
          <span className="before-after-label before-after-label-new">After</span>
          <img src={afterUrl} alt="Edited" className="before-after-img" />
        </div>
      </div>
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="before-after-download"
      >
        ⬇ Download edited image
      </a>
    </div>
  );
};
