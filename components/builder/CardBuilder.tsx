'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type {
  CardConfig,
  ComponentSize,
  RadiusPreset,
  ShadowLevel,
  DesignConfig,
  GradientConfig,
} from '@/lib/component-types';
import { GRADIENT_DIRECTIONS } from '@/lib/component-types';
import { GradientControls } from './ButtonBuilder';
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

const FOCAL_PRESETS: { label: string; x: number; y: number }[] = [
  { label: '↖', x: 0, y: 0 },
  { label: '↑', x: 50, y: 0 },
  { label: '↗', x: 100, y: 0 },
  { label: '←', x: 0, y: 50 },
  { label: '◎', x: 50, y: 50 },
  { label: '→', x: 100, y: 50 },
  { label: '↙', x: 0, y: 100 },
  { label: '↓', x: 50, y: 100 },
  { label: '↘', x: 100, y: 100 },
];

export function CardOptions({
  config,
  onChange,
}: {
  config: CardConfig;
  onChange: (c: CardConfig) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) =>
    onChange({ ...config, [key]: value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result ?? '');
      if (data) onChange({ ...config, imageUrl: data });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const focalX = config.imageFocalX ?? 50;
  const focalY = config.imageFocalY ?? 50;

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

      {config.hasImage && (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <div>
            <Label>Image</Label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-surface-secondary border border-line border-dashed rounded-lg text-sm font-medium text-content hover:bg-surface-tertiary/80 transition-colors"
            >
              <Upload size={16} className="text-content-muted" />
              Upload from computer
            </button>
          </div>
          <div>
            <Label>Or paste URL</Label>
            <div className="flex gap-1.5">
              <input
                value={
                  config.imageUrl.startsWith('data:')
                    ? ''
                    : config.imageUrl
                }
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 min-w-0 px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint placeholder:text-content-faint"
              />
              {config.imageUrl ? (
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => onChange({ ...config, imageUrl: '' })}
                  className="flex-shrink-0 p-2 rounded-lg border border-line text-content-muted hover:text-content hover:bg-surface-secondary transition-colors"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
            {config.imageUrl.startsWith('data:') ? (
              <p className="text-[10px] text-content-faint mt-1">
                Using uploaded file — clear with × to switch to URL or gradient.
              </p>
            ) : null}
          </div>

          {config.imageUrl ? (
            <div>
              <Label>Focal point</Label>
              <p className="text-[10px] text-content-faint mb-2 leading-snug">
                Click the preview or use sliders — controls what stays in frame
                with cover crop.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = Math.round(
                    ((e.clientX - rect.left) / rect.width) * 100
                  );
                  const y = Math.round(
                    ((e.clientY - rect.top) / rect.height) * 100
                  );
                  onChange({ ...config, imageFocalX: x, imageFocalY: y });
                }}
                className="relative w-full h-24 rounded-lg overflow-hidden border border-line cursor-crosshair group mb-3"
              >
                <img
                  src={config.imageUrl}
                  alt=""
                  className="w-full h-full pointer-events-none"
                  style={{
                    objectFit: 'cover',
                    objectPosition: `${focalX}% ${focalY}%`,
                  }}
                />
                <span
                  className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md bg-content/20 pointer-events-none"
                  style={{
                    left: `${focalX}%`,
                    top: `${focalY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </button>
              <div className="grid grid-cols-3 gap-1 mb-3">
                {FOCAL_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    title={`${p.x}% ${p.y}%`}
                    onClick={() =>
                      onChange({
                        ...config,
                        imageFocalX: p.x,
                        imageFocalY: p.y,
                      })
                    }
                    className={`py-1.5 text-xs rounded-md border transition-colors ${
                      focalX === p.x && focalY === p.y
                        ? 'border-content bg-surface-secondary text-content'
                        : 'border-line text-content-muted hover:text-content hover:bg-surface-secondary/50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-content-faint w-14 shrink-0">
                    Horizontal
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={focalX}
                    onChange={(e) =>
                      set('imageFocalX', Number(e.target.value))
                    }
                    className="flex-1 accent-content h-1.5"
                  />
                  <span className="text-[10px] font-mono text-content-faint w-8">
                    {focalX}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-content-faint w-14 shrink-0">
                    Vertical
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={focalY}
                    onChange={(e) =>
                      set('imageFocalY', Number(e.target.value))
                    }
                    className="flex-1 accent-content h-1.5"
                  />
                  <span className="text-[10px] font-mono text-content-faint w-8">
                    {focalY}%
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="pt-2 border-t border-line">
        <div className="flex items-center justify-between mb-2">
          <Label>Gradient Cover</Label>
          <button
            onClick={() =>
              set('gradientBg', {
                ...config.gradientBg,
                enabled: !config.gradientBg.enabled,
              })
            }
            className={`relative w-9 h-5 rounded-full transition-colors ${
              config.gradientBg.enabled ? 'bg-content' : 'bg-surface-secondary'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface shadow transition-transform ${
                config.gradientBg.enabled ? 'translate-x-4' : ''
              }`}
            />
          </button>
        </div>
        {config.gradientBg.enabled && (
          <GradientControls
            value={config.gradientBg}
            onChange={(g) => set('gradientBg', g)}
          />
        )}
      </div>

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
      {config.gradientBg.enabled ? (
        <div
          style={{
            height: 180,
            background: `linear-gradient(${config.gradientBg.direction}, ${config.gradientBg.from}, ${config.gradientBg.to})`,
          }}
        />
      ) : config.hasImage && config.imageUrl ? (
        <img
          src={config.imageUrl}
          alt=""
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            objectPosition: `${config.imageFocalX ?? 50}% ${config.imageFocalY ?? 50}%`,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : config.hasImage ? (
        <div
          style={{
            height: 180,
            background: `linear-gradient(135deg, ${design.primaryColor}18, ${design.primaryColor}40)`,
          }}
        />
      ) : null}
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
