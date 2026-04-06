'use client';

import { useState, useEffect } from 'react';
import { Code2, Copy, Check, X } from 'lucide-react';
import type {
  ComponentType,
  DesignConfig,
  ButtonConfig,
  CardConfig,
  ModalConfig,
  ContainerConfig,
} from '@/lib/component-types';
import {
  DEFAULT_DESIGN,
  DEFAULT_BUTTON,
  DEFAULT_CARD,
  DEFAULT_MODAL,
  DEFAULT_CONTAINER,
} from '@/lib/component-types';
import {
  generateButtonCode,
  generateCardCode,
  generateModalCode,
  generateContainerCode,
} from '@/lib/component-code';
import { ButtonOptions, ButtonPreview } from '@/components/builder/ButtonBuilder';
import { CardOptions, CardPreview } from '@/components/builder/CardBuilder';
import { ModalOptions, ModalPreview } from '@/components/builder/ModalBuilder';
import {
  ContainerOptions,
  ContainerPreview,
} from '@/components/builder/ContainerBuilder';

const COMPONENT_TYPES: { key: ComponentType; label: string }[] = [
  { key: 'button', label: 'Button' },
  { key: 'card', label: 'Card' },
  { key: 'modal', label: 'Modal' },
  { key: 'container', label: 'Container' },
];

export default function ComponentsPage() {
  const [type, setType] = useState<ComponentType>('button');
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);
  const [button, setButton] = useState<ButtonConfig>(DEFAULT_BUTTON);
  const [card, setCard] = useState<CardConfig>(DEFAULT_CARD);
  const [modal, setModal] = useState<ModalConfig>(DEFAULT_MODAL);
  const [container, setContainer] = useState<ContainerConfig>(DEFAULT_CONTAINER);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportTab, setExportTab] = useState<'react' | 'html'>('react');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tokenlab-design');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DesignConfig>;
        setDesign({ ...DEFAULT_DESIGN, ...parsed });
        return;
      }
      const ai = sessionStorage.getItem('tokenlab-ai-config');
      if (ai) {
        const p = JSON.parse(ai);
        setDesign({
          primaryColor: p.primaryColor || DEFAULT_DESIGN.primaryColor,
          secondaryColor: p.secondaryColor || DEFAULT_DESIGN.secondaryColor,
          fontFamily: p.fontFamily || DEFAULT_DESIGN.fontFamily,
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('tokenlab-design', JSON.stringify(design));
  }, [design]);

  const getCode = () => {
    switch (type) {
      case 'button':
        return generateButtonCode(button, design);
      case 'card':
        return generateCardCode(card, design);
      case 'modal':
        return generateModalCode(modal, design);
      case 'container':
        return generateContainerCode(container, design);
    }
  };

  const handleExport = () => {
    setExportOpen(true);
    setCopied(false);
  };

  const code = getCode();
  const activeCode = exportTab === 'react' ? code.react : code.html;

  const copyCode = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* ─── Sidebar ─── */}
      <aside className="w-[272px] border-r border-line flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-line space-y-3">
          <h2 className="text-[11px] font-semibold text-content-muted uppercase tracking-wider">
            Design
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <span className="text-xs text-content-secondary w-16">Primary</span>
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) =>
                  setDesign({ ...design, primaryColor: e.target.value })
                }
                className="w-7 h-7 rounded-md border border-line cursor-pointer"
              />
              <span className="text-[10px] text-content-faint font-mono">
                {design.primaryColor}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs text-content-secondary w-16">Secondary</span>
              <input
                type="color"
                value={design.secondaryColor}
                onChange={(e) =>
                  setDesign({ ...design, secondaryColor: e.target.value })
                }
                className="w-7 h-7 rounded-md border border-line cursor-pointer"
              />
              <span className="text-[10px] text-content-faint font-mono">
                {design.secondaryColor}
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <span className="text-xs text-content-secondary">Font</span>
              <input
                value={design.fontFamily}
                onChange={(e) =>
                  setDesign({ ...design, fontFamily: e.target.value })
                }
                className="flex-1 px-2 py-1 bg-surface-secondary border border-line rounded-md text-xs text-content focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-[11px] font-semibold text-content-muted uppercase tracking-wider mb-3">
            Options
          </h2>
          {type === 'button' && (
            <ButtonOptions config={button} onChange={setButton} />
          )}
          {type === 'card' && (
            <CardOptions config={card} onChange={setCard} />
          )}
          {type === 'modal' && (
            <ModalOptions config={modal} onChange={setModal} />
          )}
          {type === 'container' && (
            <ContainerOptions config={container} onChange={setContainer} />
          )}
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <div className="flex items-center gap-1 bg-surface-secondary rounded-lg p-1">
            {COMPONENT_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                  type === key
                    ? 'bg-surface text-content shadow-sm'
                    : 'text-content-muted hover:text-content'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface-invert text-content-invert rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Code2 size={14} />
            Export Code
          </button>
        </div>

        {/* Preview */}
        <div
          className="flex-1 flex items-center justify-center p-8 overflow-auto"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgb(var(--line) / 0.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {type === 'button' && (
            <ButtonPreview config={button} design={design} />
          )}
          {type === 'card' && (
            <CardPreview config={card} design={design} />
          )}
          {type === 'modal' && (
            <ModalPreview config={modal} design={design} />
          )}
          {type === 'container' && (
            <ContainerPreview config={container} design={design} />
          )}
        </div>
      </main>

      {/* ─── Export Modal ─── */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setExportOpen(false)}
          />
          <div className="relative bg-surface border border-line rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-modal">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-1 bg-surface-secondary rounded-lg p-1">
                {(['react', 'html'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setExportTab(tab);
                      setCopied(false);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      exportTab === tab
                        ? 'bg-surface text-content shadow-sm'
                        : 'text-content-muted hover:text-content'
                    }`}
                  >
                    {tab === 'react' ? 'React + Tailwind' : 'HTML + CSS'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-invert text-content-invert rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setExportOpen(false)}
                  className="p-2 text-content-muted hover:text-content hover:bg-surface-secondary rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <pre className="text-[13px] font-mono text-content-secondary leading-relaxed whitespace-pre selection:bg-surface-tertiary">
                {activeCode}
              </pre>
            </div>
            <div className="px-5 py-3 border-t border-line-subtle flex items-center justify-between">
              <span className="text-[11px] text-content-faint">
                {activeCode.split('\n').length} lines ·{' '}
                {(new Blob([activeCode]).size / 1024).toFixed(1)} KB
              </span>
              <span className="text-[11px] text-content-faint">
                Press Escape to close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
