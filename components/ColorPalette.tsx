'use client';

import { useState } from 'react';
import { ColorScale, ColorShade } from '@/lib/types';
import { shouldUseWhiteText, getContrastRatio } from '@/lib/colors';
import { Check, Copy } from 'lucide-react';

const SHADES: ColorShade[] = [
  '50', '100', '200', '300', '400', '500',
  '600', '700', '800', '900', '950',
];

interface ColorPaletteProps {
  name: string;
  scale: ColorScale;
  compact?: boolean;
}

export function ColorPalette({ name, scale, compact }: ColorPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium text-content-secondary capitalize">
          {name}
        </h3>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: scale['500'],
            transition: 'background-color 200ms ease',
          }}
        />
      </div>
      <div className="grid grid-cols-11 gap-1.5">
        {SHADES.map((shade) => {
          const hex = scale[shade];
          const useWhite = shouldUseWhiteText(hex);
          const contrastW = getContrastRatio(hex, '#ffffff').toFixed(1);
          const contrastB = getContrastRatio(hex, '#000000').toFixed(1);
          const isCopied = copied === hex;

          return (
            <button
              key={shade}
              onClick={() => copy(hex)}
              className="group flex flex-col items-center gap-1.5 focus:outline-none"
              title={`${name} ${shade}: ${hex}\nWhite: ${contrastW}:1 · Black: ${contrastB}:1`}
            >
              <div
                className={`w-full rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-content-faint ${
                  compact ? 'aspect-[4/3]' : 'aspect-square'
                }`}
                style={{
                  backgroundColor: hex,
                  transition:
                    'background-color 200ms ease, transform 150ms ease',
                }}
              >
                {isCopied ? (
                  <Check
                    size={compact ? 10 : 14}
                    className={useWhite ? 'text-white' : 'text-zinc-900'}
                  />
                ) : (
                  <Copy
                    size={compact ? 8 : 12}
                    className={`transition-opacity duration-150 opacity-0 group-hover:opacity-60 ${
                      useWhite ? 'text-white' : 'text-zinc-900'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium text-content-muted tabular-nums">
                {shade}
              </span>
              {!compact && (
                <span className="text-[9px] font-mono text-content-faint group-hover:text-content-muted transition-colors">
                  {hex.toUpperCase()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
