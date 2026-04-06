'use client';

import type {
  CardConfig,
  ComponentSize,
  RadiusPreset,
  ShadowLevel,
  DesignConfig,
} from '@/lib/component-types';
import { hexToRGB } from '@/lib/colors';

function contrastColor(hex: string): string {
  const [r, g, b] = hexToRGB(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    ? '#000000'
    : '#ffffff';
}

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

export function CardOptions({
  config,
  onChange,
}: {
  config: CardConfig;
  onChange: (c: CardConfig) => void;
}) {
  const set = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <input
          value={config.title}
          onChange={(e) => set('title', e.target.value)}
          className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint"
        />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          value={config.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content resize-none focus:outline-none focus:ring-1 focus:ring-content-faint"
        />
      </div>

      <Toggle
        label="Image"
        checked={config.hasImage}
        onChange={(v) => set('hasImage', v)}
      />

      <Toggle
        label="Actions"
        checked={config.hasActions}
        onChange={(v) => set('hasActions', v)}
      />

      {config.hasActions && (
        <div>
          <Label>Action Label</Label>
          <input
            value={config.actionLabel}
            onChange={(e) => set('actionLabel', e.target.value)}
            className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint"
          />
        </div>
      )}

      <div>
        <Label>Shadow</Label>
        <ToggleGroup
          options={
            ['none', 'sm', 'md', 'lg', 'xl'] as ShadowLevel[]
          }
          value={config.shadow}
          onChange={(v) => set('shadow', v)}
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
        <Label>Radius</Label>
        <ToggleGroup
          options={
            ['none', 'sm', 'md', 'lg', 'full'] as RadiusPreset[]
          }
          value={config.radius}
          onChange={(v) => set('radius', v)}
        />
      </div>

      <Toggle
        label="Border"
        checked={config.hasBorder}
        onChange={(v) => set('hasBorder', v)}
      />
    </div>
  );
}

/* ─── PREVIEW ─── */

const SHADOW_VAL: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
};
const RAD: Record<string, string> = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};
const PAD: Record<string, number> = { sm: 16, md: 24, lg: 32 };

export function CardPreview({
  config,
  design,
}: {
  config: CardConfig;
  design: DesignConfig;
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: RAD[config.radius],
        boxShadow: SHADOW_VAL[config.shadow],
        overflow: 'hidden',
        border: config.hasBorder ? '1px solid #e4e4e7' : 'none',
        maxWidth: 340,
        width: '100%',
      }}
    >
      {config.hasImage && (
        <div
          style={{
            height: 180,
            background: `linear-gradient(135deg, ${design.primaryColor}18, ${design.primaryColor}40)`,
          }}
        />
      )}
      <div style={{ padding: PAD[config.padding] }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#18181b',
            marginBottom: 8,
            fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
          }}
        >
          {config.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: '#71717a',
            lineHeight: 1.6,
            marginBottom: config.hasActions ? 16 : 0,
          }}
        >
          {config.description}
        </p>
        {config.hasActions && (
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: design.primaryColor,
              color: contrastColor(design.primaryColor),
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {config.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
