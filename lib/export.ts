import { GeneratedTokens, ColorScale, ColorShade } from './types';

const SHADES: ColorShade[] = [
  '50', '100', '200', '300', '400', '500',
  '600', '700', '800', '900', '950',
];

export function exportAsCSS(
  tokens: GeneratedTokens,
  fontFamily: string
): string {
  const lines: string[] = [':root {'];

  lines.push(`  /* Font */`);
  lines.push(`  --font-family: '${fontFamily}', system-ui, sans-serif;`);
  lines.push('');

  for (const [name, scale] of Object.entries(tokens.colors)) {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    lines.push(`  /* ${label} */`);
    for (const shade of SHADES) {
      lines.push(
        `  --color-${name}-${shade}: ${(scale as ColorScale)[shade]};`
      );
    }
    lines.push('');
  }

  lines.push('  /* Font Size */');
  for (const s of tokens.typography) {
    lines.push(`  --font-size-${s.name}: ${s.size};`);
  }
  lines.push('');

  lines.push('  /* Line Height */');
  for (const s of tokens.typography) {
    lines.push(`  --line-height-${s.name}: ${s.lineHeight};`);
  }
  lines.push('');

  lines.push('  /* Letter Spacing */');
  for (const s of tokens.typography) {
    lines.push(`  --letter-spacing-${s.name}: ${s.letterSpacing};`);
  }
  lines.push('');

  lines.push('  /* Font Weight */');
  for (const s of tokens.typography) {
    lines.push(`  --font-weight-${s.name}: ${s.weight};`);
  }
  lines.push('');

  lines.push('  /* Spacing */');
  for (const s of tokens.spacing) {
    lines.push(`  --spacing-${s.name}: ${s.value};`);
  }
  lines.push('');

  lines.push('  /* Box Shadow */');
  for (const s of tokens.shadows) {
    lines.push(`  --shadow-${s.name}: ${s.value};`);
  }
  lines.push('');

  lines.push('  /* Border Radius */');
  for (const s of tokens.radius) {
    lines.push(`  --radius-${s.name}: ${s.value};`);
  }

  lines.push('}');
  return lines.join('\n');
}

export function exportAsTailwind(
  tokens: GeneratedTokens,
  fontFamily: string
): string {
  const colors: Record<string, Record<string, string>> = {};
  for (const [name, scale] of Object.entries(tokens.colors)) {
    colors[name] = {};
    for (const shade of SHADES) {
      colors[name][shade] = (scale as ColorScale)[shade];
    }
  }

  const fontSize: Record<string, [string, { lineHeight: string; letterSpacing: string }]> = {};
  for (const s of tokens.typography) {
    fontSize[s.name] = [
      s.size,
      { lineHeight: s.lineHeight, letterSpacing: s.letterSpacing },
    ];
  }

  const spacing: Record<string, string> = {};
  for (const s of tokens.spacing) {
    spacing[s.name] = s.value;
  }

  const boxShadow: Record<string, string> = {};
  for (const s of tokens.shadows) {
    boxShadow[s.name] = s.value;
  }

  const borderRadius: Record<string, string> = {};
  for (const s of tokens.radius) {
    borderRadius[s.name] = s.value;
  }

  const config = {
    theme: {
      extend: {
        colors,
        fontFamily: {
          sans: [`'${fontFamily}'`, 'system-ui', 'sans-serif'],
        },
        fontSize,
        spacing,
        boxShadow,
        borderRadius,
      },
    },
  };

  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
}

export function exportAsJSON(
  tokens: GeneratedTokens,
  fontFamily: string
): string {
  const output: Record<string, unknown> = {
    color: {} as Record<string, Record<string, { $value: string }>>,
    font: { family: { $value: `${fontFamily}, system-ui, sans-serif` } },
    fontSize: {} as Record<string, { $value: string }>,
    lineHeight: {} as Record<string, { $value: string }>,
    letterSpacing: {} as Record<string, { $value: string }>,
    fontWeight: {} as Record<string, { $value: number }>,
    spacing: {} as Record<string, { $value: string }>,
    shadow: {} as Record<string, { $value: string }>,
    borderRadius: {} as Record<string, { $value: string }>,
  };

  const color = output.color as Record<string, Record<string, { $value: string }>>;
  for (const [name, scale] of Object.entries(tokens.colors)) {
    color[name] = {};
    for (const shade of SHADES) {
      color[name][shade] = { $value: (scale as ColorScale)[shade] };
    }
  }

  const fs = output.fontSize as Record<string, { $value: string }>;
  const lh = output.lineHeight as Record<string, { $value: string }>;
  const ls = output.letterSpacing as Record<string, { $value: string }>;
  const fw = output.fontWeight as Record<string, { $value: number }>;
  for (const s of tokens.typography) {
    fs[s.name] = { $value: s.size };
    lh[s.name] = { $value: s.lineHeight };
    ls[s.name] = { $value: s.letterSpacing };
    fw[s.name] = { $value: s.weight };
  }

  const sp = output.spacing as Record<string, { $value: string }>;
  for (const s of tokens.spacing) {
    sp[s.name] = { $value: s.value };
  }

  const sh = output.shadow as Record<string, { $value: string }>;
  for (const s of tokens.shadows) {
    sh[s.name] = { $value: s.value };
  }

  const br = output.borderRadius as Record<string, { $value: string }>;
  for (const s of tokens.radius) {
    br[s.name] = { $value: s.value };
  }

  return JSON.stringify(output, null, 2);
}
