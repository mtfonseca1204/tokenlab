'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Check,
  X,
  Search,
  Heart,
  Star,
  Download,
  Upload,
  Send,
  ChevronRight,
  ChevronDown,
  Zap,
  ShoppingCart,
} from 'lucide-react';
import type {
  ButtonConfig,
  ButtonVariant,
  ComponentSize,
  RadiusPreset,
  DesignConfig,
} from '@/lib/component-types';
import { hexToRGB } from '@/lib/colors';

export const ICON_MAP: Record<string, LucideIcon> = {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Check,
  X,
  Search,
  Heart,
  Star,
  Download,
  Upload,
  Send,
  ChevronRight,
  ChevronDown,
  Zap,
  ShoppingCart,
};

const VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
];
const SIZES: ComponentSize[] = ['sm', 'md', 'lg'];
const RADII: RadiusPreset[] = ['none', 'sm', 'md', 'lg', 'full'];

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

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  cols = options.length,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div
      className="grid gap-1 bg-surface-secondary/60 rounded-lg p-1"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
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

export function ButtonOptions({
  config,
  onChange,
}: {
  config: ButtonConfig;
  onChange: (c: ButtonConfig) => void;
}) {
  const set = <K extends keyof ButtonConfig>(
    key: K,
    value: ButtonConfig[K]
  ) => onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <Label>Label</Label>
        <input
          value={config.label}
          onChange={(e) => set('label', e.target.value)}
          className="w-full px-3 py-2 bg-surface-secondary border border-line rounded-lg text-sm text-content focus:outline-none focus:ring-1 focus:ring-content-faint"
        />
      </div>

      <div>
        <Label>Variant</Label>
        <ToggleGroup
          options={VARIANTS}
          value={config.variant}
          onChange={(v) => set('variant', v)}
          cols={3}
        />
      </div>

      <div>
        <Label>Size</Label>
        <ToggleGroup
          options={SIZES}
          value={config.size}
          onChange={(v) => set('size', v)}
        />
      </div>

      <div>
        <Label>Radius</Label>
        <ToggleGroup
          options={RADII}
          value={config.radius}
          onChange={(v) => set('radius', v)}
        />
      </div>

      <div>
        <Label>Icon</Label>
        <div className="grid grid-cols-7 gap-1 bg-surface-secondary/60 rounded-lg p-1.5">
          <button
            onClick={() => set('icon', null)}
            className={`p-1.5 rounded-md text-[10px] font-medium transition-all ${
              !config.icon
                ? 'bg-surface text-content shadow-sm'
                : 'text-content-muted hover:text-content'
            }`}
          >
            None
          </button>
          {Object.entries(ICON_MAP).map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => set('icon', name)}
              title={name}
              className={`p-1.5 rounded-md flex items-center justify-center transition-all ${
                config.icon === name
                  ? 'bg-surface text-content shadow-sm'
                  : 'text-content-muted hover:text-content'
              }`}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {config.icon && (
        <div>
          <Label>Icon Position</Label>
          <ToggleGroup
            options={['left', 'right'] as ('left' | 'right')[]}
            value={config.iconPosition}
            onChange={(v) => set('iconPosition', v)}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label>Full Width</Label>
        <button
          onClick={() => set('fullWidth', !config.fullWidth)}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            config.fullWidth ? 'bg-content' : 'bg-surface-secondary'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-surface shadow transition-transform ${
              config.fullWidth ? 'translate-x-4' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}

/* ─── PREVIEW ─── */

const PAD: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 12 },
  md: { padding: '8px 16px', fontSize: 14 },
  lg: { padding: '12px 24px', fontSize: 16 },
};
const RAD: Record<string, string> = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};

export function ButtonPreview({
  config,
  design,
}: {
  config: ButtonConfig;
  design: DesignConfig;
}) {
  const IconComp = config.icon ? ICON_MAP[config.icon] : null;
  const iconSz = { sm: 14, md: 16, lg: 18 }[config.size];

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
    border: 'none',
    borderRadius: RAD[config.radius],
    ...PAD[config.size],
  };

  switch (config.variant) {
    case 'primary':
      base.backgroundColor = design.primaryColor;
      base.color = contrastColor(design.primaryColor);
      break;
    case 'secondary':
      base.backgroundColor = `${design.primaryColor}1a`;
      base.color = design.primaryColor;
      break;
    case 'outline':
      base.backgroundColor = 'transparent';
      base.color = design.primaryColor;
      base.border = `1px solid ${design.primaryColor}4d`;
      break;
    case 'ghost':
      base.backgroundColor = 'transparent';
      base.color = design.primaryColor;
      break;
    case 'destructive':
      base.backgroundColor = '#ef4444';
      base.color = '#ffffff';
      break;
  }

  if (config.fullWidth) {
    base.width = '100%';
    base.maxWidth = '320px';
  }

  return (
    <button style={base}>
      {config.icon &&
        config.iconPosition === 'left' &&
        IconComp && <IconComp size={iconSz} />}
      {config.label}
      {config.icon &&
        config.iconPosition === 'right' &&
        IconComp && <IconComp size={iconSz} />}
    </button>
  );
}
