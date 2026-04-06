'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme';
import { Sun, Moon, Sparkles, Palette, Layers, BookOpen, ImageIcon } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Generate', icon: Sparkles },
  { href: '/tokens', label: 'Tokens', icon: Palette },
  { href: '/components', label: 'Components', icon: Layers },
  { href: '/system', label: 'System', icon: BookOpen },
  { href: '/images', label: 'Images', icon: ImageIcon },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav className="h-14 border-b border-line bg-surface/80 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-40">
      <Link href="/" className="flex items-baseline gap-0.5 group">
        <span className="font-serif italic text-[19px] tracking-tight text-content transition-colors">
          Token
        </span>
        <span className="font-sans font-bold text-[19px] tracking-tight text-content transition-colors">
          Lab
        </span>
      </Link>

      <div className="flex items-center gap-0.5 bg-surface-secondary rounded-lg p-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
                active
                  ? 'bg-surface text-content shadow-sm'
                  : 'text-content-muted hover:text-content'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={toggle}
        className="p-2 rounded-lg text-content-muted hover:text-content hover:bg-surface-secondary transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  );
}
