export interface DesignConfig {
  primaryColor: string;
  fontFamily: string;
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
}

export interface CardConfig {
  title: string;
  description: string;
  hasImage: boolean;
  hasActions: boolean;
  actionLabel: string;
  shadow: ShadowLevel;
  padding: ComponentSize;
  radius: RadiusPreset;
  hasBorder: boolean;
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
  background: 'transparent' | 'white' | 'light' | 'dark';
  hasBorder: boolean;
}

export type ComponentType = 'button' | 'card' | 'modal' | 'container';

export const DEFAULT_DESIGN: DesignConfig = {
  primaryColor: '#6366f1',
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
};

export const DEFAULT_CARD: CardConfig = {
  title: 'Card Title',
  description:
    'A brief description that provides context about this card content.',
  hasImage: true,
  hasActions: true,
  actionLabel: 'Learn More',
  shadow: 'md',
  padding: 'md',
  radius: 'lg',
  hasBorder: true,
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
};
