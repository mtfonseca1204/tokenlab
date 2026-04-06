export interface DesignConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface GradientConfig {
  enabled: boolean;
  from: string;
  to: string;
  direction: 'to right' | 'to bottom right' | 'to bottom' | 'to bottom left';
}

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonConfig {
  label: string;
  variant: ButtonVariant;
  size: ComponentSize;
  radius: RadiusPreset;
  icon: string | null;
  iconPosition: 'left' | 'right';
  fullWidth: boolean;
  gradient: GradientConfig;
}

export interface CardConfig {
  title: string;
  description: string;
  hasImage: boolean;
  imageUrl: string;
  /** Horizontal focal point for object-position (0 = left, 100 = right). */
  imageFocalX: number;
  /** Vertical focal point for object-position (0 = top, 100 = bottom). */
  imageFocalY: number;
  hasActions: boolean;
  actionLabel: string;
  shadow: ShadowLevel;
  padding: ComponentSize;
  radius: RadiusPreset;
  hasBorder: boolean;
  gradientBg: GradientConfig;
}

export interface ModalConfig {
  title: string;
  body: string;
  size: ComponentSize;
  hasFooter: boolean;
  confirmLabel: string;
  cancelLabel: string;
}

export interface ContainerConfig {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding: ComponentSize;
  background: 'transparent' | 'white' | 'light' | 'dark' | 'gradient';
  hasBorder: boolean;
  gradientBg: GradientConfig;
}

export type ComponentType = 'button' | 'card' | 'modal' | 'container';

export const GRADIENT_DIRECTIONS = [
  'to right',
  'to bottom right',
  'to bottom',
  'to bottom left',
] as const;

export const DEFAULT_GRADIENT: GradientConfig = {
  enabled: false,
  from: '#6366f1',
  to: '#a855f7',
  direction: 'to right',
};

export const DEFAULT_DESIGN: DesignConfig = {
  primaryColor: '#6366f1',
  secondaryColor: '#a855f7',
  fontFamily: 'Inter',
};

export const DEFAULT_BUTTON: ButtonConfig = {
  label: 'Get Started',
  variant: 'primary',
  size: 'md',
  radius: 'md',
  icon: 'ArrowRight',
  iconPosition: 'right',
  fullWidth: false,
  gradient: { ...DEFAULT_GRADIENT },
};

export const DEFAULT_CARD: CardConfig = {
  title: 'Card Title',
  description:
    'A brief description that provides context about this card content.',
  hasImage: true,
  imageUrl: '',
  imageFocalX: 50,
  imageFocalY: 50,
  hasActions: true,
  actionLabel: 'Learn More',
  shadow: 'md',
  padding: 'md',
  radius: 'lg',
  hasBorder: true,
  gradientBg: { ...DEFAULT_GRADIENT },
};

export const DEFAULT_MODAL: ModalConfig = {
  title: 'Confirm Action',
  body: 'Are you sure you want to proceed? This action cannot be undone.',
  size: 'md',
  hasFooter: true,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
};

export const DEFAULT_CONTAINER: ContainerConfig = {
  maxWidth: 'lg',
  padding: 'md',
  background: 'white',
  hasBorder: false,
  gradientBg: { ...DEFAULT_GRADIENT },
};
