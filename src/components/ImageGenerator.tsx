import React, { useState } from 'react';
import { generateImage, type ImageResult } from '../services/api';

const SIZES = [
  { value: '1024x1024', label: '1:1 Square', hint: '1024×1024' },
  { value: '1792x1024', label: '16:9 Landscape', hint: '1792×1024' },
  { value: '1024x1792', label: '9:16 Portrait', hint: '1024×1792' },
];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [planRequired, setPlanRequired] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlanRequired(false);

    try {
      const response = await generateImage(prompt, size);

      if (!response.success) {
        if (response.code === 'PLAN_REQUIRED') {
          setPlanRequired(true);
          return;
        }
        setError(response.error ?? 'Failed to generate image');
        return;
      }

      if (response.image) setResult(response.image);
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (planRequired) {
    return (
      <div className="image-generator image-locked">
        <div className="image-locked-content">
          <span className="image-locked-icon">🔒</span>
          <h3>Image Generation is Pro only</h3>
          <p>Upgrade to Pro or Higher Pro to generate AI images.</p>
          <div className="image-locked-pricing">
            <div className="pricing-card">
              <h4>Pro</h4>
              <p className="pricing-amount">5 images / month</p>
              <p className="pricing-price">$9 / month</p>
            </div>
            <div className="pricing-card pricing-card-featured">
              <h4>Higher Pro</h4>
              <p className="pricing-amount">Unlimited images</p>
              <p className="pricing-price">$29 / month</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-generator">
      <div className="image-form">
        <label className="image-label">
          Describe your image
          <textarea
            className="image-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset, cinematic lighting..."
            rows={3}
            disabled={isLoading}
          />
        </label>

        <div className="image-size-row">
          <span className="image-size-label">Aspect ratio:</span>
          <div className="image-size-options">
            {SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`image-size-btn ${size === s.value ? 'active' : ''}`}
                onClick={() => setSize(s.value)}
                disabled={isLoading}
              >
                <span className="image-size-label-main">{s.label}</span>
                <span className="image-size-hint">{s.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="image-error">{error}</div>}

        <button
          type="button"
          className="image-generate-btn"
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner">⟳</span>
              Generating image… (10–20s)
            </>
          ) : (
            '🎨 Generate Image'
          )}
        </button>
      </div>

      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
          <p>Creating your image…</p>
        </div>
      )}

      {!isLoading && result && (
        <div className="image-result">
          <img src={result.url} alt={result.prompt} className="image-result-img" />
          <div className="image-result-meta">
            <p className="image-result-prompt">{result.prompt}</p>
            <div className="image-result-actions">
              <span className="image-result-size">{result.size}</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="image-download-btn"
              >
                ⬇ Open / Download
              </a>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !result && (
        <div className="image-empty">
          <span className="image-empty-icon">🎨</span>
          <p>Your generated image will appear here</p>
        </div>
      )}
    </div>
  );
};
