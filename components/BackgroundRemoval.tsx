'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, Trash2, Sparkles } from 'lucide-react';

export function BackgroundRemoval() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
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
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const removeBackground = async () => {
    if (!originalUrl) return;
    setProcessing(true);
    setError(null);

    try {
      const { removeBackground: removeBg } = await import(
        '@imgly/background-removal'
      );
      const response = await fetch(originalUrl);
      const blob = await response.blob();
      const resultBlob = await removeBg(blob);
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
    } catch (err) {
      setError(
        'Failed to remove background. The model may still be downloading — try again in a moment.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = fileName.split('.').pop() || 'png';
    a.download = fileName.replace(`.${ext}`, '') + '-nobg.png';
    a.click();
  };

  const reset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setFileName('');
  };

  return (
    <div>
      {!originalUrl ? (
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
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
                    <p className="text-sm text-content-muted">
                      Removing background...
                    </p>
                    <p className="text-xs text-content-faint">
                      First run downloads the AI model (~40MB)
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-content-faint py-12">
                    Click remove to process
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            {!resultUrl && (
              <button
                onClick={removeBackground}
                disabled={processing}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-invert text-content-invert rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all"
              >
                {processing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Remove Background
                  </>
                )}
              </button>
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
        </div>
      )}
    </div>
  );
}
