'use client';

import { useState } from 'react';
import { RadiusStep } from '@/lib/types';
import { Copy, Check } from 'lucide-react';

interface RadiusSystemProps {
  steps: RadiusStep[];
  primaryColor: string;
}

export function RadiusSystem({ steps, primaryColor }: RadiusSystemProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex items-end gap-4 flex-wrap">
      {steps.map((step) => (
        <button
          key={step.name}
          onClick={() => copy(step.value)}
          className="flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div
            className="w-16 h-16 border-2 transition-all duration-300 group-hover:scale-110"
            style={{
              borderRadius: step.value,
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}12`,
              transition:
                'border-radius 300ms ease, border-color 200ms ease, background-color 200ms ease, transform 150ms ease',
            }}
          />
          <span className="text-xs font-mono text-content-secondary font-medium">
            {step.name}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-content-faint">
              {step.value}
            </span>
            {copied === step.value ? (
              <Check size={8} className="text-emerald-500" />
            ) : (
              <Copy
                size={8}
                className="text-content-faint opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
