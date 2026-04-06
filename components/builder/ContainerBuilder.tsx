'use client';

import type {
  ContainerConfig,
  ComponentSize,
  DesignConfig,
} from '@/lib/component-types';
import { GradientControls } from './ButtonBuilder';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-content' : 'bg-surface-secondary'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </div>
  );
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  cols,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div
      className="grid gap-1 bg-surface-secondary/60 rounded-lg p-1"
      style={{ gridTemplateColumns: `repeat(${cols ?? options.length}, 1fr)` }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2 py-1.5 text-[11px] font-medium rounded-md capitalize transition-all ${
            value === opt
              ? 'bg-surface text-content shadow-sm'
              : 'text-content-muted hover:text-content'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── OPTIONS ─── */

type MaxW = ContainerConfig['maxWidth'];
type BG = ContainerConfig['background'];

export function ContainerOptions({
  config,
  onChange,
}: {
  config: ContainerConfig;
  onChange: (c: ContainerConfig) => void;
}) {
  const set = <K extends keyof ContainerConfig>(
    key: K,
    value: ContainerConfig[K]
  ) => onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <Label>Max Width</Label>
        <ToggleGroup
          options={['sm', 'md', 'lg', 'xl', 'full'] as MaxW[]}
          value={config.maxWidth}
          onChange={(v) => set('maxWidth', v)}
        />
      </div>

      <div>
        <Label>Padding</Label>
        <ToggleGroup
          options={['sm', 'md', 'lg'] as ComponentSize[]}
          value={config.padding}
          onChange={(v) => set('padding', v)}
        />
      </div>

      <div>
        <Label>Background</Label>
        <ToggleGroup
          options={
            ['transparent', 'white', 'light', 'dark', 'gradient'] as BG[]
          }
          value={config.background}
          onChange={(v) => set('background', v)}
          cols={3}
        />
      </div>

      {config.background === 'gradient' && (
        <GradientControls
          value={config.gradientBg}
          onChange={(g) => set('gradientBg', { ...g, enabled: true })}
        />
      )}

      <Toggle
        label="Border"
        checked={config.hasBorder}
        onChange={(v) => set('hasBorder', v)}
      />
    </div>
  );
}

/* ─── PREVIEW ─── */

const MAXW: Record<string, number> = {
  sm: 260,
  md: 320,
  lg: 480,
  xl: 580,
  full: 9999,
};
const PAD: Record<string, number> = { sm: 16, md: 24, lg: 32 };
const BG_MAP: Record<string, string> = {
  transparent: 'transparent',
  white: '#ffffff',
  light: '#f4f4f5',
  dark: '#18181b',
};

export function ContainerPreview({
  config,
  design,
}: {
  config: ContainerConfig;
  design: DesignConfig;
}) {
  const isDark = config.background === 'dark' || config.background === 'gradient';
  const textColor = isDark ? '#f4f4f5' : '#18181b';
  const subColor = isDark ? '#a1a1aa' : '#71717a';
  const barColor = isDark ? 'rgba(255,255,255,0.15)' : '#e4e4e7';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 640,
        backgroundColor: '#d4d4d8',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: Math.min(MAXW[config.maxWidth], 580),
          margin: '0 auto',
          padding: PAD[config.padding],
          ...(config.background === 'gradient'
            ? { background: `linear-gradient(${config.gradientBg.direction}, ${config.gradientBg.from}, ${config.gradientBg.to})` }
            : { backgroundColor: BG_MAP[config.background] }),
          border: config.hasBorder ? '1px solid #d4d4d8' : 'none',
          borderRadius: 8,
          transition: 'all 0.2s',
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: textColor,
            marginBottom: 12,
            fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
          }}
        >
          Section Title
        </h3>
        <p
          style={{
            fontSize: 14,
            color: subColor,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          This is an example of content inside the container. The container
          constrains the width and adds consistent padding around the content
          area.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              height: 8,
              width: '60%',
              backgroundColor: barColor,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 8,
              width: '30%',
              backgroundColor: barColor,
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}
