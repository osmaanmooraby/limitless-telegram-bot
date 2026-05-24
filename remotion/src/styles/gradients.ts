/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GRADIENT LIBRARY — 10x Limitless
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Every gradient in the system, named by intent not by colour.
 *
 * Rules:
 *   • Max 2 colour stops in a gradient (3 is ok, 4 is a crime).
 *   • On a white bg, gradients should feel like light — not paint.
 *   • Animated hue gradients should shift ≤40° so they don't feel cheap.
 */

import { COLOR } from './tokens';

// ─── STATIC GRADIENTS ────────────────────────────────────────────────────────

export const GRADIENT = {

  // ── Backgrounds ────────────────────────────────────────────────────────────

  /** Default page background — barely perceptible warmth */
  pageBase: `linear-gradient(180deg, ${COLOR.white} 0%, ${COLOR.parchment} 100%)`,

  /** Subtle top-to-bottom depth on a white frame */
  pageFade: `linear-gradient(180deg, #FFFFFF 0%, #F5F4F0 100%)`,

  /** Radial vignette — focus attention to center. Mix over white background. */
  vignette: `radial-gradient(ellipse 120% 100% at 50% 0%, ${COLOR.white} 40%, ${COLOR.cloud} 100%)`,

  // ── Accent fills ───────────────────────────────────────────────────────────

  /** The signature electric gradient — use for ONE hero element per scene */
  electric: `linear-gradient(135deg, ${COLOR.electric900} 0%, ${COLOR.electric} 50%, ${COLOR.electric500} 100%)`,

  /** Electric diagonal — alternate orientation */
  electricDiag: `linear-gradient(115deg, ${COLOR.electric800} 0%, ${COLOR.electric500} 100%)`,

  /** Gold shimmer — awards, premium moments */
  gold: `linear-gradient(135deg, ${COLOR.gold700} 0%, ${COLOR.gold} 55%, ${COLOR.gold400} 100%)`,

  /** Electric → Gold spectrum — for top-tier hero moments */
  spectrum: `linear-gradient(90deg, ${COLOR.electric} 0%, #7C3AED 50%, ${COLOR.gold} 100%)`,

  // ── Text gradients (apply as backgroundImage + backgroundClip: text) ────────

  /** Electric text shine */
  textElectric: `linear-gradient(90deg, ${COLOR.electric700} 0%, ${COLOR.electric400} 100%)`,

  /** Ink-to-charcoal — subtle depth on large display text */
  textInk: `linear-gradient(180deg, ${COLOR.ink} 0%, ${COLOR.charcoal} 100%)`,

  /** Gold text — sparingly, on dark surfaces or for emphasis */
  textGold: `linear-gradient(90deg, ${COLOR.gold700} 0%, ${COLOR.gold400} 100%)`,

  /** Full spectrum — for single-word hero statements */
  textSpectrum: `linear-gradient(90deg, ${COLOR.electric} 0%, #8B5CF6 50%, ${COLOR.gold} 100%)`,

  // ── Overlays ───────────────────────────────────────────────────────────────

  /** Scrim — darken bottom of frame (for text over image) */
  scrimBottom: `linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)`,

  /** Scrim — darken top */
  scrimTop: `linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0) 100%)`,

  /** White reveal — wipes in from left */
  whiteRevealH: `linear-gradient(90deg, ${COLOR.white} 0%, rgba(255,255,255,0) 100%)`,

  /** White reveal — wipes in from top */
  whiteRevealV: `linear-gradient(180deg, ${COLOR.white} 0%, rgba(255,255,255,0) 100%)`,

  /** Glass surface — frosted pane effect */
  glass: `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.70) 100%)`,

  // ── Semantic states ────────────────────────────────────────────────────────

  bullish: `linear-gradient(135deg, ${COLOR.emerald} 0%, #34D399 100%)`,
  bearish: `linear-gradient(135deg, ${COLOR.crimson} 0%, #F87171 100%)`,

} as const;

// ─── ANIMATED GRADIENT BUILDER ────────────────────────────────────────────────

/**
 * Generates a CSS linear-gradient string that shifts hue based on frame.
 *
 * @param baseHue  - Starting hue (0–360)
 * @param frame    - Current animation frame
 * @param range    - Total hue degrees to drift over the animation
 * @param totalFrames - Full duration for normalisation
 * @param direction - Gradient angle in degrees (default 135°)
 *
 * @example
 * style={{ background: animatedGradient(220, frame, 30, durationInFrames) }}
 */
export function animatedGradient(
  baseHue: number,
  frame: number,
  range = 20,
  totalFrames = 150,
  direction = 135,
  saturation = 80,
  lightness = 50,
): string {
  const progress = frame / totalFrames;
  const hue1 = baseHue + progress * range;
  const hue2 = hue1 + 30;
  return `linear-gradient(${direction}deg, hsl(${hue1},${saturation}%,${lightness}%), hsl(${hue2},${saturation + 5}%,${lightness - 8}%))`;
}

/**
 * Animated conic gradient for abstract backgrounds.
 * Rotates the cone origin point over time.
 *
 * @param frame - Current frame
 * @param speed - Degrees per frame (default 0.5)
 */
export function conicGradient(
  frame: number,
  speed = 0.4,
  color1 = COLOR.electric50,
  color2 = COLOR.parchment,
): string {
  const angle = (frame * speed) % 360;
  return `conic-gradient(from ${angle}deg at 60% 40%, ${color1}, ${color2}, ${color1})`;
}

/**
 * Mesh gradient: 4-corner radial blends for premium backgrounds.
 * Keep colours close — too much contrast looks budget.
 */
export function meshGradient(
  topLeft    = COLOR.electric50,
  topRight   = COLOR.parchment,
  bottomLeft = COLOR.cloud,
  bottomRight = COLOR.electric100,
): string {
  return [
    `radial-gradient(at 0% 0%, ${topLeft} 0px, transparent 60%)`,
    `radial-gradient(at 100% 0%, ${topRight} 0px, transparent 60%)`,
    `radial-gradient(at 0% 100%, ${bottomLeft} 0px, transparent 60%)`,
    `radial-gradient(at 100% 100%, ${bottomRight} 0px, transparent 60%)`,
    COLOR.white,
  ].join(', ');
  // Usage: background: meshGradient(...)
  // Note: multiple bg layers, CSS handles compositing
}

// ─── CLIP-TEXT HELPER ─────────────────────────────────────────────────────────

/**
 * Returns the style object needed for a gradient-filled text effect.
 * Apply to the wrapping element — make sure it has display:inline-block or block.
 *
 * @example
 * <span style={gradientText(GRADIENT.textSpectrum)}>10x Limitless</span>
 */
export function gradientText(gradient: string): React.CSSProperties {
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  };
}
