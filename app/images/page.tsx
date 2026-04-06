'use client';

import { useState } from 'react';
import { Scissors, ZoomIn } from 'lucide-react';
import { BackgroundRemoval } from '@/components/BackgroundRemoval';
import { ImageUpscaler } from '@/components/ImageUpscaler';

type Tab = 'remove-bg' | 'upscale';

const TABS: { key: Tab; label: string; icon: typeof Scissors; description: string }[] = [
  {
    key: 'remove-bg',
    label: 'Remove Background',
    icon: Scissors,
    description: 'Remove image backgrounds instantly using AI — runs entirely in your browser.',
  },
  {
    key: 'upscale',
    label: 'Upscale Image',
    icon: ZoomIn,
    description: 'Enlarge images to 2x or 4x with smart sharpening for crisp results.',
  },
];

export default function ImagesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('remove-bg');
  const current = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-content tracking-tight mb-2">
            Image Tools
          </h1>
          <p className="text-content-muted text-sm">
            Browser-based image processing — no uploads to external servers.
          </p>
        </div>

        <div className="flex gap-1 bg-surface-secondary rounded-xl p-1 mb-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-surface text-content shadow-sm'
                  : 'text-content-muted hover:text-content-secondary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-content-faint mb-6 px-1">
          {current.description}
        </p>

        {activeTab === 'remove-bg' && <BackgroundRemoval />}
        {activeTab === 'upscale' && <ImageUpscaler />}
      </div>
    </div>
  );
}
