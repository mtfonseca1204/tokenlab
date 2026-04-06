'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, FileCode, Paintbrush, Braces } from 'lucide-react';
import { GeneratedTokens } from '@/lib/types';
import { exportAsCSS, exportAsTailwind, exportAsJSON } from '@/lib/export';

interface ExportPanelProps {
  tokens: GeneratedTokens;
  fontFamily: string;
  onClose: () => void;
}

type ExportFormat = 'css' | 'tailwind' | 'json';

const TABS: { key: ExportFormat; label: string; icon: typeof FileCode }[] = [
  { key: 'css', label: 'CSS Variables', icon: FileCode },
  { key: 'tailwind', label: 'Tailwind', icon: Paintbrush },
  { key: 'json', label: 'JSON Tokens', icon: Braces },
];

export function ExportPanel({ tokens, fontFamily, onClose }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const content = {
    css: exportAsCSS(tokens, fontFamily),
    tailwind: exportAsTailwind(tokens, fontFamily),
    json: exportAsJSON(tokens, fontFamily),
  }[format];

  const copyAll = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-line rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-modal">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div className="flex items-center gap-1 bg-surface-secondary rounded-lg p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setFormat(key);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
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
            <button
              onClick={onClose}
              className="p-2 text-content-muted hover:text-content hover:bg-surface-secondary rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <pre className="text-[13px] font-mono text-content-secondary leading-relaxed whitespace-pre selection:bg-surface-tertiary">
            {content}
          </pre>
        </div>

        <div className="px-5 py-3 border-t border-line-subtle flex items-center justify-between">
          <span className="text-[11px] text-content-faint">
            {content.split('\n').length} lines ·{' '}
            {(new Blob([content]).size / 1024).toFixed(1)} KB
          </span>
          <span className="text-[11px] text-content-faint">
            Press Escape to close
          </span>
        </div>
      </div>
    </div>
  );
}
