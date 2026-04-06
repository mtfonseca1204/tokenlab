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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-700/50 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-modal">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-1 bg-zinc-800/80 rounded-lg p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setFormat(key);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  format === key
                    ? 'bg-zinc-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
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
              className="flex items-center gap-2 px-4 py-2 bg-zinc-50 text-zinc-900 rounded-lg text-sm font-semibold hover:bg-white transition-colors"
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
              className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <pre className="text-[13px] font-mono text-zinc-300 leading-relaxed whitespace-pre selection:bg-zinc-700">
            {content}
          </pre>
        </div>

        <div className="px-5 py-3 border-t border-zinc-800/60 flex items-center justify-between">
          <span className="text-[11px] text-zinc-600">
            {content.split('\n').length} lines ·{' '}
            {(new Blob([content]).size / 1024).toFixed(1)} KB
          </span>
          <span className="text-[11px] text-zinc-600">
            Press Escape to close
          </span>
        </div>
      </div>
    </div>
  );
}
