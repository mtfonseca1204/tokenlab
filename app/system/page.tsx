'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Download,
  ChevronRight,
  ArrowRight,
  Plus,
  Heart,
  Check,
} from 'lucide-react';
import type { DesignConfig } from '@/lib/component-types';
import { DEFAULT_DESIGN } from '@/lib/component-types';
import type { GeneratedTokens, TokenConfig, ColorScale, ColorShade } from '@/lib/types';
import { generateAllTokens } from '@/lib/tokens';
import { hexToRGB } from '@/lib/colors';

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

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold text-content mb-6 pt-10 border-t border-line"
    >
      {children}
    </h2>
  );
}

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-xs text-content-muted">{label}</span>
      <span className="text-xs font-mono text-content-secondary">{value}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-3 border border-line rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium text-content-muted hover:bg-surface-secondary/50 transition-colors"
      >
        <span>View Code</span>
        <ChevronRight
          size={12}
          className={`transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="relative border-t border-line">
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-[10px] text-content-faint hover:text-content px-2 py-1 rounded bg-surface-secondary/80"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre className="p-3 text-[11px] font-mono text-content-secondary leading-relaxed overflow-x-auto max-h-[240px]">
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tokenlab-design');
      if (saved) {
        const d = JSON.parse(saved);
        setDesign(d);
      }
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
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s && s.getBoundingClientRect().top <= 120) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const handlePrint = () => window.print();

  const handleExportHTML = () => {
    if (!contentRef.current) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Design System — TokenLab</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${design.fontFamily}, system-ui, sans-serif; color: #18181b; background: #fff; line-height: 1.6; padding: 48px; max-width: 960px; margin: 0 auto; }
  h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
  h2 { font-size: 22px; font-weight: 700; margin: 48px 0 20px; padding-top: 32px; border-top: 1px solid #e4e4e7; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 8px; text-transform: capitalize; }
  .subtitle { font-size: 14px; color: #71717a; margin-bottom: 32px; }
  .swatches { display: flex; gap: 2px; margin-bottom: 4px; }
  .swatch { flex: 1; height: 36px; border-radius: 4px; }
  .shade-labels { display: flex; gap: 2px; margin-bottom: 16px; }
  .shade-labels span { flex: 1; font-size: 9px; color: #a1a1aa; }
  .type-row { display: flex; align-items: baseline; gap: 16px; padding: 8px 0; border-bottom: 1px solid #f4f4f5; }
  .type-name { width: 48px; font-size: 11px; font-weight: 600; color: #71717a; }
  .type-sample { font-weight: var(--w); }
  .type-meta { font-size: 11px; color: #a1a1aa; margin-left: auto; }
  .spacing-row { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
  .spacing-name { width: 32px; font-size: 11px; font-weight: 600; color: #71717a; }
  .spacing-bar { height: 8px; border-radius: 4px; background: ${design.primaryColor}; }
  .spacing-value { font-size: 11px; color: #a1a1aa; }
  .btn-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; border-radius: 8px; border: none; cursor: pointer; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-bottom: 24px; }
  .card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.08); }
  .card-img { height: 140px; }
  .card-body { padding: 20px; }
  .card-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .card-desc { font-size: 13px; color: #71717a; }
  .modal-wrap { background: #52525b; border-radius: 12px; padding: 32px; position: relative; margin-bottom: 24px; }
  .modal-dialog { background: #fff; border-radius: 16px; padding: 24px; max-width: 420px; margin: 0 auto; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
  .modal-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .modal-body { font-size: 14px; color: #71717a; margin-bottom: 20px; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 12px; }
  .container-demo { border-radius: 8px; padding: 24px; margin-bottom: 16px; }
</style>
</head>
<body>
${contentRef.current.innerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-system.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!tokens) return null;

  const primary500 = tokens.colors.primary['500'];
  const secondary500 = tokens.colors.secondary['500'];
  const gradientBg = `linear-gradient(to right, ${design.primaryColor}, ${design.secondaryColor})`;

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* ─── Sidebar TOC ─── */}
      <aside className="w-52 border-r border-line flex-shrink-0 flex flex-col print:hidden">
        <div className="p-4 border-b border-line">
          <h3 className="text-xs font-semibold text-content-muted uppercase tracking-wider">
            Sections
          </h3>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
          <div>
            <label className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-content-faint w-12">Primary</span>
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                className="w-5 h-5 rounded border border-line cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[10px] text-content-faint w-12">Second.</span>
              <input
                type="color"
                value={design.secondaryColor}
                onChange={(e) => setDesign({ ...design, secondaryColor: e.target.value })}
                className="w-5 h-5 rounded border border-line cursor-pointer"
              />
            </label>
          </div>
          <button
            onClick={handleExportHTML}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium bg-surface-secondary hover:bg-surface-tertiary text-content rounded-lg transition-colors"
          >
            <Download size={13} /> Export HTML
          </button>
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium bg-surface-invert text-content-invert rounded-lg hover:opacity-90 transition-all"
          >
            <Printer size={13} /> Print / PDF
          </button>
        </div>
      </aside>

      {/* ─── Content ─── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-10 py-8 max-w-[860px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-content">Design System</h1>
          <p className="text-sm text-content-muted mt-1">
            {design.fontFamily} · Generated by TokenLab ·{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* ── COLORS ── */}
        <SectionTitle id="colors">Color Palette</SectionTitle>
        {(
          ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'] as const
        ).map((name) => (
          <div key={name} className="mb-6">
            <h3 className="text-sm font-semibold text-content capitalize mb-2">
              {name}
            </h3>
            <div className="flex gap-[2px] mb-1">
              {SHADES.map((shade) => {
                const hex = (tokens.colors[name] as ColorScale)[shade];
                return (
                  <div
                    key={shade}
                    className="flex-1 h-9 first:rounded-l-md last:rounded-r-md"
                    style={{ backgroundColor: hex }}
                    title={`${shade}: ${hex}`}
                  />
                );
              })}
            </div>
            <div className="flex gap-[2px]">
              {SHADES.map((shade) => (
                <span
                  key={shade}
                  className="flex-1 text-[9px] text-content-faint"
                >
                  {shade}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* ── TYPOGRAPHY ── */}
        <SectionTitle id="typography">Typography</SectionTitle>
        <p className="text-sm text-content-muted mb-4">
          {design.fontFamily} · Ratio 1.25 · Base 16px
        </p>
        <div className="border border-line rounded-xl overflow-hidden mb-4">
          {[...tokens.typography].reverse().map((step, i) => (
            <div
              key={step.name}
              className={`flex items-baseline gap-4 px-4 py-3 ${
                i > 0 ? 'border-t border-line-subtle' : ''
              }`}
            >
              <span className="w-10 text-[11px] font-semibold text-content-muted">
                {step.name}
              </span>
              <span
                className="flex-1 text-content truncate"
                style={{
                  fontSize: Math.min(step.sizePx, 42),
                  fontWeight: step.weight,
                  lineHeight: step.lineHeight,
                  fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                }}
              >
                The quick brown fox
              </span>
              <span className="text-[11px] text-content-faint font-mono whitespace-nowrap">
                {step.sizePx}px · {step.weight} · {step.lineHeight}
              </span>
            </div>
          ))}
        </div>

        {/* ── SPACING ── */}
        <SectionTitle id="spacing">Spacing Scale</SectionTitle>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4">
          {tokens.spacing
            .filter((s) => s.px > 0 && s.px <= 96)
            .map((step) => (
              <div key={step.name} className="flex items-center gap-3 py-1">
                <span className="w-8 text-[11px] font-semibold text-content-muted text-right">
                  {step.name}
                </span>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: Math.min(step.px * 2, 200),
                    backgroundColor: primary500,
                    opacity: 0.6,
                  }}
                />
                <span className="text-[11px] text-content-faint font-mono">
                  {step.px}px
                </span>
              </div>
            ))}
        </div>

        {/* ── BUTTONS ── */}
        <SectionTitle id="buttons">Buttons</SectionTitle>

        <h3 className="text-sm font-semibold text-content mb-3">Variants</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { label: 'Primary', bg: design.primaryColor, color: contrast(design.primaryColor), border: 'none' },
            { label: 'Secondary', bg: `${design.primaryColor}1a`, color: design.primaryColor, border: 'none' },
            { label: 'Outline', bg: 'transparent', color: design.primaryColor, border: `1px solid ${design.primaryColor}4d` },
            { label: 'Ghost', bg: 'transparent', color: design.primaryColor, border: 'none' },
            { label: 'Destructive', bg: '#ef4444', color: '#fff', border: 'none' },
          ].map((v) => (
            <button
              key={v.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                backgroundColor: v.bg,
                color: v.color,
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                border: v.border,
                cursor: 'default',
                fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-content mb-3">Gradient</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              background: gradientBg,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'default',
              fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
            }}
          >
            Gradient Button
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              background: `linear-gradient(to bottom right, ${design.primaryColor}, ${design.secondaryColor})`,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 9999,
              border: 'none',
              cursor: 'default',
              fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
            }}
          >
            Pill Gradient
          </button>
        </div>

        <h3 className="text-sm font-semibold text-content mb-3">Sizes</h3>
        <div className="flex items-end gap-3 mb-4">
          {[
            { label: 'Small', p: '6px 12px', fs: 12 },
            { label: 'Medium', p: '8px 16px', fs: 14 },
            { label: 'Large', p: '12px 24px', fs: 16 },
          ].map((s) => (
            <button
              key={s.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: s.p,
                backgroundColor: design.primaryColor,
                color: contrast(design.primaryColor),
                fontSize: s.fs,
                fontWeight: 500,
                borderRadius: 8,
                border: 'none',
                cursor: 'default',
                fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-content mb-3">
          With Icons
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: design.primaryColor,
              color: contrast(design.primaryColor),
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'default',
            }}
          >
            Next <ArrowRight size={16} />
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: `${design.primaryColor}1a`,
              color: design.primaryColor,
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'default',
            }}
          >
            <Plus size={16} /> Create
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: gradientBg,
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'default',
            }}
          >
            <Heart size={16} /> Favorite
          </button>
        </div>
        <CodeBlock
          code={`// Primary Button\n<button className="inline-flex items-center gap-2 px-4 py-2 bg-[${design.primaryColor}] text-${contrast(design.primaryColor) === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg hover:opacity-90 transition-all">\n  Next\n  <ArrowRight size={16} />\n</button>\n\n// Gradient Button\n<button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[${design.primaryColor}] to-[${design.secondaryColor}] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">\n  Gradient\n</button>`}
        />

        {/* ── CARDS ── */}
        <SectionTitle id="cards">Cards</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
          {/* Basic Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #e4e4e7',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
            }}
          >
            <div
              style={{
                height: 140,
                background: `linear-gradient(135deg, ${design.primaryColor}18, ${design.primaryColor}40)`,
              }}
            />
            <div style={{ padding: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', marginBottom: 4 }}>
                Basic Card
              </h4>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                Standard card with placeholder image and content area.
              </p>
            </div>
          </div>

          {/* Gradient Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #e4e4e7',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
            }}
          >
            <div
              style={{
                height: 140,
                background: `linear-gradient(to right, ${design.primaryColor}, ${design.secondaryColor})`,
              }}
            />
            <div style={{ padding: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', marginBottom: 4 }}>
                Gradient Card
              </h4>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                Card with a gradient cover using primary and secondary colors.
              </p>
            </div>
          </div>

          {/* Card with Action */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #e4e4e7',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
            }}
          >
            <div
              style={{
                height: 140,
                background: `linear-gradient(to bottom right, ${design.secondaryColor}30, ${design.primaryColor}30)`,
              }}
            />
            <div style={{ padding: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#18181b', marginBottom: 4 }}>
                Action Card
              </h4>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5, marginBottom: 12 }}>
                Card with a call-to-action button.
              </p>
              <button
                style={{
                  padding: '6px 14px',
                  backgroundColor: design.primaryColor,
                  color: contrast(design.primaryColor),
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'default',
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-content mb-3">
          Card with Image URL
        </h3>
        <p className="text-xs text-content-muted mb-3">
          Pass any image URL to display real content.
        </p>
        <CodeBlock
          code={`<div className="bg-white rounded-xl shadow-md overflow-hidden border border-zinc-200 max-w-sm">\n  <img src="https://your-image.jpg" alt="" className="w-full h-48 object-cover" />\n  <div className="p-6">\n    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Title</h3>\n    <p className="text-sm text-zinc-500">Description</p>\n    <button className="mt-4 px-4 py-2 bg-[${design.primaryColor}] text-${contrast(design.primaryColor) === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg">\n      Action\n    </button>\n  </div>\n</div>`}
        />

        {/* ── MODALS ── */}
        <SectionTitle id="modals">Modals</SectionTitle>
        <div className="space-y-6 mb-4">
          {[
            { label: 'Small', maxW: 340 },
            { label: 'Medium', maxW: 440 },
          ].map((m) => (
            <div
              key={m.label}
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
                  backdropFilter: 'blur(4px)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: 16,
                  padding: 24,
                  maxWidth: m.maxW,
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
                  {m.label} Dialog
                </h4>
                <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>
                  Are you sure you want to proceed? This action cannot be undone.
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <button
                    style={{
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#52525b',
                      background: 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'default',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: design.primaryColor,
                      color: contrast(design.primaryColor),
                      fontSize: 14,
                      fontWeight: 500,
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'default',
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CodeBlock
          code={`export function Modal({ open, onClose }) {\n  if (!open) return null;\n\n  return (\n    <div className="fixed inset-0 z-50 flex items-center justify-center">\n      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />\n      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">\n        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Title</h2>\n        <p className="text-sm text-zinc-500">Body text here.</p>\n        <div className="flex justify-end gap-3 mt-6">\n          <button className="px-4 py-2 text-sm text-zinc-600 rounded-lg" onClick={onClose}>\n            Cancel\n          </button>\n          <button className="px-4 py-2 bg-[${design.primaryColor}] text-${contrast(design.primaryColor) === '#ffffff' ? 'white' : 'black'} text-sm font-medium rounded-lg">\n            Confirm\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}`}
        />

        {/* ── CONTAINERS ── */}
        <SectionTitle id="containers">Containers</SectionTitle>
        <div className="space-y-4 mb-8">
          {[
            { label: 'Light', bg: '#f4f4f5', text: '#18181b', sub: '#71717a' },
            { label: 'Dark', bg: '#18181b', text: '#f4f4f5', sub: '#a1a1aa' },
            {
              label: 'Gradient',
              bg: gradientBg,
              text: '#fff',
              sub: 'rgba(255,255,255,0.7)',
              isGradient: true,
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                ...(c.isGradient
                  ? { background: c.bg }
                  : { backgroundColor: c.bg }),
                borderRadius: 12,
                padding: 28,
              }}
            >
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: c.text,
                  marginBottom: 8,
                  fontFamily: `${design.fontFamily}, system-ui, sans-serif`,
                }}
              >
                {c.label} Container
              </h4>
              <p style={{ fontSize: 14, color: c.sub, lineHeight: 1.6 }}>
                A container component constrains content width and provides
                consistent spacing. Use different backgrounds to create visual
                hierarchy.
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
                    backgroundColor:
                      c.label === 'Light' ? '#d4d4d8' : 'rgba(255,255,255,0.15)',
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    height: 8,
                    width: '30%',
                    backgroundColor:
                      c.label === 'Light' ? '#d4d4d8' : 'rgba(255,255,255,0.15)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <CodeBlock
          code={`// Gradient Container\n<div className="max-w-3xl mx-auto px-6 py-8 bg-gradient-to-r from-[${design.primaryColor}] to-[${design.secondaryColor}] text-white rounded-xl">\n  {children}\n</div>\n\n// Dark Container\n<div className="max-w-3xl mx-auto px-6 py-8 bg-zinc-900 text-white rounded-xl">\n  {children}\n</div>`}
        />

        <div className="h-16" />
      </div>
    </div>
  );
}
