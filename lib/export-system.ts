import type { GeneratedTokens, ColorScale, ColorShade } from './types';
import type { DesignConfig } from './component-types';
import { hexToRGB } from './colors';

const SHADES: ColorShade[] = [
  '50','100','200','300','400','500','600','700','800','900','950',
];

function ct(hex: string): string {
  const [r, g, b] = hexToRGB(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000' : '#fff';
}

function swatchRow(name: string, scale: ColorScale): string {
  const swatches = SHADES.map(
    (s) =>
      `<div style="flex:1;text-align:center"><div style="height:40px;background:${scale[s]};border-radius:6px;margin-bottom:6px"></div><div style="font-size:10px;color:#71717a">${s}</div><div style="font-size:9px;color:#a1a1aa;font-family:monospace">${scale[s]}</div></div>`
  ).join('');
  return `<div style="margin-bottom:28px"><h3 style="font-size:13px;font-weight:600;color:#18181b;margin-bottom:8px;text-transform:capitalize">${name}</h3><div style="display:flex;gap:3px">${swatches}</div></div>`;
}

function btn(
  label: string,
  bg: string,
  color: string,
  extra = ''
): string {
  return `<div style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:8px 18px;${bg.includes('gradient') ? 'background' : 'background-color'}:${bg};color:${color};font-size:14px;font-weight:500;border-radius:8px;border:none;${extra}">${label}</div>`;
}

const ARROW_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const PLUS_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const HEART_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

export function generateSystemHTML(
  tokens: GeneratedTokens,
  design: DesignConfig
): string {
  const { primaryColor: pc, secondaryColor: sc, fontFamily: ff } = design;
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const grad = `linear-gradient(to right, ${pc}, ${sc})`;
  const txtOnPrimary = ct(pc);

  const colors = (
    ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'] as const
  )
    .map((n) => swatchRow(n, tokens.colors[n] as ColorScale))
    .join('');

  const typeRows = [...tokens.typography]
    .reverse()
    .map(
      (t) =>
        `<tr><td style="padding:10px 12px;font-weight:600;color:#52525b;font-size:12px;white-space:nowrap">${t.name}</td><td style="padding:10px 12px;font-size:${Math.min(t.sizePx, 36)}px;font-weight:${t.weight};line-height:${t.lineHeight};font-family:${ff},system-ui,sans-serif;color:#18181b">The quick brown fox</td><td style="padding:10px 12px;font-size:12px;color:#71717a;font-family:monospace;white-space:nowrap">${t.sizePx}px</td><td style="padding:10px 12px;font-size:12px;color:#71717a;white-space:nowrap">${t.weight}</td><td style="padding:10px 12px;font-size:12px;color:#71717a;white-space:nowrap">${t.lineHeight}</td><td style="padding:10px 12px;font-size:12px;color:#a1a1aa;font-family:monospace;white-space:nowrap">${t.letterSpacing}</td></tr>`
    )
    .join('');

  const spacingRows = tokens.spacing
    .filter((s) => s.px > 0 && s.px <= 96)
    .map(
      (s) =>
        `<div style="display:flex;align-items:center;gap:12px;padding:4px 0"><span style="width:32px;text-align:right;font-size:11px;font-weight:600;color:#71717a">${s.name}</span><div style="height:8px;width:${Math.min(s.px * 2.5, 280)}px;border-radius:4px;background:${pc};opacity:0.55"></div><span style="font-size:11px;color:#a1a1aa;font-family:monospace">${s.px}px / ${s.value}</span></div>`
    )
    .join('');

  const card = (title: string, desc: string, imgStyle: string, hasAction = false) =>
    `<div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 4px 6px -1px rgb(0 0 0/0.08);flex:1;min-width:200px"><div style="height:140px;${imgStyle}"></div><div style="padding:20px"><div style="font-size:16px;font-weight:600;color:#18181b;margin-bottom:6px;font-family:${ff},system-ui,sans-serif">${title}</div><div style="font-size:13px;color:#71717a;line-height:1.5${hasAction ? ';margin-bottom:14px' : ''}">${desc}</div>${hasAction ? `<div style="display:inline-flex;padding:6px 14px;background:${pc};color:${txtOnPrimary};font-size:13px;font-weight:500;border-radius:8px">Learn More</div>` : ''}</div></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Design System — TokenLab</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${ff},system-ui,-apple-system,sans-serif;color:#18181b;background:#fff;line-height:1.6}
.page{max-width:880px;margin:0 auto;padding:56px 48px}
.cover{margin-bottom:48px;padding-bottom:40px;border-bottom:1px solid #e4e4e7}
.cover h1{font-size:36px;font-weight:800;letter-spacing:-0.025em;margin-bottom:4px}
.cover .meta{font-size:13px;color:#71717a;margin-bottom:20px}
.cover .bar{height:6px;border-radius:3px;background:${grad};max-width:200px}
section{margin-bottom:56px;page-break-inside:avoid}
section h2{font-size:22px;font-weight:700;letter-spacing:-0.01em;color:#18181b;margin-bottom:4px}
section h2 .num{color:#a1a1aa;font-weight:400;margin-right:6px}
section .desc{font-size:14px;color:#71717a;margin-bottom:24px;max-width:600px;line-height:1.7}
.sub{font-size:13px;font-weight:600;color:#3f3f46;margin:24px 0 10px;text-transform:uppercase;letter-spacing:0.05em}
table{width:100%;border-collapse:collapse;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;margin-bottom:8px}
table th{text-align:left;padding:10px 12px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;background:#fafafa;border-bottom:1px solid #e4e4e7}
table td{border-bottom:1px solid #f4f4f5}
table tr:last-child td{border-bottom:none}
.btn-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:8px}
.card-row{display:flex;gap:16px;margin-bottom:8px}
code{display:block;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px 20px;font-size:12px;font-family:'SF Mono',Menlo,monospace;color:#3f3f46;line-height:1.7;overflow-x:auto;white-space:pre;margin-top:12px;margin-bottom:8px}
.spec-grid{display:grid;grid-template-columns:140px 1fr;gap:2px 16px;margin-bottom:16px;font-size:13px}
.spec-grid dt{color:#71717a;font-weight:500}
.spec-grid dd{color:#18181b;font-weight:600;font-family:monospace;font-size:12px}
footer{margin-top:64px;padding-top:24px;border-top:1px solid #e4e4e7;font-size:11px;color:#a1a1aa}
@media print{
  body{font-size:11px}
  .page{padding:32px 24px}
  section{page-break-inside:avoid;margin-bottom:36px}
  code{font-size:10px;page-break-inside:avoid}
  .cover{margin-bottom:32px;padding-bottom:24px}
}
</style>
</head>
<body>
<div class="page">

<!-- COVER -->
<div class="cover">
  <h1>Design System</h1>
  <div class="meta">${ff} &middot; Generated with TokenLab &middot; ${date}</div>
  <div class="bar"></div>
  <dl class="spec-grid" style="margin-top:24px">
    <dt>Primary Color</dt><dd>${pc}</dd>
    <dt>Secondary Color</dt><dd>${sc}</dd>
    <dt>Font Family</dt><dd>${ff}</dd>
    <dt>Type Scale Ratio</dt><dd>1.25 (Major Third)</dd>
    <dt>Base Font Size</dt><dd>16px</dd>
    <dt>Spacing Unit</dt><dd>4px</dd>
    <dt>Border Radius</dt><dd>Rounded</dd>
  </dl>
</div>

<!-- 1. COLORS -->
<section>
  <h2><span class="num">01</span>Color Palette</h2>
  <p class="desc">The color system defines primary, secondary, and semantic palettes. Each color has 11 shades (50–950) for flexible usage across backgrounds, text, borders, and interactive states.</p>
  ${colors}
</section>

<!-- 2. TYPOGRAPHY -->
<section>
  <h2><span class="num">02</span>Typography Scale</h2>
  <p class="desc">A modular type scale based on a 1.25 ratio (Major Third) with a 16px base. Each step includes a recommended weight, line-height, and letter-spacing for optimal readability.</p>
  <table>
    <thead><tr><th>Name</th><th>Sample</th><th>Size</th><th>Weight</th><th>Line Height</th><th>Spacing</th></tr></thead>
    <tbody>${typeRows}</tbody>
  </table>
</section>

<!-- 3. SPACING -->
<section>
  <h2><span class="num">03</span>Spacing Scale</h2>
  <p class="desc">Consistent spacing creates rhythm and hierarchy. Built on a 4px base unit, the scale covers micro-adjustments (1px) through large layout gaps (96px).</p>
  ${spacingRows}
</section>

<!-- 4. BUTTONS -->
<section>
  <h2><span class="num">04</span>Buttons</h2>
  <p class="desc">Button components provide clear interactive affordance. Use variants for visual hierarchy, sizes for context, and gradients for emphasis on primary actions.</p>

  <div class="sub">Variants</div>
  <div class="btn-row">
    ${btn('Primary', pc, txtOnPrimary)}
    ${btn('Secondary', `${pc}1a`, pc)}
    ${btn('Outline', 'transparent', pc, `border:1px solid ${pc}4d`)}
    ${btn('Ghost', 'transparent', pc)}
    ${btn('Destructive', '#ef4444', '#fff')}
  </div>

  <div class="sub">Gradient</div>
  <div class="btn-row">
    ${btn('Gradient Button', grad, '#fff')}
    ${btn('Pill Gradient', `linear-gradient(to bottom right,${pc},${sc})`, '#fff', 'border-radius:9999px')}
  </div>

  <div class="sub">Sizes</div>
  <div class="btn-row" style="align-items:flex-end">
    <div style="display:inline-flex;align-items:center;padding:6px 12px;background:${pc};color:${txtOnPrimary};font-size:12px;font-weight:500;border-radius:8px">Small</div>
    ${btn('Medium', pc, txtOnPrimary)}
    <div style="display:inline-flex;align-items:center;padding:12px 24px;background:${pc};color:${txtOnPrimary};font-size:16px;font-weight:500;border-radius:8px">Large</div>
  </div>

  <div class="sub">With Icons</div>
  <div class="btn-row">
    <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:${pc};color:${txtOnPrimary};font-size:14px;font-weight:500;border-radius:8px">Next ${ARROW_SVG}</div>
    <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:${pc}1a;color:${pc};font-size:14px;font-weight:500;border-radius:8px">${PLUS_SVG} Create</div>
    <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:${grad};color:#fff;font-size:14px;font-weight:500;border-radius:8px">${HEART_SVG} Favorite</div>
  </div>

  <code>/* Primary */
&lt;button class="btn btn-primary"&gt;Label&lt;/button&gt;

/* Gradient */
&lt;button class="btn btn-gradient"&gt;Label&lt;/button&gt;

/* CSS */
.btn { display:inline-flex; align-items:center; gap:8px; padding:8px 16px; font-size:14px; font-weight:500; border-radius:8px; border:none; cursor:pointer; transition:opacity 0.2s; }
.btn-primary { background-color:${pc}; color:${txtOnPrimary}; }
.btn-gradient { background:${grad}; color:#fff; }</code>
</section>

<!-- 5. CARDS -->
<section>
  <h2><span class="num">05</span>Cards</h2>
  <p class="desc">Cards group related content and actions. Support for images, gradient covers, and action buttons makes them versatile across dashboards, marketing pages, and content feeds.</p>

  <div class="card-row">
    ${card('Basic Card', 'Standard card with a subtle tinted placeholder.', `background:linear-gradient(135deg,${pc}18,${pc}40)`)}
    ${card('Gradient Card', 'Uses primary-to-secondary gradient as a cover image.', `background:linear-gradient(to right,${pc},${sc})`)}
    ${card('Action Card', 'Includes a call-to-action button in the body.', `background:linear-gradient(to bottom right,${sc}30,${pc}30)`, true)}
  </div>

  <code>/* Card with image */
&lt;div class="card"&gt;
  &lt;img src="..." alt="" class="card-img" /&gt;
  &lt;div class="card-body"&gt;
    &lt;h3 class="card-title"&gt;Title&lt;/h3&gt;
    &lt;p class="card-text"&gt;Description&lt;/p&gt;
    &lt;button class="btn btn-primary"&gt;Action&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;

/* CSS */
.card { background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e4e4e7; box-shadow:0 4px 6px -1px rgb(0 0 0/0.08); }
.card-img { width:100%; height:192px; object-fit:cover; }
.card-body { padding:24px; }
.card-title { font-size:18px; font-weight:600; color:#18181b; margin-bottom:8px; }
.card-text { font-size:14px; color:#71717a; line-height:1.6; }</code>
</section>

<!-- 6. MODALS -->
<section>
  <h2><span class="num">06</span>Modals</h2>
  <p class="desc">Modal dialogs interrupt the user flow for confirmations, alerts, or focused tasks. Available in small, medium, and large widths. Always include a clear dismiss action.</p>

  <div style="background:#52525b;border-radius:12px;padding:36px;margin-bottom:8px">
    <div style="background:#fff;border-radius:16px;padding:28px;max-width:440px;margin:0 auto;box-shadow:0 25px 50px -12px rgb(0 0 0/0.25)">
      <div style="font-size:18px;font-weight:600;color:#18181b;margin-bottom:8px;font-family:${ff},system-ui,sans-serif">Confirm Action</div>
      <div style="font-size:14px;color:#71717a;line-height:1.6;margin-bottom:24px">Are you sure you want to proceed? This action cannot be undone.</div>
      <div style="display:flex;justify-content:flex-end;gap:12px">
        <div style="padding:8px 16px;font-size:14px;font-weight:500;color:#52525b;border-radius:8px">Cancel</div>
        <div style="padding:8px 16px;background:${pc};color:${txtOnPrimary};font-size:14px;font-weight:500;border-radius:8px">Confirm</div>
      </div>
    </div>
  </div>

  <code>/* Modal */
&lt;div class="modal-overlay"&gt;
  &lt;div class="modal-dialog"&gt;
    &lt;h2 class="modal-title"&gt;Title&lt;/h2&gt;
    &lt;p class="modal-body"&gt;Description&lt;/p&gt;
    &lt;div class="modal-footer"&gt;
      &lt;button class="btn"&gt;Cancel&lt;/button&gt;
      &lt;button class="btn btn-primary"&gt;Confirm&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

/* CSS */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:50; }
.modal-dialog { background:#fff; border-radius:16px; padding:24px; width:100%; max-width:512px; box-shadow:0 25px 50px -12px rgb(0 0 0/0.25); }
.modal-title { font-size:18px; font-weight:600; margin-bottom:8px; }
.modal-body { font-size:14px; color:#71717a; line-height:1.6; }
.modal-footer { display:flex; justify-content:flex-end; gap:12px; margin-top:24px; }</code>
</section>

<!-- 7. CONTAINERS -->
<section>
  <h2><span class="num">07</span>Containers</h2>
  <p class="desc">Container components constrain content width and provide consistent padding. Use background variations — light, dark, and gradient — to create visual hierarchy between page sections.</p>

  <div style="background:#f4f4f5;border-radius:12px;padding:28px;margin-bottom:12px">
    <div style="font-size:17px;font-weight:600;color:#18181b;margin-bottom:8px;font-family:${ff},system-ui,sans-serif">Light Container</div>
    <div style="font-size:14px;color:#71717a;line-height:1.6">Use for secondary content sections or subtle separation between page areas.</div>
  </div>

  <div style="background:#18181b;border-radius:12px;padding:28px;margin-bottom:12px">
    <div style="font-size:17px;font-weight:600;color:#f4f4f5;margin-bottom:8px;font-family:${ff},system-ui,sans-serif">Dark Container</div>
    <div style="font-size:14px;color:#a1a1aa;line-height:1.6">Use for high-contrast sections like footers, CTAs, or feature highlights.</div>
  </div>

  <div style="background:${grad};border-radius:12px;padding:28px;margin-bottom:12px">
    <div style="font-size:17px;font-weight:600;color:#fff;margin-bottom:8px;font-family:${ff},system-ui,sans-serif">Gradient Container</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6">Use for hero sections, promotional banners, or key call-to-action areas.</div>
  </div>

  <code>/* Container variants */
.container       { max-width:768px; margin:0 auto; padding:32px 24px; }
.container-light { background:#f4f4f5; }
.container-dark  { background:#18181b; color:#f4f4f5; }
.container-grad  { background:${grad}; color:#fff; }</code>
</section>

<footer>
  Generated by TokenLab &middot; ${date} &middot; This document is a design reference — adapt tokens and components to your project's stack and conventions.
</footer>

</div>
</body>
</html>`;
}
