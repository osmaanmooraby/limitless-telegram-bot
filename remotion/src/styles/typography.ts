/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TYPOGRAPHY STYLES — 10x Limitless
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Pre-composed text style objects ready to spread into React inline styles.
 *
 * Usage:
 *   <div style={{ ...TEXT.display1, color: COLOR.electric }}>Big Statement</div>
 *
 * Every style in this file is calibrated for 1920×1080.
 * For vertical (1080×1920) compositions, scale: 1920/1080 ≈ 0.56× all sizes.
 */

import type { CSSProperties } from 'react';
import { COLOR, FONT } from './tokens';

// ─── SHARED BASE ─────────────────────────────────────────────────────────────

const base: CSSProperties = {
  fontFamily: FONT.family.display,
  color: COLOR.ink,
  margin: 0,
  padding: 0,
};

// ─── DISPLAY STYLES ───────────────────────────────────────────────────────────

export const TEXT = {

  /**
   * Display 3 — the largest text possible.
   * Use for: single-word hero reveals, numbers that fill the frame.
   */
  display3: {
    ...base,
    fontSize: FONT.size.display3,
    fontWeight: FONT.weight.black,
    lineHeight: FONT.leading.tightest,
    letterSpacing: `${FONT.tracking.tightest}em`,
  } satisfies CSSProperties,

  /**
   * Display 2 — full-frame headline.
   * Use for: episode titles, major section openers.
   */
  display2: {
    ...base,
    fontSize: FONT.size.display2,
    fontWeight: FONT.weight.black,
    lineHeight: FONT.leading.tightest,
    letterSpacing: `${FONT.tracking.tightest}em`,
  } satisfies CSSProperties,

  /**
   * Display 1 — hero headline (workhorse of intro scenes).
   * Use for: main titles, bold claims.
   */
  display1: {
    ...base,
    fontSize: FONT.size.display1,
    fontWeight: FONT.weight.extrabold,
    lineHeight: FONT.leading.tight,
    letterSpacing: `${FONT.tracking.tighter}em`,
  } satisfies CSSProperties,

  /**
   * H1 — strong section heading.
   */
  h1: {
    ...base,
    fontSize: FONT.size.h1,
    fontWeight: FONT.weight.bold,
    lineHeight: FONT.leading.tight,
    letterSpacing: `${FONT.tracking.tight}em`,
  } satisfies CSSProperties,

  /**
   * H2 — subsection heading.
   */
  h2: {
    ...base,
    fontSize: FONT.size.h2,
    fontWeight: FONT.weight.bold,
    lineHeight: FONT.leading.snug,
    letterSpacing: `${FONT.tracking.tight}em`,
  } satisfies CSSProperties,

  /**
   * H3 — card title or list item heading.
   */
  h3: {
    ...base,
    fontSize: FONT.size.h3,
    fontWeight: FONT.weight.semibold,
    lineHeight: FONT.leading.snug,
    letterSpacing: `${FONT.tracking.normal}em`,
  } satisfies CSSProperties,

  /**
   * H4 — labelled heading within content blocks.
   */
  h4: {
    ...base,
    fontSize: FONT.size.h4,
    fontWeight: FONT.weight.semibold,
    lineHeight: FONT.leading.normal,
    letterSpacing: `${FONT.tracking.normal}em`,
  } satisfies CSSProperties,

  /**
   * Lead / pull quote — large body copy, high impact.
   */
  lead: {
    ...base,
    fontSize: FONT.size.bodyXl,
    fontWeight: FONT.weight.medium,
    lineHeight: FONT.leading.relaxed,
    letterSpacing: `${FONT.tracking.normal}em`,
    color: COLOR.graphite,
  } satisfies CSSProperties,

  /**
   * Body — standard long-form copy.
   */
  body: {
    ...base,
    fontSize: FONT.size.body,
    fontWeight: FONT.weight.regular,
    lineHeight: FONT.leading.normal,
    color: COLOR.charcoal,
  } satisfies CSSProperties,

  /**
   * Body Small — supporting copy, less emphasis.
   */
  bodySm: {
    ...base,
    fontSize: FONT.size.bodySm,
    fontWeight: FONT.weight.regular,
    lineHeight: FONT.leading.relaxed,
    color: COLOR.steel,
  } satisfies CSSProperties,

  /**
   * Caption — metadata, timestamps, footnotes.
   */
  caption: {
    ...base,
    fontSize: FONT.size.caption,
    fontWeight: FONT.weight.regular,
    lineHeight: FONT.leading.normal,
    color: COLOR.fog,
  } satisfies CSSProperties,

  /**
   * Eyebrow — always uppercase, always tracked.
   * Lives above headlines to categorise content.
   * e.g. "MARKET ANALYSIS • EPISODE 12"
   */
  eyebrow: {
    ...base,
    fontSize: FONT.size.eyebrow,
    fontWeight: FONT.weight.semibold,
    lineHeight: FONT.leading.none,
    letterSpacing: `${FONT.tracking.widest}em`,
    textTransform: 'uppercase' as const,
    color: COLOR.steel,
  } satisfies CSSProperties,

  /**
   * Label — smallest text in the system. Badges, tags.
   */
  label: {
    ...base,
    fontSize: FONT.size.label,
    fontWeight: FONT.weight.medium,
    lineHeight: FONT.leading.none,
    letterSpacing: `${FONT.tracking.wide}em`,
    textTransform: 'uppercase' as const,
    color: COLOR.steel,
  } satisfies CSSProperties,

  // ── Numeric / Data styles ─────────────────────────────────────────────────

  /**
   * Stat Large — for big KPI numbers that dominate a frame.
   * e.g. "+847%" filling the screen.
   */
  statLarge: {
    ...base,
    fontFamily: FONT.family.mono,
    fontSize: FONT.size.display2,
    fontWeight: FONT.weight.black,
    lineHeight: FONT.leading.none,
    letterSpacing: `${FONT.tracking.tightest}em`,
    fontVariantNumeric: 'tabular-nums',
  } satisfies CSSProperties,

  /**
   * Stat — standard KPI number in data panels.
   */
  stat: {
    ...base,
    fontFamily: FONT.family.mono,
    fontSize: FONT.size.h1,
    fontWeight: FONT.weight.bold,
    lineHeight: FONT.leading.none,
    fontVariantNumeric: 'tabular-nums',
  } satisfies CSSProperties,

  /**
   * Data — tabular data, prices, percentages.
   */
  data: {
    ...base,
    fontFamily: FONT.family.mono,
    fontSize: FONT.size.h3,
    fontWeight: FONT.weight.medium,
    lineHeight: FONT.leading.snug,
    fontVariantNumeric: 'tabular-nums',
  } satisfies CSSProperties,

  /**
   * Ticker — single-line running data (price ticker etc.)
   */
  ticker: {
    ...base,
    fontFamily: FONT.family.mono,
    fontSize: FONT.size.h4,
    fontWeight: FONT.weight.semibold,
    lineHeight: FONT.leading.none,
    letterSpacing: `${FONT.tracking.wide}em`,
    fontVariantNumeric: 'tabular-nums',
    textTransform: 'uppercase' as const,
  } satisfies CSSProperties,

} as const;

// ─── RESPONSIVE SCALER ───────────────────────────────────────────────────────

/**
 * Scale a complete TEXT style object for non-standard canvas sizes.
 *
 * @param style  - A TEXT.* preset
 * @param factor - Scale factor (e.g. 0.5 for 960×540)
 *
 * @example
 * const small = scale(TEXT.display1, 0.5); // 70px headline for 960-wide canvas
 */
export function scaleText(
  style: CSSProperties,
  factor: number,
): CSSProperties {
  const scaled = { ...style };
  if (typeof scaled.fontSize === 'number') {
    scaled.fontSize = Math.round(scaled.fontSize * factor);
  }
  return scaled;
}
