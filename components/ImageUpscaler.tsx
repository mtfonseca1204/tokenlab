'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, Trash2, ZoomIn } from 'lucide-react';

function sharpenImageData(
  imageData: ImageData,
  strength: number = 1
): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);
  const kernel = [0, -strength, 0, -strength, 1 + 4 * strength, -strength, 0, -strength, 0];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx));
            const py = Math.min(height - 1, Math.max(0, y + ky));
            val += data[(py * width + px) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        output[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, val));
      }
      output[(y * width + x) * 4 + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  return new ImageData(output, width, height);
}

export function ImageUpscaler() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState(2);
  const [originalSize, setOriginalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    setResultUrl(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => setOriginalSize({ w: img.width, h: img.height });
    img.src = url;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const upscale = async () => {
    if (!originalUrl) return;
    setProcessing(true);

    await new Promise((r) => setTimeout(r, 100));

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const newW = img.width * scale;
    const newH = img.height * scale;

    const canvas = document.createElement('canvas');
    canvas.width = newW;
    canvas.height = newH;
    const ctx = canvas.getContext('2d')!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, newW, newH);

    const imgData = ctx.getImageData(0, 0, newW, newH);
    const sharpened = sharpenImageData(imgData, 0.6);
    ctx.putImageData(sharpened, 0, 0);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png', 1)
    );

    const url = URL.createObjectURL(blob);
    setResultUrl(url);
    setProcessing(false);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = fileName.split('.').pop() || 'png';
    a.download = fileName.replace(`.${ext}`, '') + `-${scale}x.png`;
    a.click();
  };

  const reset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setOriginalSize(null);
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-content-secondary font-medium truncate">
                {fileName}
              </span>
              {originalSize && (
                <span className="text-xs text-content-faint font-mono">
                  {originalSize.w}×{originalSize.h}
                  {resultUrl && ` → ${originalSize.w * scale}×${originalSize.h * scale}`}
                </span>
              )}
              <button
                onClick={reset}
                className="text-content-faint hover:text-content transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex bg-surface-secondary rounded-lg p-1 gap-0.5">
              {[2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScale(s);
                    setResultUrl(null);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    scale === s
                      ? 'bg-surface text-content shadow-sm'
                      : 'text-content-muted hover:text-content-secondary'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
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
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-content-muted font-medium mb-2 uppercase tracking-wider">
                Upscaled {scale}x
              </p>
              <div className="rounded-xl overflow-hidden border border-line bg-surface-secondary min-h-[200px] flex items-center justify-center">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Upscaled"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                ) : processing ? (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <Loader2
                      size={24}
                      className="animate-spin text-content-muted"
                    />
                    <p className="text-sm text-content-muted">
                      Upscaling & sharpening...
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-content-faint py-12">
                    Click upscale to process
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!resultUrl && (
              <button
                onClick={upscale}
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
                    <ZoomIn size={14} />
                    Upscale {scale}x
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
