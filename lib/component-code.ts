import { hexToRGB } from './colors';
import type {
  ButtonConfig,
  CardConfig,
  ModalConfig,
  ContainerConfig,
  DesignConfig,
  GradientConfig,
} from './component-types';

function contrast(hex: string): string {
  const [r, g, b] = hexToRGB(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    ? '#000000'
    : '#ffffff';
}

function gradientCSS(g: GradientConfig): string {
  return `linear-gradient(${g.direction}, ${g.from}, ${g.to})`;
}

const TW_DIR: Record<string, string> = {
  'to right': 'bg-gradient-to-r',
  'to bottom right': 'bg-gradient-to-br',
  'to bottom': 'bg-gradient-to-b',
  'to bottom left': 'bg-gradient-to-bl',
};

const TW_PAD: Record<string, string> = { sm: 'px-3 py-1.5', md: 'px-4 py-2', lg: 'px-6 py-3' };
const TW_TEXT: Record<string, string> = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
const ICON_PX: Record<string, number> = { sm: 14, md: 16, lg: 18 };
const TW_RAD: Record<string, string> = { none: 'rounded-none', sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full' };
const TW_SHADOW: Record<string, string> = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' };
const TW_CARD_PAD: Record<string, string> = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
const TW_MAXW: Record<string, string> = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-3xl', xl: 'max-w-6xl', full: 'max-w-full' };
const TW_CONT_PAD: Record<string, string> = { sm: 'px-4 py-6', md: 'px-6 py-8', lg: 'px-8 py-12' };
const TW_MODAL_W: Record<string, string> = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

const CSS_PAD: Record<string, { x: number; y: number }> = { sm: { x: 12, y: 6 }, md: { x: 16, y: 8 }, lg: { x: 24, y: 12 } };
const CSS_FS: Record<string, number> = { sm: 12, md: 14, lg: 16 };
const CSS_RAD: Record<string, string> = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' };
const CSS_SHADOW: Record<string, string> = { none: 'none', sm: '0 1px 2px rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)' };
const CSS_CARD_PAD: Record<string, number> = { sm: 16, md: 24, lg: 32 };
const CSS_MAXW: Record<string, string> = { sm: '384px', md: '448px', lg: '768px', xl: '1152px', full: '100%' };
const CSS_CONT_PAD: Record<string, string> = { sm: '24px 16px', md: '32px 24px', lg: '48px 32px' };
const CSS_MODAL_W: Record<string, string> = { sm: '384px', md: '512px', lg: '672px' };

/* ─── BUTTON ─── */

export function generateButtonCode(c: ButtonConfig, d: DesignConfig): { react: string; html: string } {
  const txtCol = contrast(d.primaryColor) === '#ffffff' ? 'white' : 'black';
  const sz = ICON_PX[c.size];

  let variant: string;
  if (c.gradient.enabled) {
    variant = `${TW_DIR[c.gradient.direction]} from-[${c.gradient.from}] to-[${c.gradient.to}] text-white hover:opacity-90`;
  } else {
    switch (c.variant) {
      case 'primary':
        variant = `bg-[${d.primaryColor}] text-${txtCol} hover:opacity-90`; break;
      case 'secondary':
        variant = `bg-[${d.primaryColor}]/10 text-[${d.primaryColor}] hover:bg-[${d.primaryColor}]/20`; break;
      case 'outline':
        variant = `border border-[${d.primaryColor}]/30 text-[${d.primaryColor}] hover:bg-[${d.primaryColor}]/5`; break;
      case 'ghost':
        variant = `text-[${d.primaryColor}] hover:bg-[${d.primaryColor}]/10`; break;
      case 'destructive':
        variant = 'bg-red-500 text-white hover:bg-red-600'; break;
    }
  }

  const cls = [
    'inline-flex items-center justify-center gap-2',
    TW_PAD[c.size], TW_TEXT[c.size], 'font-medium', TW_RAD[c.radius],
    variant, 'transition-all', c.fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  const imp = c.icon ? `import { ${c.icon} } from 'lucide-react';\n\n` : '';
  const iL = c.icon && c.iconPosition === 'left' ? `\n      <${c.icon} size={${sz}} />` : '';
  const iR = c.icon && c.iconPosition === 'right' ? `\n      <${c.icon} size={${sz}} />` : '';

  const react = `${imp}export function Button() {
  return (
    <button className="${cls}">${iL}
      ${c.label}${iR}
    </button>
  );
}`;

  const sc = CSS_PAD[c.size];
  const rc = CSS_RAD[c.radius];
  let bg: string, col: string, hov: string, bdr: string;
  if (c.gradient.enabled) {
    bg = `background: ${gradientCSS(c.gradient)};`;
    col = '#ffffff';
    hov = 'opacity: 0.9;';
    bdr = 'border: none;';
  } else {
    switch (c.variant) {
      case 'primary': bg = `background-color: ${d.primaryColor};`; col = contrast(d.primaryColor); hov = 'opacity: 0.9;'; bdr = 'border: none;'; break;
      case 'secondary': bg = `background-color: ${d.primaryColor}1a;`; col = d.primaryColor; hov = `background-color: ${d.primaryColor}33;`; bdr = 'border: none;'; break;
      case 'outline': bg = 'background-color: transparent;'; col = d.primaryColor; hov = `background-color: ${d.primaryColor}0d;`; bdr = `border: 1px solid ${d.primaryColor}4d;`; break;
      case 'ghost': bg = 'background-color: transparent;'; col = d.primaryColor; hov = `background-color: ${d.primaryColor}1a;`; bdr = 'border: none;'; break;
      case 'destructive': bg = 'background-color: #ef4444;'; col = '#ffffff'; hov = 'background-color: #dc2626;'; bdr = 'border: none;'; break;
    }
  }
  const iconComment = c.icon ? `\n  <!-- Icon: ${c.icon} -->` : '';
  const fw = c.fullWidth ? '\n    width: 100%;' : '';

  const html = `<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: ${sc.y}px ${sc.x}px;
    ${bg!}
    color: ${col!};
    font-size: ${CSS_FS[c.size]}px;
    font-weight: 500;
    border-radius: ${rc};
    ${bdr!}
    cursor: pointer;
    transition: all 0.2s;${fw}
  }
  .button:hover { ${hov!} }
</style>

<button class="button">${iconComment}
  ${c.label}
</button>`;

  return { react, html };
}

/* ─── CARD ─── */

export function generateCardCode(c: CardConfig, d: DesignConfig): { react: string; html: string } {
  const shadow = TW_SHADOW[c.shadow];
  const rad = TW_RAD[c.radius];
  const pad = TW_CARD_PAD[c.padding];
  const border = c.hasBorder ? 'border border-zinc-200' : '';
  const containerCls = ['bg-white overflow-hidden', rad, shadow, border, 'max-w-sm'].filter(Boolean).join(' ');
  const txtCol = contrast(d.primaryColor) === '#ffffff' ? 'white' : 'black';

  let imgBlock = '';
  if (c.gradientBg.enabled) {
    imgBlock = `\n      <div className="h-48 ${TW_DIR[c.gradientBg.direction]} from-[${c.gradientBg.from}] to-[${c.gradientBg.to}]" />`;
  } else if (c.hasImage && c.imageUrl) {
    imgBlock = `\n      <img src="${c.imageUrl}" alt="" className="w-full h-48 object-cover" />`;
  } else if (c.hasImage) {
    imgBlock = `\n      <div className="h-48 bg-gradient-to-br from-[${d.primaryColor}]/10 to-[${d.primaryColor}]/30" />`;
  }

  const actionBlock = c.hasActions
    ? `\n        <button className="mt-4 ${TW_PAD.md} bg-[${d.primaryColor}] text-${txtCol} text-sm font-medium ${TW_RAD.md} hover:opacity-90 transition-opacity">\n          ${c.actionLabel}\n        </button>`
    : '';

  const react = `export function Card() {
  return (
    <div className="${containerCls}">${imgBlock}
      <div className="${pad}">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">${c.title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">${c.description}</p>${actionBlock}
      </div>
    </div>
  );
}`;

  const cRad = CSS_RAD[c.radius];
  const cShadow = CSS_SHADOW[c.shadow];
  const cPad = CSS_CARD_PAD[c.padding];
  const cBorder = c.hasBorder ? 'border: 1px solid #e4e4e7;' : '';

  let imgCSS = '', imgHTML = '';
  if (c.gradientBg.enabled) {
    imgCSS = `\n  .card-image { height: 192px; background: ${gradientCSS(c.gradientBg)}; }`;
    imgHTML = '\n  <div class="card-image"></div>';
  } else if (c.hasImage && c.imageUrl) {
    imgCSS = `\n  .card-image { width: 100%; height: 192px; object-fit: cover; }`;
    imgHTML = `\n  <img class="card-image" src="${c.imageUrl}" alt="" />`;
  } else if (c.hasImage) {
    imgCSS = `\n  .card-image { height: 192px; background: linear-gradient(135deg, ${d.primaryColor}1a, ${d.primaryColor}4d); }`;
    imgHTML = '\n  <div class="card-image"></div>';
  }

  const actionCSS = c.hasActions
    ? `\n  .card-action { margin-top: 1rem; padding: 8px 16px; background-color: ${d.primaryColor}; color: ${contrast(d.primaryColor)}; font-size: 14px; font-weight: 500; border-radius: 0.5rem; border: none; cursor: pointer; }`
    : '';
  const actionHTML = c.hasActions ? `\n    <button class="card-action">${c.actionLabel}</button>` : '';

  const html = `<style>
  .card { background: #fff; border-radius: ${cRad}; box-shadow: ${cShadow}; overflow: hidden; max-width: 384px; ${cBorder} }${imgCSS}
  .card-body { padding: ${cPad}px; }
  .card-title { font-size: 18px; font-weight: 600; color: #18181b; margin-bottom: 8px; }
  .card-text { font-size: 14px; color: #71717a; line-height: 1.6; }${actionCSS}
</style>

<div class="card">${imgHTML}
  <div class="card-body">
    <h3 class="card-title">${c.title}</h3>
    <p class="card-text">${c.description}</p>${actionHTML}
  </div>
</div>`;

  return { react, html };
}

/* ─── MODAL ─── */

export function generateModalCode(c: ModalConfig, d: DesignConfig): { react: string; html: string } {
  const mw = TW_MODAL_W[c.size];
  const txtCol = contrast(d.primaryColor) === '#ffffff' ? 'white' : 'black';
  const footer = c.hasFooter
    ? `\n        <div className="flex justify-end gap-3 mt-6">\n          <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors" onClick={onClose}>\n            ${c.cancelLabel}\n          </button>\n          <button className="px-4 py-2 bg-[${d.primaryColor}] text-${txtCol} text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">\n            ${c.confirmLabel}\n          </button>\n        </div>` : '';

  const react = `export function Modal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full ${mw} mx-4 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">${c.title}</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">${c.body}</p>${footer}
      </div>
    </div>
  );
}`;

  const cmw = CSS_MODAL_W[c.size];
  const footerCSS = c.hasFooter
    ? `\n  .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }\n  .modal-cancel { padding: 8px 16px; font-size: 14px; font-weight: 500; color: #52525b; background: none; border: none; border-radius: 0.5rem; cursor: pointer; }\n  .modal-confirm { padding: 8px 16px; background-color: ${d.primaryColor}; color: ${contrast(d.primaryColor)}; font-size: 14px; font-weight: 500; border-radius: 0.5rem; border: none; cursor: pointer; }` : '';
  const footerHTML = c.hasFooter
    ? `\n    <div class="modal-footer">\n      <button class="modal-cancel">${c.cancelLabel}</button>\n      <button class="modal-confirm">${c.confirmLabel}</button>\n    </div>` : '';

  const html = `<style>
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .modal-dialog { background: #fff; border-radius: 1rem; padding: 1.5rem; width: 100%; max-width: ${cmw}; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
  .modal-title { font-size: 18px; font-weight: 600; color: #18181b; margin-bottom: 8px; }
  .modal-body { font-size: 14px; color: #71717a; line-height: 1.6; }${footerCSS}
</style>

<div class="modal-overlay">
  <div class="modal-dialog">
    <h2 class="modal-title">${c.title}</h2>
    <p class="modal-body">${c.body}</p>${footerHTML}
  </div>
</div>`;

  return { react, html };
}

/* ─── CONTAINER ─── */

export function generateContainerCode(c: ContainerConfig, d: DesignConfig): { react: string; html: string } {
  const mw = TW_MAXW[c.maxWidth];
  const pad = TW_CONT_PAD[c.padding];
  const bgMap: Record<string, string> = { transparent: '', white: 'bg-white', light: 'bg-zinc-50', dark: 'bg-zinc-900 text-white', gradient: '' };
  const border = c.hasBorder ? 'border border-zinc-200' : '';

  let bgCls = bgMap[c.background];
  if (c.background === 'gradient' && c.gradientBg.enabled) {
    bgCls = `${TW_DIR[c.gradientBg.direction]} from-[${c.gradientBg.from}] to-[${c.gradientBg.to}] text-white`;
  }

  const cls = ['mx-auto', mw, pad, bgCls, border].filter(Boolean).join(' ');
  void d;

  const react = `export function Container({ children }) {
  return (
    <div className="${cls}">
      {children}
    </div>
  );
}`;

  const cmw = CSS_MAXW[c.maxWidth];
  const cpad = CSS_CONT_PAD[c.padding];
  const cssMap: Record<string, string> = { transparent: 'transparent', white: '#ffffff', light: '#fafafa', dark: '#18181b' };
  let bgStyle: string;
  let textCSS: string;
  if (c.background === 'gradient' && c.gradientBg.enabled) {
    bgStyle = `background: ${gradientCSS(c.gradientBg)};`;
    textCSS = '#ffffff';
  } else {
    bgStyle = `background-color: ${cssMap[c.background] ?? 'transparent'};`;
    textCSS = c.background === 'dark' ? '#ffffff' : '#18181b';
  }
  const borderCSS = c.hasBorder ? '\n    border: 1px solid #e4e4e7;' : '';

  const html = `<style>
  .container { max-width: ${cmw}; margin: 0 auto; padding: ${cpad}; ${bgStyle} color: ${textCSS};${borderCSS} }
</style>

<div class="container">
  <!-- Your content here -->
</div>`;

  return { react, html };
}
