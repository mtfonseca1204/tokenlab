'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, Trash2 } from 'lucide-react';

export function BackgroundRemoval() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(0);

  const processImage = useCallback(async (file: File, id: number) => {
    setProcessing(true);
    setError(null);
    setStatus('Loading AI model...');

    try {
      const { removeBackground: removeBg } = await import(
        '@imgly/background-removal'
      );

      if (processingRef.current !== id) return;
      setStatus('Removing background...');

      const resultBlob = await removeBg(file, {
        progress: (key: string, current: number, total: number) => {
          if (processingRef.current !== id) return;
          if (key === 'compute:inference') {
            const pct = Math.round((current / total) * 100);
            setStatus(`Processing... ${pct}%`);
          }
        },
      } as Parameters<typeof removeBg>[1]);

      if (processingRef.current !== id) return;
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setStatus('');
    } catch {
      if (processingRef.current !== id) return;
      setError('Processing failed. Try again — the model may still be downloading.');
      setStatus('');
    } finally {
      if (processingRef.current === id) setProcessing(false);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be under 10MB.');
        return;
      }

      setError(null);
      setResultUrl(null);
      setFileName(file.name);

      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const id = Date.now();
      processingRef.current = id;
      processImage(file, id);
    },
    [processImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const base = fileName.replace(/\.[^.]+$/, '');
    a.download = `${base}-nobg.png`;
    a.click();
  };

  const reset = () => {
    processingRef.current = 0;
    setOriginalUrl(null);
    setResultUrl(null);
    setProcessing(false);
    setError(null);
    setStatus('');
    setFileName('');
  };

  if (!originalUrl) {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-line hover:border-content-faint rounded-2xl p-16 text-center cursor-pointer transition-colors group"
      >
        <Upload
          size={36}
          className="mx-auto mb-4 text-content-faint group-hover:text-content-muted transition-colors"
        />
        <p className="text-content-secondary font-medium mb-1">
          Drop an image or click to upload
        </p>
        <p className="text-content-faint text-sm">
          PNG, JPG, WebP up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-content-secondary font-medium truncate">
          {fileName}
        </span>
        <button
          onClick={reset}
          className="text-content-faint hover:text-content transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-content-muted font-medium mb-2 uppercase tracking-wider">
            Original
          </p>
          <div className="rounded-xl overflow-hidden border border-line bg-surface-secondary">
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-content-muted font-medium mb-2 uppercase tracking-wider">
            Result
          </p>
          <div className="rounded-xl overflow-hidden border border-line bg-surface-secondary min-h-[200px] flex items-center justify-center">
            {resultUrl ? (
              <div className="checkerboard w-full">
                <img
                  src={resultUrl}
                  alt="Background removed"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            ) : processing ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <Loader2
                  size={24}
                  className="animate-spin text-content-muted"
                />
                <p className="text-sm text-content-muted font-medium">
                  {status}
                </p>
                {status.includes('Loading') && (
                  <p className="text-xs text-content-faint">
                    First run downloads the model — subsequent uses are instant
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-content-faint py-12">
                Processing will start automatically
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => {
              const id = Date.now();
              processingRef.current = id;
              fetch(originalUrl)
                .then((r) => r.blob())
                .then((b) =>
                  processImage(
                    new File([b], fileName, { type: b.type }),
                    id
                  )
                );
            }}
            className="text-xs text-red-400 hover:text-red-300 font-semibold ml-4 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {resultUrl && (
        <button
          onClick={download}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-invert text-content-invert rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
        >
          <Download size={14} />
          Download PNG
        </button>
      )}
    </div>
  );
}
