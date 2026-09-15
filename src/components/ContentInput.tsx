import React from 'react';

interface ContentInputProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  placeholder?: string;
  maxWords?: number;
  onOverLimit?: () => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  topic,
  onTopicChange,
  placeholder = 'Paste your content or describe your topic...',
  maxWords,
  onOverLimit,
}) => {
  const wordCount = topic.trim() ? topic.trim().split(/\s+/).length : 0;
  const isOver = maxWords !== undefined && maxWords > 0 && wordCount > maxWords;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    onTopicChange(value);
    const newCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    if (maxWords !== undefined && maxWords > 0 && newCount > maxWords && onOverLimit) {
      onOverLimit();
    }
  }

  return (
    <div className="content-input">
      <div className="content-input-header">
        <label className="input-label">Content / Topic:</label>
        {maxWords !== undefined && maxWords > 0 && (
          <span className={`word-counter ${isOver ? 'over' : ''}`}>
            {wordCount} / {maxWords} words
          </span>
        )}
        {maxWords === -1 && (
          <span className="word-counter">Unlimited words</span>
        )}
      </div>
      <textarea
        className={`topic-input ${isOver ? 'over-limit' : ''}`}
        value={topic}
        onChange={handleChange}
        placeholder={placeholder}
        rows={6}
      />
      {isOver && maxWords !== undefined && (
        <p className="word-limit-warning">
          Your content exceeds the {maxWords}-word limit for this plan.
        </p>
      )}
    </div>
  );
};
