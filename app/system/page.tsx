'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Download,
  ChevronRight,
  ArrowRight,
  Plus,
  Heart,
} from 'lucide-react';
import type { DesignConfig } from '@/lib/component-types';
import { DEFAULT_DESIGN } from '@/lib/component-types';
import type {
  GeneratedTokens,
  TokenConfig,
  ColorScale,
  ColorShade,
} from '@/lib/types';
import { generateAllTokens } from '@/lib/tokens';
import { hexToRGB } from '@/lib/colors';
import { generateSystemHTML } from '@/lib/export-system';

const SHADES: ColorShade[] = [
  '50', '100', '200', '300', '400', '500',
  '600', '700', '800', '900', '950',
];

function contrast(hex: string): string {
  const [r, g, b] = hexToRGB(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    ? '#000000'
    : '#ffffff';
}

function SectionHeader({
  id,
  num,
  title,
  desc,
}: {
  id: string;
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div id={id} className="pt-12 mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-sm font-mono text-content-faint">{num}</span>
        <h2 className="text-2xl font-bold text-content tracking-tight">
          {title}
        </h2>
      </div>
      <div className="h-px bg-line mb-4" />
      <p className="text-sm text-content-muted leading-relaxed max-w-[560px]">
        {desc}
      </p>
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold text-content-muted uppercase tracking-widest mb-3 mt-8">
      {children}
    </h3>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-4 border border-line rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold text-content-muted uppercase tracking-wider hover:bg-surface-secondary/50 transition-colors"
      >
        <span>Implementation Reference</span>
        <ChevronRight
          size={12}
          className={`transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="relative border-t border-line bg-surface-secondary/30">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="absolute top-2 right-2 text-[10px] text-content-faint hover:text-content px-2 py-1 rounded bg-surface-secondary"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre className="p-4 text-[12px] font-mono text-content-secondary leading-relaxed overflow-x-auto max-h-[280px]">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'cards', label: 'Cards' },
  { id: 'modals', label: 'Modals' },
  { id: 'containers', label: 'Containers' },
];

export default function SystemPage() {
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);
  const [tokens, setTokens] = useState<GeneratedTokens | null>(null);
  const [active, setActive] = useState('colors');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tokenlab-design');
      if (saved) setDesign(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    const config: TokenConfig = {
      primaryColor: design.primaryColor,
      secondaryColor: design.secondaryColor,
      fontFamily: design.fontFamily,
      scaleRatio: 1.25,
      baseFontSize: 16,
      baseSpacing: 4,
      radiusStyle: 'rounded',
    };
    setTokens(generateAllTokens(config));
  }, [design]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const sects = NAV_ITEMS.map((n) => document.getElementById(n.id));
      for (let i = sects.length - 1; i >= 0; i--) {
        const s = sects[i];
        if (s && s.getBoundingClientRect().top <= 140) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const handleExportHTML = () => {
    if (!tokens) return;
    const html = generateSystemHTML(tokens, design);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-system.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!tokens) return null;

  const pc = design.primaryColor;
  const sc = design.secondaryColor;
  const grad = `linear-gradient(to right, ${pc}, ${sc})`;
  const txtP = contrast(pc);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* ─── Sidebar ─── */}
      <aside className="w-52 border-r border-line flex-shrink-0 flex flex-col print:hidden">
        <div className="p-4 border-b border-line">
          <h3 className="text-[11px] font-semibold text-content-muted uppercase tracking-widest">
            Contents
          </h3>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`block px-3 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                active === id
                  ? 'bg-surface-secondary text-content'
                  : 'text-content-muted hover:text-content'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="p-3 border-t border-line space-y-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2">
              <span className="text-[10px] text-content-faint w-14">
                Primary
              </span>
              <input
                type="color"
                value={pc}
                onChange={(e) =>
                  setDesign({ ...design, primaryColor: e.target.value })
                }
                className="w-5 h-5 rounded border border-line cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[10px] text-content-faint w-14">
                Secondary
              </span>
              <input
                type="color"
                value={sc}
                onChange={(e) =>
                  setDesign({ ...design, secondaryColor: e.target.value })
                }
                className="w-5 h-5 rounded border border-line cursor-pointer"
              />
            </label>
          </div>
          <button
            onClick={handleExportHTML}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold bg-surface-secondary hover:bg-surface-tertiary text-content rounded-lg transition-colors"
          >
            <Download size={13} /> Export HTML
          </button>
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-semibold bg-surface-invert text-content-invert rounded-lg hover:opacity-90 transition-all"
          >
            <Printer size={13} /> Print / PDF
          </button>
        </div>
      </aside>

      {/* ─── Document ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto print:overflow-visible"
      >
        <div className="max-w-[820px] px-10 py-10 print:px-0 print:py-0">
          {/* Cover */}
          <div className="mb-10 pb-8 border-b border-line print:mb-6 print:pb-4">
            <h1 className="text-4xl font-extrabold text-content tracking-tight mb-1">
              Design System
            </h1>
            <p className="text-sm text-content-muted mb-5">
              {design.fontFamily} &middot; Generated with TokenLab &middot;{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div
              className="h-1.5 rounded-full max-w-[180px] mb-6"
              style={{ background: grad }}
            />
            <div className="grid grid-cols-2 gap-x-12 gap-y-1.5 text-sm max-w-md">
              {[
                ['Primary Color', pc],
                ['Secondary Color', sc],
                ['Font Family', design.fontFamily],
                ['Type Scale', '1.25 (Major Third)'],
                ['Base Size', '16px'],
                ['Spacing Unit', '4px'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="text-content-muted">{label}</span>
                  <span className="text-content font-semibold font-mono text-xs">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 01 COLORS ── */}
          <SectionHeader
            id="colors"
            num="01"
            title="Color Palette"
            desc="The color system defines primary, secondary, and semantic palettes. Each color has 11 shades (50–950) for flexible usage across backgrounds, text, borders, and interactive states."
          />
          {(
            [
              'primary',
              'secondary',
              'neutral',
              'success',
              'warning',
              'error',
            ] as const
          ).map((name) => (
            <div key={name} className="mb-7">
              <h3 className="text-sm font-semibold text-content capitalize mb-2">
                {name}
              </h3>
              <div className="flex gap-[2px] mb-1">
                {SHADES.map((shade) => {
                  const hex = (tokens.colors[name] as ColorScale)[shade];
                  return (
                    <div
                      key={shade}
                      className="flex-1 h-10 first:rounded-l-lg last:rounded-r-lg"
                      style={{ backgroundColor: hex }}
                      title={`${shade}: ${hex}`}
                    />
                  );
                })}
              </div>
              <div className="flex gap-[2px]">
                {SHADES.map((shade) => {
                  const hex = (tokens.colors[name] as ColorScale)[shade];
                  return (
                    <div key={shade} className="flex-1">
                      <div className="text-[9px] text-content-faint">
                        {shade}
                      </div>
                      <div className="text-[8px] text-content-faint/60 font-mono">
                        {hex}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ── 02 TYPOGRAPHY ── */}
          <SectionHeader
            id="typography"
            num="02"
            title="Typography Scale"
            desc="A modular type scale based on a 1.25 ratio (Major Third) with a 16px base. Each step includes recommended weight, line-height, and letter-spacing for optimal readability."
          />
          <div className="border border-line rounded-xl overflow-hidden mb-2">
            <div className="grid grid-cols-[52px_1fr_64px_52px_60px_60px] bg-surface-secondary/60 px-4 py-2.5 border-b border-line">
              {['Name', 'Sample', 'Size', 'Weight', 'Height', 'Spacing'].map(
                (h) => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold text-content-muted uppercase tracking-wider"
                  >
                    {h}
                  </span>
                )
              )}
            </div>
            {[...tokens.typography].reverse().map((step, i) => (
              <div
                key={step.name}
                className={`grid grid-cols-[52px_1fr_64px_52px_60px_60px] px-4 py-3 items-baseline ${
                  i > 0 ? 'border-t border-line-subtle' : ''
                }`}
              >
                <span className="text-[11px] font-bold text-content-muted">
                  {step.name}
                </span>
                <span
                  className="text-content truncate pr-4"
                  style={{
                    fontSize: Math.min(step.sizePx, 38),
                    fontWeight: step.weight,
                    lineHeight: step.lineHeight,
                    fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                  }}
                >
                  The quick brown fox
                </span>
                <span className="text-[11px] font-mono text-content-faint">
                  {step.sizePx}px
                </span>
                <span className="text-[11px] text-content-faint">
                  {step.weight}
                </span>
                <span className="text-[11px] text-content-faint">
                  {step.lineHeight}
                </span>
                <span className="text-[11px] font-mono text-content-faint">
                  {step.letterSpacing}
                </span>
              </div>
            ))}
          </div>

          {/* ── 03 SPACING ── */}
          <SectionHeader
            id="spacing"
            num="03"
            title="Spacing Scale"
            desc="Consistent spacing creates rhythm and hierarchy. Built on a 4px base unit, the scale covers micro-adjustments through large layout gaps."
          />
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 mb-2">
            {tokens.spacing
              .filter((s) => s.px > 0 && s.px <= 96)
              .map((step) => (
                <div
                  key={step.name}
                  className="flex items-center gap-3 py-1"
                >
                  <span className="w-8 text-[11px] font-bold text-content-muted text-right">
                    {step.name}
                  </span>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: Math.min(step.px * 2.5, 220),
                      backgroundColor: pc,
                      opacity: 0.5,
                    }}
                  />
                  <span className="text-[11px] text-content-faint font-mono">
                    {step.px}px / {step.value}
                  </span>
                </div>
              ))}
          </div>

          {/* ── 04 BUTTONS ── */}
          <SectionHeader
            id="buttons"
            num="04"
            title="Buttons"
            desc="Button components provide clear interactive affordance. Use variants for visual hierarchy, sizes for context, and gradients for emphasis on primary actions."
          />

          <SubTitle>Variants</SubTitle>
          <div className="flex flex-wrap gap-3 mb-2">
            {[
              { l: 'Primary', bg: pc, c: txtP, b: 'none' },
              { l: 'Secondary', bg: `${pc}1a`, c: pc, b: 'none' },
              { l: 'Outline', bg: 'transparent', c: pc, b: `1px solid ${pc}4d` },
              { l: 'Ghost', bg: 'transparent', c: pc, b: 'none' },
              { l: 'Destructive', bg: '#ef4444', c: '#fff', b: 'none' },
            ].map((v) => (
              <span
                key={v.l}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  backgroundColor: v.bg,
                  color: v.c,
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 8,
                  border: v.b,
                  fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                }}
              >
                {v.l}
              </span>
            ))}
          </div>

          <SubTitle>Gradient</SubTitle>
          <div className="flex flex-wrap gap-3 mb-2">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 20px',
                background: grad,
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              Gradient Button
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 20px',
                background: `linear-gradient(to bottom right, ${pc}, ${sc})`,
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 9999,
              }}
            >
              Pill Gradient
            </span>
          </div>

          <SubTitle>Sizes</SubTitle>
          <div className="flex items-end gap-3 mb-2">
            {[
              { l: 'Small', p: '6px 12px', fs: 12 },
              { l: 'Medium', p: '8px 16px', fs: 14 },
              { l: 'Large', p: '12px 24px', fs: 16 },
            ].map((s) => (
              <span
                key={s.l}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: s.p,
                  backgroundColor: pc,
                  color: txtP,
                  fontSize: s.fs,
                  fontWeight: 500,
                  borderRadius: 8,
                }}
              >
                {s.l}
              </span>
            ))}
          </div>

          <SubTitle>With Icons</SubTitle>
          <div className="flex flex-wrap gap-3 mb-2">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                backgroundColor: pc,
                color: txtP,
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              Next <ArrowRight size={16} />
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                backgroundColor: `${pc}1a`,
                color: pc,
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              <Plus size={16} /> Create
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                background: grad,
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              <Heart size={16} /> Favorite
            </span>
          </div>

          <CodeBlock
            code={`// Primary\n<button className="inline-flex items-center gap-2 px-4 py-2 bg-[${pc}] text-${txtP === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg hover:opacity-90 transition-all">\n  Label <ArrowRight size={16} />\n</button>\n\n// Gradient\n<button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[${pc}] to-[${sc}] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">\n  Label\n</button>`}
          />

          {/* ── 05 CARDS ── */}
          <SectionHeader
            id="cards"
            num="05"
            title="Cards"
            desc="Cards group related content and actions. Support for images, gradient covers, and action buttons makes them versatile across dashboards, marketing pages, and content feeds."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            {[
              {
                t: 'Basic Card',
                d: 'Standard card with a subtle tinted placeholder.',
                img: `linear-gradient(135deg, ${pc}18, ${pc}40)`,
              },
              {
                t: 'Gradient Card',
                d: 'Uses primary-to-secondary gradient as a cover.',
                img: `linear-gradient(to right, ${pc}, ${sc})`,
              },
              {
                t: 'Action Card',
                d: 'Includes a call-to-action button.',
                img: `linear-gradient(to bottom right, ${sc}30, ${pc}30)`,
                action: true,
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #e4e4e7',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
                }}
              >
                <div style={{ height: 140, background: c.img }} />
                <div style={{ padding: 20 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#18181b',
                      marginBottom: 6,
                      fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                    }}
                  >
                    {c.t}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#71717a',
                      lineHeight: 1.5,
                      marginBottom: c.action ? 14 : 0,
                    }}
                  >
                    {c.d}
                  </p>
                  {c.action && (
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '6px 14px',
                        backgroundColor: pc,
                        color: txtP,
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 8,
                      }}
                    >
                      Learn More
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <CodeBlock
            code={`<div className="bg-white rounded-xl shadow-md overflow-hidden border border-zinc-200 max-w-sm">\n  <img src="..." alt="" className="w-full h-48 object-cover" />\n  {/* Or gradient: */}\n  {/* <div className="h-48 bg-gradient-to-r from-[${pc}] to-[${sc}]" /> */}\n  <div className="p-6">\n    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Title</h3>\n    <p className="text-sm text-zinc-500 leading-relaxed">Description</p>\n    <button className="mt-4 px-4 py-2 bg-[${pc}] text-${txtP === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg">\n      Action\n    </button>\n  </div>\n</div>`}
          />

          {/* ── 06 MODALS ── */}
          <SectionHeader
            id="modals"
            num="06"
            title="Modals"
            desc="Modal dialogs interrupt the user flow for confirmations, alerts, or focused tasks. Available in multiple widths. Always include a clear dismiss action."
          />
          {[
            { l: 'Small Dialog', w: 340 },
            { l: 'Medium Dialog', w: 440 },
          ].map((m) => (
            <div
              key={m.l}
              className="mb-4"
              style={{
                background: '#52525b',
                borderRadius: 12,
                padding: 32,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  borderRadius: 12,
                }}
              />
              <div
                style={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: 16,
                  padding: 24,
                  maxWidth: m.w,
                  margin: '0 auto',
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#18181b',
                    marginBottom: 8,
                    fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                  }}
                >
                  {m.l}
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: '#71717a',
                    lineHeight: 1.6,
                  }}
                >
                  Are you sure you want to proceed? This action cannot be
                  undone.
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <span
                    style={{
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#52525b',
                      borderRadius: 8,
                    }}
                  >
                    Cancel
                  </span>
                  <span
                    style={{
                      padding: '8px 16px',
                      backgroundColor: pc,
                      color: txtP,
                      fontSize: 14,
                      fontWeight: 500,
                      borderRadius: 8,
                    }}
                  >
                    Confirm
                  </span>
                </div>
              </div>
            </div>
          ))}
          <CodeBlock
            code={`export function Modal({ open, onClose }) {\n  if (!open) return null;\n  return (\n    <div className="fixed inset-0 z-50 flex items-center justify-center">\n      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />\n      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">\n        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Title</h2>\n        <p className="text-sm text-zinc-500 leading-relaxed">Body text</p>\n        <div className="flex justify-end gap-3 mt-6">\n          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-600 rounded-lg">Cancel</button>\n          <button className="px-4 py-2 bg-[${pc}] text-${txtP === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg">Confirm</button>\n        </div>\n      </div>\n    </div>\n  );\n}`}
          />

          {/* ── 07 CONTAINERS ── */}
          <SectionHeader
            id="containers"
            num="07"
            title="Containers"
            desc="Container components constrain content width and provide consistent padding. Use background variations — light, dark, and gradient — to create visual hierarchy between page sections."
          />
          {[
            {
              l: 'Light Container',
              d: 'Use for secondary content sections or subtle separation between page areas.',
              bg: '#f4f4f5',
              t: '#18181b',
              s: '#71717a',
              bar: '#d4d4d8',
            },
            {
              l: 'Dark Container',
              d: 'Use for high-contrast sections like footers, CTAs, or feature highlights.',
              bg: '#18181b',
              t: '#f4f4f5',
              s: '#a1a1aa',
              bar: 'rgba(255,255,255,0.12)',
            },
            {
              l: 'Gradient Container',
              d: 'Use for hero sections, promotional banners, or key call-to-action areas.',
              bg: grad,
              t: '#fff',
              s: 'rgba(255,255,255,0.75)',
              bar: 'rgba(255,255,255,0.15)',
              isGrad: true,
            },
          ].map((c) => (
            <div
              key={c.l}
              className="mb-4"
              style={{
                ...(c.isGrad
                  ? { background: c.bg }
                  : { backgroundColor: c.bg }),
                borderRadius: 12,
                padding: 28,
              }}
            >
              <h4
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: c.t,
                  marginBottom: 8,
                  fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                }}
              >
                {c.l}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: c.s,
                  lineHeight: 1.6,
                }}
              >
                {c.d}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    height: 8,
                    width: '55%',
                    backgroundColor: c.bar,
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    height: 8,
                    width: '30%',
                    backgroundColor: c.bar,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
          <CodeBlock
            code={`// Gradient Container\n<div className="max-w-3xl mx-auto px-6 py-8 bg-gradient-to-r from-[${pc}] to-[${sc}] text-white rounded-xl">\n  {children}\n</div>\n\n// Dark Container\n<div className="max-w-3xl mx-auto px-6 py-8 bg-zinc-900 text-white rounded-xl">\n  {children}\n</div>`}
          />

          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}
