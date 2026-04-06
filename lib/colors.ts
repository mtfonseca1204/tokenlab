import { ColorScale, ColorShade } from './types';

export function hexToRGB(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) =>
        Math.round(Math.max(0, Math.min(255, x)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const [rr, gg, bb] = hexToRGB(hex).map((x) => x / 255);
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr:
        h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
        break;
      case gg:
        h = ((bb - rr) / d + 2) / 6;
        break;
      case bb:
        h = ((rr - gg) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  const hNorm = h / 360;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

const SHADE_CONFIG: Array<{ shade: ColorShade; l: number; sMod: number }> = [
  { shade: '50', l: 0.97, sMod: 0.4 },
  { shade: '100', l: 0.94, sMod: 0.5 },
  { shade: '200', l: 0.86, sMod: 0.65 },
  { shade: '300', l: 0.76, sMod: 0.8 },
  { shade: '400', l: 0.64, sMod: 0.9 },
  { shade: '500', l: 0.5, sMod: 1.0 },
  { shade: '600', l: 0.42, sMod: 0.95 },
  { shade: '700', l: 0.34, sMod: 0.9 },
  { shade: '800', l: 0.26, sMod: 0.85 },
  { shade: '900', l: 0.18, sMod: 0.8 },
  { shade: '950', l: 0.1, sMod: 0.75 },
];

export function generateColorScale(hex: string): ColorScale {
  const { h, s } = hexToHSL(hex);
  const result = {} as ColorScale;

  for (const { shade, l, sMod } of SHADE_CONFIG) {
    result[shade] = hslToHex(h, Math.min(1, s * sMod), l);
  }

  return result;
}

export function generateNeutralScale(primaryHex: string): ColorScale {
  const { h } = hexToHSL(primaryHex);
  const neutralSeed = hslToHex(h, 0.04, 0.5);
  return generateColorScale(neutralSeed);
}

export function generateSemanticScales(): {
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
} {
  return {
    success: generateColorScale('#22c55e'),
    warning: generateColorScale('#eab308'),
    error: generateColorScale('#ef4444'),
  };
}

function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRGB(hex).map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function shouldUseWhiteText(hex: string): boolean {
  return getRelativeLuminance(hex) < 0.179;
}
