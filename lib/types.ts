export type ColorShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

export type ColorScale = Record<ColorShade, string>;

export type RadiusStyle = 'sharp' | 'rounded' | 'pill';

export interface TokenConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  scaleRatio: number;
  baseFontSize: number;
  baseSpacing: number;
  radiusStyle: RadiusStyle;
}

export interface ColorSystem {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
}

export interface TypeStep {
  name: string;
  size: string;
  sizePx: number;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
}

export interface SpacingStep {
  name: string;
  value: string;
  px: number;
}

export interface ShadowStep {
  name: string;
  value: string;
}

export interface RadiusStep {
  name: string;
  value: string;
}

export interface GeneratedTokens {
  colors: ColorSystem;
  typography: TypeStep[];
  spacing: SpacingStep[];
  shadows: ShadowStep[];
  radius: RadiusStep[];
}
