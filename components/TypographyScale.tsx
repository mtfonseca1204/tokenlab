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
    <div className="rounded-xl border border-zinc-800/60 overflow-hidden">
      {displaySteps.map((step, i) => (
        <div
          key={step.name}
          className={`group flex items-baseline gap-5 py-3.5 px-5 hover:bg-zinc-800/30 transition-colors ${
            i < displaySteps.length - 1 ? 'border-b border-zinc-800/40' : ''
          }`}
        >
          <div className="w-12 flex-shrink-0">
            <span className="text-[11px] font-mono text-zinc-500 font-medium">
              {step.name}
            </span>
          </div>
          <div
            className="flex-1 min-w-0 truncate"
            style={{ fontFamily: `'${fontFamily}', system-ui, sans-serif` }}
          >
            <span
              className="text-zinc-200"
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
            <span className="text-[11px] font-mono text-zinc-600">
              {step.sizePx}px
            </span>
            <span className="text-[11px] font-mono text-zinc-700">
              {step.weight}
            </span>
            <button
              onClick={() => copy(step.size)}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              {copied === step.size ? (
                <Check size={12} className="text-emerald-400" />
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
