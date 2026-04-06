import {
  TokenConfig,
  GeneratedTokens,
  TypeStep,
  SpacingStep,
  ShadowStep,
  RadiusStep,
  RadiusStyle,
} from './types';
import {
  generateColorScale,
  generateNeutralScale,
  generateSemanticScales,
  hexToHSL,
  hexToRGB,
  hslToHex,
} from './colors';

export function generateAllTokens(config: TokenConfig): GeneratedTokens {
  const semantic = generateSemanticScales();

  return {
    colors: {
      primary: generateColorScale(config.primaryColor),
      secondary: generateColorScale(config.secondaryColor),
      neutral: generateNeutralScale(config.primaryColor),
      ...semantic,
    },
    typography: generateTypography(config.baseFontSize, config.scaleRatio),
    spacing: generateSpacing(config.baseSpacing),
    shadows: generateShadows(config.primaryColor),
    radius: generateRadius(config.radiusStyle),
  };
}

function generateTypography(
  baseFontSize: number,
  scaleRatio: number
): TypeStep[] {
  const steps = [
    { name: 'xs', level: -2, weight: 400 },
    { name: 'sm', level: -1, weight: 400 },
    { name: 'base', level: 0, weight: 400 },
    { name: 'lg', level: 1, weight: 500 },
    { name: 'xl', level: 2, weight: 500 },
    { name: '2xl', level: 3, weight: 600 },
    { name: '3xl', level: 4, weight: 600 },
    { name: '4xl', level: 5, weight: 700 },
    { name: '5xl', level: 6, weight: 700 },
    { name: '6xl', level: 7, weight: 800 },
  ];

  return steps.map(({ name, level, weight }) => {
    const sizePx = baseFontSize * Math.pow(scaleRatio, level);
    const lineHeight =
      sizePx < 20 ? 1.6 : sizePx < 32 ? 1.4 : sizePx < 48 ? 1.2 : 1.1;
    const letterSpacing =
      sizePx > 36 ? '-0.025em' : sizePx > 20 ? '-0.01em' : '0em';

    return {
      name,
      size: `${parseFloat((sizePx / 16).toFixed(4))}rem`,
      sizePx: parseFloat(sizePx.toFixed(1)),
      lineHeight: lineHeight.toFixed(1),
      letterSpacing,
      weight,
    };
  });
}

function generateSpacing(base: number): SpacingStep[] {
  const steps = [
    { name: '0', mult: 0 },
    { name: 'px', mult: 0.25 },
    { name: '0.5', mult: 0.5 },
    { name: '1', mult: 1 },
    { name: '1.5', mult: 1.5 },
    { name: '2', mult: 2 },
    { name: '3', mult: 3 },
    { name: '4', mult: 4 },
    { name: '5', mult: 5 },
    { name: '6', mult: 6 },
    { name: '8', mult: 8 },
    { name: '10', mult: 10 },
    { name: '12', mult: 12 },
    { name: '16', mult: 16 },
    { name: '20', mult: 20 },
    { name: '24', mult: 24 },
  ];

  return steps.map(({ name, mult }) => {
    const px = base * mult;
    return {
      name,
      value: px === 0 ? '0px' : `${parseFloat((px / 16).toFixed(4))}rem`,
      px,
    };
  });
}

function generateShadows(primaryHex: string): ShadowStep[] {
  const { h, s } = hexToHSL(primaryHex);
  const shadowHex = hslToHex(h, Math.min(s, 0.12), 0.08);
  const [r, g, b] = hexToRGB(shadowHex);

  return [
    {
      name: 'xs',
      value: `0 1px 2px 0 rgba(${r}, ${g}, ${b}, 0.05)`,
    },
    {
      name: 'sm',
      value: `0 1px 3px 0 rgba(${r}, ${g}, ${b}, 0.1), 0 1px 2px -1px rgba(${r}, ${g}, ${b}, 0.1)`,
    },
    {
      name: 'md',
      value: `0 4px 6px -1px rgba(${r}, ${g}, ${b}, 0.1), 0 2px 4px -2px rgba(${r}, ${g}, ${b}, 0.1)`,
    },
    {
      name: 'lg',
      value: `0 10px 15px -3px rgba(${r}, ${g}, ${b}, 0.1), 0 4px 6px -4px rgba(${r}, ${g}, ${b}, 0.1)`,
    },
    {
      name: 'xl',
      value: `0 20px 25px -5px rgba(${r}, ${g}, ${b}, 0.1), 0 8px 10px -6px rgba(${r}, ${g}, ${b}, 0.1)`,
    },
    {
      name: '2xl',
      value: `0 25px 50px -12px rgba(${r}, ${g}, ${b}, 0.25)`,
    },
  ];
}

function generateRadius(style: RadiusStyle): RadiusStep[] {
  const bases: Record<RadiusStyle, Record<string, number>> = {
    sharp: { sm: 2, md: 4, lg: 6, xl: 8, '2xl': 12 },
    rounded: { sm: 4, md: 8, lg: 12, xl: 16, '2xl': 24 },
    pill: { sm: 8, md: 16, lg: 24, xl: 32, '2xl': 9999 },
  };

  const v = bases[style];

  return [
    { name: 'none', value: '0px' },
    { name: 'sm', value: `${v.sm}px` },
    { name: 'md', value: `${v.md}px` },
    { name: 'lg', value: `${v.lg}px` },
    { name: 'xl', value: `${v.xl}px` },
    { name: '2xl', value: `${v['2xl']}px` },
    { name: 'full', value: '9999px' },
  ];
}
