import { TokenConfig, RadiusStyle } from './types';

interface GenerationResult {
  config: TokenConfig;
  reasoning: string;
}

interface StyleMatch {
  primary: string;
  secondary: string;
  font: string;
  radius: RadiusStyle;
  scale: number;
  spacing: number;
}

const INDUSTRY_MAP: Record<string, Partial<StyleMatch>> = {
  fintech: { primary: '#0ea5e9', secondary: '#6366f1' },
  finance: { primary: '#0ea5e9', secondary: '#6366f1' },
  bank: { primary: '#1d4ed8', secondary: '#0ea5e9' },
  payment: { primary: '#6366f1', secondary: '#0ea5e9' },
  crypto: { primary: '#8b5cf6', secondary: '#06b6d4' },
  health: { primary: '#10b981', secondary: '#06b6d4' },
  wellness: { primary: '#14b8a6', secondary: '#22c55e' },
  medical: { primary: '#0891b2', secondary: '#10b981' },
  fitness: { primary: '#ef4444', secondary: '#f97316' },
  food: { primary: '#f97316', secondary: '#ef4444' },
  restaurant: { primary: '#dc2626', secondary: '#f59e0b' },
  recipe: { primary: '#ea580c', secondary: '#16a34a' },
  education: { primary: '#8b5cf6', secondary: '#3b82f6' },
  learning: { primary: '#6366f1', secondary: '#ec4899' },
  kids: { primary: '#f472b6', secondary: '#a78bfa' },
  ecommerce: { primary: '#f59e0b', secondary: '#ef4444' },
  shop: { primary: '#f97316', secondary: '#6366f1' },
  fashion: { primary: '#18181b', secondary: '#a16207' },
  luxury: { primary: '#18181b', secondary: '#92400e' },
  travel: { primary: '#0ea5e9', secondary: '#f97316' },
  social: { primary: '#ec4899', secondary: '#8b5cf6' },
  dating: { primary: '#f43f5e', secondary: '#ec4899' },
  music: { primary: '#a855f7', secondary: '#ec4899' },
  gaming: { primary: '#7c3aed', secondary: '#06b6d4' },
  sport: { primary: '#16a34a', secondary: '#0ea5e9' },
  nature: { primary: '#16a34a', secondary: '#84cc16' },
  eco: { primary: '#059669', secondary: '#65a30d' },
  tech: { primary: '#6366f1', secondary: '#8b5cf6' },
  startup: { primary: '#6366f1', secondary: '#ec4899' },
  saas: { primary: '#3b82f6', secondary: '#8b5cf6' },
  dashboard: { primary: '#3b82f6', secondary: '#6366f1' },
  analytics: { primary: '#6366f1', secondary: '#0ea5e9' },
  productivity: { primary: '#2563eb', secondary: '#7c3aed' },
  portfolio: { primary: '#18181b', secondary: '#6366f1' },
  agency: { primary: '#ec4899', secondary: '#f97316' },
  creative: { primary: '#d946ef', secondary: '#f97316' },
  blog: { primary: '#6366f1', secondary: '#ec4899' },
  news: { primary: '#dc2626', secondary: '#18181b' },
  real_estate: { primary: '#0d9488', secondary: '#f59e0b' },
  legal: { primary: '#1e40af', secondary: '#6b7280' },
  corporate: { primary: '#1e40af', secondary: '#0891b2' },
};

const MOOD_MAP: Record<string, Partial<StyleMatch>> = {
  modern: { font: 'Inter', radius: 'rounded', scale: 1.25 },
  minimal: { font: 'DM Sans', radius: 'sharp', scale: 1.2, spacing: 4 },
  clean: { font: 'Inter', radius: 'rounded', scale: 1.2 },
  bold: { font: 'Space Grotesk', radius: 'rounded', scale: 1.333 },
  playful: { font: 'Outfit', radius: 'pill', scale: 1.25 },
  fun: { font: 'Sora', radius: 'pill', scale: 1.25 },
  elegant: { font: 'DM Sans', radius: 'sharp', scale: 1.2, spacing: 4 },
  refined: { font: 'DM Sans', radius: 'sharp', scale: 1.125 },
  professional: { font: 'Inter', radius: 'rounded', scale: 1.25 },
  trustworthy: { font: 'Inter', radius: 'rounded', scale: 1.2, spacing: 4 },
  friendly: { font: 'Nunito Sans', radius: 'pill', scale: 1.25 },
  warm: { font: 'Plus Jakarta Sans', radius: 'rounded', scale: 1.25 },
  serious: { font: 'IBM Plex Sans', radius: 'sharp', scale: 1.2 },
  corporate: { font: 'IBM Plex Sans', radius: 'sharp', scale: 1.125 },
  premium: { font: 'DM Sans', radius: 'sharp', scale: 1.2 },
  luxury: { font: 'DM Sans', radius: 'sharp', scale: 1.125, spacing: 4 },
  energetic: { font: 'Outfit', radius: 'rounded', scale: 1.333 },
  calm: { font: 'Manrope', radius: 'rounded', scale: 1.2, spacing: 4 },
  soft: { font: 'Plus Jakarta Sans', radius: 'pill', scale: 1.2 },
  techy: { font: 'Space Grotesk', radius: 'rounded', scale: 1.25 },
  geometric: { font: 'Sora', radius: 'sharp', scale: 1.25 },
  natural: { font: 'Manrope', radius: 'rounded', scale: 1.2 },
  youthful: { font: 'Poppins', radius: 'pill', scale: 1.25 },
  mature: { font: 'Source Sans 3', radius: 'sharp', scale: 1.2 },
};

const COLOR_MAP: Record<string, Partial<StyleMatch>> = {
  blue: { primary: '#3b82f6' },
  red: { primary: '#ef4444' },
  green: { primary: '#22c55e' },
  purple: { primary: '#8b5cf6' },
  pink: { primary: '#ec4899' },
  orange: { primary: '#f97316' },
  yellow: { primary: '#eab308' },
  teal: { primary: '#14b8a6' },
  cyan: { primary: '#06b6d4' },
  indigo: { primary: '#6366f1' },
  violet: { primary: '#7c3aed' },
  black: { primary: '#18181b' },
  dark: { primary: '#18181b' },
  white: { primary: '#f8fafc' },
  gold: { primary: '#d97706' },
};

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function findMatch<T>(
  keywords: string[],
  map: Record<string, T>
): T | undefined {
  for (const keyword of keywords) {
    for (const [key, value] of Object.entries(map)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        return value;
      }
    }
  }
  return undefined;
}

function buildReasoning(
  description: string,
  config: TokenConfig,
  industryHit: string | null,
  moodHit: string | null
): string {
  const parts: string[] = [];

  if (industryHit) {
    parts.push(
      `For a ${industryHit}-related project, I chose ${config.primaryColor} as your primary color — it conveys the right trust and energy for this space.`
    );
  } else {
    parts.push(
      `Based on your description, I selected ${config.primaryColor} as your primary color to set the right tone.`
    );
  }

  parts.push(
    `${config.secondaryColor} complements it as a secondary, adding depth and versatility to your palette.`
  );

  if (moodHit) {
    parts.push(
      `The "${moodHit}" feel you described led me to ${config.fontFamily} — a typeface that nails that aesthetic.`
    );
  } else {
    parts.push(
      `${config.fontFamily} was chosen for its clean, versatile character that adapts well to your use case.`
    );
  }

  const radiusDesc = {
    sharp: 'Sharp corners give it a precise, structured feel',
    rounded: 'Rounded corners keep it approachable and modern',
    pill: 'Pill-shaped corners add a soft, friendly personality',
  };
  parts.push(`${radiusDesc[config.radiusStyle]}.`);

  return parts.join(' ');
}

export function generateFromDescription(description: string): GenerationResult {
  const keywords = extractKeywords(description);

  const defaults: StyleMatch = {
    primary: '#6366f1',
    secondary: '#ec4899',
    font: 'Inter',
    radius: 'rounded',
    scale: 1.25,
    spacing: 4,
  };

  let industryHit: string | null = null;
  let moodHit: string | null = null;

  for (const keyword of keywords) {
    for (const key of Object.keys(INDUSTRY_MAP)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        industryHit = key;
        break;
      }
    }
    if (industryHit) break;
  }

  for (const keyword of keywords) {
    for (const key of Object.keys(MOOD_MAP)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        moodHit = key;
        break;
      }
    }
    if (moodHit) break;
  }

  const industry = industryHit
    ? INDUSTRY_MAP[industryHit]
    : undefined;
  const mood = moodHit ? MOOD_MAP[moodHit] : undefined;
  const colorHit = findMatch(keywords, COLOR_MAP);

  const merged: StyleMatch = {
    ...defaults,
    ...industry,
    ...mood,
    ...colorHit,
  };

  if (colorHit?.primary && !industry?.secondary) {
    merged.secondary = defaults.secondary;
  }

  const config: TokenConfig = {
    primaryColor: merged.primary,
    secondaryColor: merged.secondary,
    fontFamily: merged.font,
    scaleRatio: merged.scale,
    baseFontSize: 16,
    baseSpacing: merged.spacing,
    radiusStyle: merged.radius,
  };

  const reasoning = buildReasoning(description, config, industryHit, moodHit);

  return { config, reasoning };
}
