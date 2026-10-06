import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaUploader } from '../components/MediaUploader';
import { BeforeAfter } from '../components/BeforeAfter';
import { presignUpload, uploadToStorage, editImage } from '../services/api';

type Stage = 'idle' | 'presigning' | 'uploading' | 'editing' | 'done' | 'error';

export const Studio: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [storageMissing, setStorageMissing] = useState(false);
  const [result, setResult] = useState<{
    beforeUrl: string;
    afterUrl: string;
  } | null>(null);
  
  const [reservationId, setReservationId] = useState<string | null>(null);

  const busy = stage === 'presigning' || stage === 'uploading' || stage === 'editing';

  async function handleSubmit() {
    if (!file || !prompt.trim()) return;
    setError(null);
    setStorageMissing(false);
    setResult(null);
    setReservationId(null);

    setStage('presigning');
    const presign = await presignUpload(file.type, file.size);
    if (!presign.success || !presign.uploadUrl || !presign.objectKey) {
      if (presign.code === 'PRESIGN_FAILED' || presign.code === 'SERVER_ERROR') {
        setStorageMissing(true);
      }
      setError(presign.error ?? 'Could not prepare upload');
      setStage('error');
      return;
    }

    if (presign.reservationId) {
      setReservationId(presign.reservationId);
    }

    setStage('uploading');
    try {
      await uploadToStorage(presign.uploadUrl, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setStage('error');
      return;
    }

    if (!reservationId) {
      setError('Missing reservation — please try again');
      setStage('error');
      return;
    }

    setStage('editing');
    const edited = await editImage(presign.objectKey, prompt.trim(), '1024x1024', reservationId);
    if (!edited.success || !edited.edit) {
      setError(edited.error ?? 'Edit failed');
      setStage('error');
      return;
    }

    setResult({
      beforeUrl: URL.createObjectURL(file),
      afterUrl: edited.edit.resultUrl,
    });
    setStage('done');
  }

  const buttonLabel =
    stage === 'presigning'
      ? 'Preparing…'
      : stage === 'uploading'
      ? 'Uploading…'
      : stage === 'editing'
      ? 'Editing (10–30s)…'
      : '✨ Edit image';

  return (
    <div className="app-shell">
      <Header />
      <main className="studio-page">
        <div className="studio-header">
          <h1 className="studio-title">Studio</h1>
          <p className="studio-subtitle">
            Upload a photo, describe what you want, and FORGE will edit it.
          </p>
        </div>

        {storageMissing && (
          <div className="studio-notice">
            Storage is not configured yet — the editor will be enabled once
            the backend is connected.
          </div>
        )}

        <MediaUploader
          file={file}
          onChange={(f) => {
            setFile(f);
            setReservationId(null);
          }}
          disabled={busy}
        />

        <label className="studio-label">
          What should FORGE do?
          <textarea
            className="studio-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Make this look cinematic, add a dark luxury atmosphere, improve the lighting…"
            rows={3}
            disabled={busy}
          />
        </label>

        {error && <div className="studio-error">{error}</div>}

        <button
          type="button"
          className="studio-submit"
          onClick={handleSubmit}
          disabled={busy || !file || !prompt.trim()}
        >
          {buttonLabel}
        </button>

        {busy && (
          <div className="studio-loading">
            <div className="loading-spinner"></div>
            <p>{buttonLabel}</p>
          </div>
        )}

        {result && !busy && (
          <BeforeAfter
            beforeUrl={result.beforeUrl}
            afterUrl={result.afterUrl}
            downloadUrl={result.afterUrl}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};
