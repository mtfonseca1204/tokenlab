'use client';

import { useEffect, useState } from 'react';
import { TypeStep } from '@/lib/types';
import { Copy, Check } from 'lucide-react';

interface TypographyScaleProps {
  steps: TypeStep[];
  fontFamily: string;
}

export function TypographyScale({ steps, fontFamily }: TypographyScaleProps) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const id = 'tokenlab-font';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
  }, [fontFamily]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  const displaySteps = [...steps].reverse();

  return (
    <div className="rounded-xl border border-line overflow-hidden">
      {displaySteps.map((step, i) => (
        <div
          key={step.name}
          className={`group flex items-baseline gap-5 py-3.5 px-5 hover:bg-surface-tertiary/50 transition-colors ${
            i < displaySteps.length - 1 ? 'border-b border-line-subtle' : ''
          }`}
        >
          <div className="w-12 flex-shrink-0">
            <span className="text-[11px] font-mono text-content-muted font-medium">
              {step.name}
            </span>
          </div>
          <div
            className="flex-1 min-w-0 truncate"
            style={{ fontFamily: `'${fontFamily}', system-ui, sans-serif` }}
          >
            <span
              className="text-content"
              style={{
                fontSize: step.size,
                fontWeight: step.weight,
                lineHeight: step.lineHeight,
                letterSpacing: step.letterSpacing,
              }}
            >
              Design Tokens
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[11px] font-mono text-content-faint">
              {step.sizePx}px
            </span>
            <span className="text-[11px] font-mono text-content-faint">
              {step.weight}
            </span>
            <button
              onClick={() => copy(step.size)}
              className="text-content-faint hover:text-content transition-colors"
            >
              {copied === step.size ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
