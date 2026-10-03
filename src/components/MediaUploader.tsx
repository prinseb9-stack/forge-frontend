import React, { useRef, useState } from 'react';

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png'];

interface MediaUploaderProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  file: _file,
  onChange,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handlePick(f: File | null) {
    setError(null);
    if (!f) {
      onChange(null);
      setPreview(null);
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setError('Only JPEG and PNG are supported');
      return;
    }
    if (f.size > MAX_BYTES) {
      setError('File must be 15 MB or smaller');
      return;
    }
    onChange(f);
    setPreview(URL.createObjectURL(f));
  }

  return (
    <div className="media-uploader">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
        disabled={disabled}
      />
      {preview ? (
        <div className="media-preview">
          <img src={preview} alt="Selected" className="media-preview-img" />
          <button
            type="button"
            className="media-clear-btn"
            onClick={() => {
              onChange(null);
              setPreview(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            disabled={disabled}
          >
            Choose a different image
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="media-pick-btn"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <span className="media-pick-icon">📸</span>
          <span className="media-pick-label">Choose a photo</span>
          <span className="media-pick-hint">JPEG or PNG · max 15 MB</span>
        </button>
      )}
      {error && <div className="media-error">{error}</div>}
    </div>
  );
};
