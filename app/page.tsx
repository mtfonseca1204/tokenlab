'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Palette,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { generateFromDescription } from '@/lib/ai-generator';
import { generateColorScale } from '@/lib/colors';
import { TokenConfig } from '@/lib/types';

const SUGGESTIONS = [
  'Modern SaaS dashboard with a professional feel',
  'Playful kids education platform, colorful and fun',
  'Minimal luxury fashion brand, elegant and refined',
  'Health & wellness app, calming and natural',
  'Creative agency portfolio, bold and energetic',
  'Fintech app for young professionals, trustworthy',
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    config: TokenConfig;
    reasoning: string;
  } | null>(null);
  const [displayedReasoning, setDisplayedReasoning] = useState('');

  useEffect(() => {
    if (!result) return;
    let i = 0;
    const text = result.reasoning;
    setDisplayedReasoning('');
    const interval = setInterval(() => {
      i++;
      setDisplayedReasoning(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [result]);

  const generate = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setLoading(true);
      setResult(null);
      await new Promise((r) => setTimeout(r, 1500));
      const res = generateFromDescription(text);
      setResult(res);
      setLoading(false);
    },
    []
  );

  const openEditor = () => {
    if (!result) return;
    sessionStorage.setItem('tokenlab-ai-config', JSON.stringify(result.config));
    router.push('/tokens');
  };

  const primaryScale = result
    ? generateColorScale(result.config.primaryColor)
    : null;
  const secondaryScale = result
    ? generateColorScale(result.config.secondaryColor)
    : null;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] -top-40 -left-40"
            style={{
              backgroundColor: result?.config.primaryColor || '#6366f1',
              transition: 'background-color 1s ease',
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px] -bottom-40 -right-40"
            style={{
              backgroundColor: result?.config.secondaryColor || '#ec4899',
              transition: 'background-color 1s ease',
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl w-full text-center">
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-content-muted bg-surface-secondary px-3 py-1 rounded-full">
              <Sparkles size={12} />
              AI-Powered
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-content leading-[1.1] mb-4">
            Your design system,
            <br />
            <span className="font-serif italic font-normal">
              generated in seconds.
            </span>
          </h1>

          <p className="text-content-secondary text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Describe your project and let TokenLab create a complete token
            system — colors, typography, spacing, and more.
          </p>

          {/* Prompt Area */}
          <div className="bg-surface-secondary border border-line rounded-2xl p-2 shadow-lg shadow-black/5 mb-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  generate(prompt);
                }
              }}
              placeholder="Describe your project, brand, or design style..."
              rows={3}
              className="w-full bg-transparent text-content placeholder:text-content-faint text-[15px] leading-relaxed resize-none px-4 py-3 focus:outline-none"
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[11px] text-content-faint">
                Press Enter to generate
              </span>
              <button
                onClick={() => generate(prompt)}
                disabled={!prompt.trim() || loading}
                className="flex items-center gap-2 px-5 py-2 bg-surface-invert text-content-invert rounded-xl text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suggestion Chips */}
          {!result && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setPrompt(s);
                    generate(s);
                  }}
                  className="text-xs text-content-muted bg-surface-secondary hover:bg-surface-tertiary border border-line-subtle px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="animate-section mt-6">
              <div className="bg-surface-secondary border border-line rounded-2xl p-6 text-left">
                <p className="text-[13px] text-content-secondary leading-relaxed mb-5 min-h-[3rem]">
                  {displayedReasoning}
                  <span className="animate-pulse-soft">|</span>
                </p>

                <div className="flex items-center gap-4 mb-5">
                  <div className="flex -space-x-1">
                    {(['50', '200', '400', '500', '600', '800'] as const).map(
                      (shade) => (
                        <div
                          key={`p-${shade}`}
                          className="w-7 h-7 rounded-full border-2 border-surface-secondary"
                          style={{
                            backgroundColor: primaryScale?.[shade],
                            transition: 'background-color 300ms ease',
                          }}
                        />
                      )
                    )}
                  </div>
                  <div className="w-px h-6 bg-line" />
                  <div className="flex -space-x-1">
                    {(['50', '200', '400', '500', '600', '800'] as const).map(
                      (shade) => (
                        <div
                          key={`s-${shade}`}
                          className="w-7 h-7 rounded-full border-2 border-surface-secondary"
                          style={{
                            backgroundColor: secondaryScale?.[shade],
                            transition: 'background-color 300ms ease',
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-content-muted mb-5">
                  <span className="bg-surface-tertiary px-2 py-1 rounded font-mono">
                    {result.config.fontFamily}
                  </span>
                  <span className="bg-surface-tertiary px-2 py-1 rounded font-mono">
                    {result.config.radiusStyle}
                  </span>
                  <span className="bg-surface-tertiary px-2 py-1 rounded font-mono">
                    {result.config.scaleRatio}
                  </span>
                </div>

                <button
                  onClick={openEditor}
                  className="flex items-center gap-2 px-5 py-2.5 bg-surface-invert text-content-invert rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Open in Token Editor
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="border-t border-line px-6 py-16 bg-surface-secondary/50">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs text-content-faint uppercase tracking-widest font-semibold mb-8">
            Or explore our tools
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/tokens"
              className="group bg-surface border border-line rounded-2xl p-6 hover:border-content-faint transition-all duration-200"
            >
              <Palette
                size={24}
                className="text-content-muted mb-3 group-hover:text-content transition-colors"
              />
              <h3 className="font-semibold text-content mb-1">
                Token Generator
              </h3>
              <p className="text-sm text-content-muted leading-relaxed">
                Fine-tune colors, typography, spacing, shadows, and radius.
                Export to CSS, Tailwind, or JSON.
              </p>
            </Link>
            <Link
              href="/images"
              className="group bg-surface border border-line rounded-2xl p-6 hover:border-content-faint transition-all duration-200"
            >
              <ImageIcon
                size={24}
                className="text-content-muted mb-3 group-hover:text-content transition-colors"
              />
              <h3 className="font-semibold text-content mb-1">Image Tools</h3>
              <p className="text-sm text-content-muted leading-relaxed">
                Remove backgrounds instantly and upscale images with smart
                enhancement — all in the browser.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
