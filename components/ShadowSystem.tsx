'use client';

import { useState } from 'react';
import { ShadowStep } from '@/lib/types';
import { Copy, Check } from 'lucide-react';

interface ShadowSystemProps {
  steps: ShadowStep[];
}

export function ShadowSystem({ steps }: ShadowSystemProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-100 rounded-2xl p-8">
      <div className="flex items-end gap-5 justify-center flex-wrap">
        {steps.map((step) => (
          <button
            key={step.name}
            onClick={() => copy(step.value)}
            className="flex flex-col items-center gap-3 group focus:outline-none"
          >
            <div
              className="w-[88px] h-[88px] bg-white rounded-xl transition-transform duration-200 group-hover:scale-105"
              style={{ boxShadow: step.value }}
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-zinc-500 font-medium">
                {step.name}
              </span>
              {copied === step.value ? (
                <Check size={10} className="text-emerald-500" />
              ) : (
                <Copy
                  size={10}
                  className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
