'use client';

import { useState, useEffect } from 'react';
import { TokenConfig, RadiusStyle } from '@/lib/types';
import { Sparkles } from 'lucide-react';

const FONT_OPTIONS = [
  'Inter',
  'Plus Jakarta Sans',
  'DM Sans',
  'Space Grotesk',
  'Outfit',
  'Manrope',
  'Sora',
  'Work Sans',
  'Poppins',
  'Nunito Sans',
  'Lato',
  'Roboto',
  'Source Sans 3',
  'IBM Plex Sans',
];

const SCALE_OPTIONS = [
  { name: 'Minor Second', value: 1.067 },
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.2 },
  { name: 'Major Third', value: 1.25 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Aug. Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.5 },
  { name: 'Golden Ratio', value: 1.618 },
];

const RADIUS_OPTIONS: { label: string; value: RadiusStyle }[] = [
  { label: 'Sharp', value: 'sharp' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Pill', value: 'pill' },
];

interface SidebarProps {
  config: TokenConfig;
  onChange: (config: TokenConfig) => void;
}

export function Sidebar({ config, onChange }: SidebarProps) {
  const update = (partial: Partial<TokenConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <aside className="w-[304px] border-r border-zinc-800/80 bg-zinc-900/40 overflow-y-auto flex-shrink-0">
      <div className="p-5 space-y-7">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sparkles size={14} />
          <span className="text-[11px] font-medium uppercase tracking-widest">
            Configuration
          </span>
        </div>

        <Section title="Brand">
          <Field label="Primary">
            <ColorInput
              value={config.primaryColor}
              onChange={(v) => update({ primaryColor: v })}
            />
          </Field>
          <Field label="Secondary">
            <ColorInput
              value={config.secondaryColor}
              onChange={(v) => update({ secondaryColor: v })}
            />
          </Field>
        </Section>

        <Section title="Typography">
          <Field label="Font Family">
            <select
              value={config.fontFamily}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type Scale">
            <select
              value={config.scaleRatio}
              onChange={(e) =>
                update({ scaleRatio: parseFloat(e.target.value) })
              }
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
            >
              {SCALE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.name} ({s.value})
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Base Size — ${config.baseFontSize}px`}>
            <input
              type="range"
              min={12}
              max={20}
              step={1}
              value={config.baseFontSize}
              onChange={(e) =>
                update({ baseFontSize: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </Field>
        </Section>

        <Section title="Layout">
          <Field label={`Base Spacing — ${config.baseSpacing}px`}>
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={config.baseSpacing}
              onChange={(e) =>
                update({ baseSpacing: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </Field>
          <Field label="Border Radius">
            <div className="flex bg-zinc-800/80 rounded-lg p-1 gap-0.5">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ radiusStyle: opt.value })}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    config.radiusStyle === opt.value
                      ? 'bg-zinc-600 text-zinc-50 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        <div className="pt-2 border-t border-zinc-800/60">
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Adjust the controls above to generate your design token system.
            Export as CSS, Tailwind, or JSON.
          </p>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (!v.startsWith('#')) v = '#' + v;
    setInputValue(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v.toLowerCase());
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-zinc-700/60 flex-shrink-0 shadow-sm">
        <input
          type="color"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setInputValue(e.target.value);
          }}
          className="absolute inset-0 w-[150%] h-[150%] -top-1 -left-1 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={inputValue.toUpperCase()}
        onChange={handleTextChange}
        maxLength={7}
        className="flex-1 bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent tracking-wide"
      />
    </div>
  );
}
