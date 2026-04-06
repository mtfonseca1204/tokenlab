'use client';

import { useState, useMemo, useEffect } from 'react';
import { Download } from 'lucide-react';
import { TokenConfig } from '@/lib/types';
import { generateAllTokens } from '@/lib/tokens';
import { Sidebar } from '@/components/Sidebar';
import { ColorPalette } from '@/components/ColorPalette';
import { TypographyScale } from '@/components/TypographyScale';
import { SpacingScale } from '@/components/SpacingScale';
import { ShadowSystem } from '@/components/ShadowSystem';
import { RadiusSystem } from '@/components/RadiusSystem';
import { Preview } from '@/components/Preview';
import { ExportPanel } from '@/components/ExportPanel';

const DEFAULT_CONFIG: TokenConfig = {
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  fontFamily: 'Inter',
  scaleRatio: 1.25,
  baseFontSize: 16,
  baseSpacing: 4,
  radiusStyle: 'rounded',
};

const SCALE_NAMES: Record<string, string> = {
  '1.067': 'Minor Second',
  '1.125': 'Major Second',
  '1.2': 'Minor Third',
  '1.25': 'Major Third',
  '1.333': 'Perfect Fourth',
  '1.414': 'Aug. Fourth',
  '1.5': 'Perfect Fifth',
  '1.618': 'Golden Ratio',
};

export default function TokensPage() {
  const [config, setConfig] = useState<TokenConfig>(DEFAULT_CONFIG);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('tokenlab-ai-config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TokenConfig;
        setConfig(parsed);
      } catch {}
      sessionStorage.removeItem('tokenlab-ai-config');
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setShowExport((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const tokens = useMemo(() => generateAllTokens(config), [config]);
  const scaleName = SCALE_NAMES[String(config.scaleRatio)] || '';

  return (
    <div className="h-[calc(100vh-56px)] flex">
      <Sidebar config={config} onChange={setConfig} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 border-b border-line px-8 py-3 flex justify-end items-center gap-3 bg-surface/80 backdrop-blur-sm">
          <kbd className="hidden md:flex text-[10px] text-content-faint bg-surface-secondary px-2 py-1 rounded font-mono items-center gap-1">
            <span className="text-[11px]">⌘</span>E
          </kbd>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-[9px] bg-surface-invert text-content-invert rounded-lg font-semibold text-sm hover:opacity-90 transition-colors shadow-sm"
          >
            <Download size={15} />
            Export
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[960px] mx-auto px-8 py-10 space-y-20">
            <section
              className="animate-section"
              style={{ animationDelay: '0s' }}
            >
              <SectionHeader
                title="Color System"
                description="Complete color palette with 11 shades per scale. Click any swatch to copy its hex value."
              />
              <div className="space-y-8">
                <ColorPalette name="Primary" scale={tokens.colors.primary} />
                <ColorPalette
                  name="Secondary"
                  scale={tokens.colors.secondary}
                />
                <ColorPalette name="Neutral" scale={tokens.colors.neutral} />
                <div className="space-y-6">
                  <ColorPalette
                    name="Success"
                    scale={tokens.colors.success}
                    compact
                  />
                  <ColorPalette
                    name="Warning"
                    scale={tokens.colors.warning}
                    compact
                  />
                  <ColorPalette
                    name="Error"
                    scale={tokens.colors.error}
                    compact
                  />
                </div>
              </div>
            </section>

            <section
              className="animate-section"
              style={{ animationDelay: '0.06s' }}
            >
              <SectionHeader
                title="Typography Scale"
                description={`${config.fontFamily} · ${scaleName} (${config.scaleRatio}) · Base ${config.baseFontSize}px`}
              />
              <TypographyScale
                steps={tokens.typography}
                fontFamily={config.fontFamily}
              />
            </section>

            <section
              className="animate-section"
              style={{ animationDelay: '0.12s' }}
            >
              <SectionHeader
                title="Spacing Scale"
                description={`Base unit: ${config.baseSpacing}px · Multiplied across a consistent scale`}
              />
              <SpacingScale
                steps={tokens.spacing}
                primaryColor={config.primaryColor}
              />
            </section>

            <section
              className="animate-section"
              style={{ animationDelay: '0.18s' }}
            >
              <SectionHeader
                title="Shadow System"
                description="Six elevation levels with subtle color tinting from your primary color."
              />
              <ShadowSystem steps={tokens.shadows} />
            </section>

            <section
              className="animate-section"
              style={{ animationDelay: '0.24s' }}
            >
              <SectionHeader
                title="Border Radius"
                description={`Style: ${config.radiusStyle.charAt(0).toUpperCase() + config.radiusStyle.slice(1)} · Seven radius values from none to full`}
              />
              <RadiusSystem
                steps={tokens.radius}
                primaryColor={config.primaryColor}
              />
            </section>

            <section
              className="animate-section"
              style={{ animationDelay: '0.3s' }}
            >
              <SectionHeader
                title="Live Preview"
                description="Your tokens applied to real UI components — card, form, buttons, and status badges."
              />
              <Preview tokens={tokens} fontFamily={config.fontFamily} />
            </section>

            <footer className="pt-6 pb-4 border-t border-line-subtle text-center">
              <p className="text-xs text-content-faint">
                Built with precision for designers who care about systems.
              </p>
            </footer>
          </div>
        </main>
      </div>

      {showExport && (
        <ExportPanel
          tokens={tokens}
          fontFamily={config.fontFamily}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-content tracking-tight">
        {title}
      </h2>
      <p className="text-[13px] text-content-muted mt-1.5">{description}</p>
    </div>
  );
}
