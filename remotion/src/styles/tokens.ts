/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN TOKENS — 10x Limitless Visual Identity
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The single source of truth for every visual decision in the system.
 * Nothing hard-codes a colour, size, or spacing value outside this file.
 *
 * Philosophy:
 *   White is the canvas. Ink is the authority.
 *   One electric accent — used exactly once per frame.
 *   Space is not empty. It's breathing room that costs money.
 */

// ─── COLOUR PALETTE ──────────────────────────────────────────────────────────

export const COLOR = {
  // ── Canvas ────────────────────────────────────────────────────────────────
  /** Pure output white — the base of every frame */
  white:      '#FFFFFF',
  /** Off-white with the warmth of quality paper */
  parchment:  '#FAF9F6',
  /** Warm light grey — secondary surfaces */
  cloud:      '#F2F1EE',
  /** Cool light grey — dividers, hairlines */
  mist:       '#E4E4E1',
  /** Mid grey — disabled states, quiet borders */
  stone:      '#C2C2BE',

  // ── Ink (foreground) ──────────────────────────────────────────────────────
  /** The darkest possible without being harsh: 95% black */
  ink:        '#0D0D0D',
  /** Slightly lifted — body copy, secondary headings */
  graphite:   '#1A1A1A',
  /** Supporting text — subheadings, captions */
  charcoal:   '#3D3D3D',
  /** Tertiary text — labels, timestamps */
  steel:      '#6B6B6B',
  /** Placeholder — quietest readable text */
  fog:        '#A3A3A3',

  // ── Electric (primary accent) ─────────────────────────────────────────────
  // Deep cobalt — authoritative, contemporary, financial premium
  /** Darkest shade — used for pressed/active states */
  electric900: '#0A1A6E',
  electric800: '#0D2394',
  /** Rich, saturated anchor */
  electric700: '#1230B3',
  /** The signature brand accent */
  electric:    '#1A3FD0',   // ← THE ONE
  electric500: '#2855EC',
  electric400: '#5577F5',
  electric300: '#8AA3FA',
  electric100: '#D6E0FF',
  electric50:  '#EEF2FF',

  // ── Gold (secondary accent) ───────────────────────────────────────────────
  // Matte gold — not garish, more like anodised metal
  gold700:    '#8A6500',
  gold:       '#C8963E',   // ← THE ONE
  gold400:    '#E0B55A',
  gold100:    '#FDF3DC',

  // ── Signal (semantic) ─────────────────────────────────────────────────────
  /** Bullish / positive / success */
  emerald:    '#059669',
  emerald100: '#D1FAE5',
  /** Bearish / negative / danger */
  crimson:    '#DC2626',
  crimson100: '#FEE2E2',
  /** Warning / caution */
  amber:      '#D97706',
  amber100:   '#FEF3C7',
} as const;

export type ColorToken = typeof COLOR;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────

export const FONT = {
  // Font stacks — the system picks the best available
  family: {
    /** All display & heading text */
    display: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    /** Long-form body copy */
    body:    '"Inter", "Helvetica Neue", "Arial", sans-serif',
    /** Numbers, data, code */
    mono:    '"JetBrains Mono", "Fira Code", "Courier New", monospace',
  },

  /**
   * Scale calibrated for 1920×1080.
   * Rule: the largest element on screen should be uncomfortable.
   * If it doesn't feel too big in the editor, it isn't big enough.
   */
  size: {
    display3: 240,   // Hero "one word" statements
    display2: 180,   // Big section titles
    display1: 140,   // Standard hero headline
    h1:       100,   // Section heading
    h2:        72,   // Subsection heading
    h3:        52,   // Card title
    h4:        40,   // Label heading
    h5:        32,   // Strong body
    bodyXl:    30,   // Pull quote / lead
    body:      26,   // Standard body
    bodySm:    22,   // Supporting body
    caption:   18,   // Caption / metadata
    eyebrow:   16,   // Uppercase tag above headline
    label:     14,   // Smallest legible text
  },

  weight: {
    thin:       100,
    extralight: 200,
    light:      300,
    regular:    400,
    medium:     500,
    semibold:   600,
    bold:       700,
    extrabold:  800,
    black:      900,
  },

  leading: {
    /** Headline / display — letters nearly touching */
    none:    1.0,
    tightest: 1.05,
    tight:   1.1,
    snug:    1.2,
    /** Body text default */
    normal:  1.5,
    relaxed: 1.65,
    loose:   1.8,
  },

  /** Letter-spacing in em units */
  tracking: {
    tightest: -0.04,
    tighter:  -0.025,
    tight:    -0.015,
    normal:    0,
    wide:      0.06,
    wider:     0.12,
    /** Eyebrow / allcaps labels */
    widest:    0.20,
  },
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────

/**
 * 8-point grid system.
 * All layout values should be multiples of 8 for pixel-perfect alignment.
 */
export const SPACE = {
  0:    0,
  1:    4,
  2:    8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  8:   32,
  10:  40,
  12:  48,
  16:  64,
  20:  80,
  24:  96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
  80: 320,
} as const;

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────

export const RADIUS = {
  none:  0,
  xs:    4,
  sm:    8,
  md:   16,
  lg:   24,
  xl:   32,
  '2xl': 48,
  '3xl': 64,
  full:  9999,
} as const;

// ─── ELEVATION / SHADOW ───────────────────────────────────────────────────────

/**
 * Layered shadow system.
 * Each level uses two shadows: a wide ambient and a tight key shadow.
 * This creates realistic depth without looking 'designed by a robot'.
 */
export const SHADOW = {
  none:  'none',

  /** Hairline lift — cards on white backgrounds */
  xs:    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',

  /** Resting elevation — standard cards */
  sm:    '0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',

  /** Hover state / floating elements */
  md:    '0 8px 32px rgba(0,0,0,0.07), 0 3px 8px rgba(0,0,0,0.04)',

  /** Modals / overlays above the canvas */
  lg:    '0 16px 64px rgba(0,0,0,0.09), 0 6px 16px rgba(0,0,0,0.05)',

  /** Dramatic hero element */
  xl:    '0 24px 96px rgba(0,0,0,0.11), 0 10px 28px rgba(0,0,0,0.06)',

  /** Maximum depth — use once per scene */
  '2xl': '0 40px 140px rgba(0,0,0,0.14), 0 16px 48px rgba(0,0,0,0.07)',

  // ── Tinted shadows — dramatic glow effects ────────────────────────────────
  electric: '0 8px 60px rgba(26,63,208,0.22), 0 2px 12px rgba(26,63,208,0.14)',
  gold:     '0 8px 60px rgba(200,150,62,0.25), 0 2px 12px rgba(200,150,62,0.14)',
  ink:      '0 12px 80px rgba(0,0,0,0.30), 0 4px 20px rgba(0,0,0,0.18)',
  emerald:  '0 8px 60px rgba(5,150,105,0.20), 0 2px 12px rgba(5,150,105,0.12)',
  crimson:  '0 8px 60px rgba(220,38,38,0.20), 0 2px 12px rgba(220,38,38,0.12)',
} as const;

// ─── CANVAS / GRID ────────────────────────────────────────────────────────────

/**
 * Compositional grid system.
 * Every element should snap to this grid consciously.
 */
export const CANVAS = {
  width:   1920,
  height:  1080,

  /** 12-column grid */
  columns: 12,
  gutter:   40,

  /**
   * Safe zone — keep all primary content inside these margins.
   * Mirrors broadcast "title safe" area conventions.
   */
  margin: {
    horizontal: 120,
    vertical:    80,
  },

  /** Inner content width after margins */
  get contentWidth() {
    return this.width - this.margin.horizontal * 2;
  },

  /** Inner content height after margins */
  get contentHeight() {
    return this.height - this.margin.vertical * 2;
  },

  /** Column width in the 12-col grid */
  get colWidth() {
    return (this.contentWidth - this.gutter * (this.columns - 1)) / this.columns;
  },

  /** Return pixel width for n columns */
  cols(n: number, gap = true) {
    return this.colWidth * n + this.gutter * (n - (gap ? 0 : 1));
  },
} as const;

// ─── STROKE / BORDER ─────────────────────────────────────────────────────────

export const STROKE = {
  hairline: 1,
  thin:     2,
  base:     3,
  thick:    5,
  heavy:    8,
  xl:      12,
} as const;
