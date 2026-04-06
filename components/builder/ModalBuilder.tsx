'use client';

import type {
  ModalConfig,
  ComponentSize,
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
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="grid gap-1 bg-surface-secondary/60 rounded-lg p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
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

export function ModalOptions({
  config,
  onChange,
}: {
  config: ModalConfig;
  onChange: (c: ModalConfig) => void;
}) {
  const set = <K extends keyof ModalConfig>(key: K, value: ModalConfig[K]) =>
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
        <Label>Body</Label>
        <textarea
          value={config.body}
          onChange={(e) => set('body', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content resize-none focus:outline-none focus:ring-1 focus:ring-content-faint"
        />
      </div>

      <div>
        <Label>Size</Label>
        <ToggleGroup
          options={['sm', 'md', 'lg'] as ComponentSize[]}
          value={config.size}
          onChange={(v) => set('size', v)}
        />
      </div>

      <Toggle
        label="Footer"
        checked={config.hasFooter}
        onChange={(v) => set('hasFooter', v)}
      />

      {config.hasFooter && (
        <>
          <div>
            <Label>Confirm Label</Label>
            <input
              value={config.confirmLabel}
              onChange={(e) => set('confirmLabel', e.target.value)}
              className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint"
            />
          </div>
          <div>
            <Label>Cancel Label</Label>
            <input
              value={config.cancelLabel}
              onChange={(e) => set('cancelLabel', e.target.value)}
              className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint"
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PREVIEW ─── */

const MODAL_W: Record<string, number> = { sm: 340, md: 440, lg: 560 };

export function ModalPreview({
  config,
  design,
}: {
  config: ModalConfig;
  design: DesignConfig;
}) {
  const mw = MODAL_W[config.size];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        height: 400,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#71717a',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: mw,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#18181b',
            marginBottom: 8,
            fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
          }}
        >
          {config.title}
        </h2>
        <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>
          {config.body}
        </p>
        {config.hasFooter && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: '#52525b',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {config.cancelLabel}
            </button>
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
              {config.confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
