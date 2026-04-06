'use client';

import { SpacingStep } from '@/lib/types';

interface SpacingScaleProps {
  steps: SpacingStep[];
  primaryColor: string;
}

export function SpacingScale({ steps, primaryColor }: SpacingScaleProps) {
  const visible = steps.filter((s) => s.px > 0 && s.px <= 96);

  return (
    <div className="rounded-xl border border-zinc-800/60 overflow-hidden divide-y divide-zinc-800/40">
      {visible.map((step) => (
        <div
          key={step.name}
          className="flex items-center gap-4 py-2.5 px-5 group hover:bg-zinc-800/20 transition-colors"
        >
          <span className="w-8 text-right text-[11px] font-mono text-zinc-500 font-medium">
            {step.name}
          </span>
          <div className="flex-1 flex items-center">
            <div
              className="h-3.5 rounded-sm transition-all duration-300"
              style={{
                width: Math.max(2, step.px * 2.5),
                backgroundColor: primaryColor,
                opacity: 0.6,
                transition:
                  'width 300ms ease, background-color 200ms ease',
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity w-28 text-right">
            {step.px}px · {step.value}
          </span>
        </div>
      ))}
    </div>
  );
}
