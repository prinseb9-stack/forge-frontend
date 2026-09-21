import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  isLoading,
  isDisabled = false,
}) => {
  return (
    <div className="generate-button-container">
      <button
        className={`generate-btn ${isLoading ? 'generating' : ''}`}
        onClick={onClick}
        disabled={isDisabled || isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner">⟳</span>
            Generating…
          </>
        ) : (
          '⚡ Generate Content'
        )}
      </button>
    </div>
  );
};
