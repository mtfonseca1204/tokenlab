'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  FileCode,
  Paintbrush,
  Braces,
  FileDown,
  Download,
} from 'lucide-react';
import { GeneratedTokens, TokenConfig } from '@/lib/types';
import { exportAsCSS, exportAsTailwind, exportAsJSON } from '@/lib/export';
import { exportAsPDF } from '@/lib/export-pdf';

interface ExportPanelProps {
  tokens: GeneratedTokens;
  fontFamily: string;
  config: TokenConfig;
  onClose: () => void;
}

type ExportFormat = 'css' | 'tailwind' | 'json' | 'pdf';

const TABS: {
  key: ExportFormat;
  label: string;
  icon: typeof FileCode;
}[] = [
  { key: 'css', label: 'CSS', icon: FileCode },
  { key: 'tailwind', label: 'Tailwind', icon: Paintbrush },
  { key: 'json', label: 'JSON', icon: Braces },
  { key: 'pdf', label: 'PDF', icon: FileDown },
];

export function ExportPanel({
  tokens,
  fontFamily,
  config,
  onClose,
}: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const codeContent =
    format === 'css'
      ? exportAsCSS(tokens, fontFamily)
      : format === 'tailwind'
        ? exportAsTailwind(tokens, fontFamily)
        : format === 'json'
          ? exportAsJSON(tokens, fontFamily)
          : '';

  const copyAll = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePDF = async () => {
    setPdfGenerating(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      exportAsPDF(tokens, config);
    } finally {
      setPdfGenerating(false);
    }
  };

  const isPdf = format === 'pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-line rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div className="flex items-center gap-1 bg-surface-secondary rounded-lg p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setFormat(key);
                  setCopied(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  format === key
                    ? 'bg-surface-tertiary text-content shadow-sm'
                    : 'text-content-muted hover:text-content'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!isPdf && (
              <button
                onClick={copyAll}
                className="flex items-center gap-2 px-4 py-2 bg-surface-invert text-content-invert rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy All
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-content-muted hover:text-content hover:bg-surface-secondary rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {isPdf ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-20 bg-surface-secondary rounded-lg border border-line flex items-center justify-center mb-6">
              <FileDown size={28} className="text-content-muted" />
            </div>
            <h3 className="text-lg font-semibold text-content mb-2">
              Token Documentation PDF
            </h3>
            <p className="text-sm text-content-muted max-w-md leading-relaxed mb-8">
              A complete design system reference with color palettes, typography
              scale, spacing values, shadows, and border radius specs. Perfect
              for sharing with developers and stakeholders.
            </p>
            <ul className="text-xs text-content-secondary space-y-1.5 mb-8 text-left">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-content-faint rounded-full" />
                Full color palettes with all 11 shades and hex values
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-content-faint rounded-full" />
                Typography scale table with sizes, weights, and line-heights
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-content-faint rounded-full" />
                Spacing scale with visual bars
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-content-faint rounded-full" />
                Shadow definitions and border radius specs
              </li>
            </ul>
            <button
              onClick={handlePDF}
              disabled={pdfGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-surface-invert text-content-invert rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Download size={16} />
              {pdfGenerating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-5">
              <pre className="text-[13px] font-mono text-content-secondary leading-relaxed whitespace-pre selection:bg-surface-tertiary">
                {codeContent}
              </pre>
            </div>
            <div className="px-5 py-3 border-t border-line-subtle flex items-center justify-between">
              <span className="text-[11px] text-content-faint">
                {codeContent.split('\n').length} lines ·{' '}
                {(new Blob([codeContent]).size / 1024).toFixed(1)} KB
              </span>
              <span className="text-[11px] text-content-faint">
                Press Escape to close
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
