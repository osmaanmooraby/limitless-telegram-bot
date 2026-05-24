/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SURFACE STYLES — 10x Limitless
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Pre-built container and layout style objects.
 *
 * Usage:
 *   <div style={SURFACE.card}>...</div>
 *   <div style={{ ...SURFACE.pill, background: COLOR.electric }}>...</div>
 *
 * Surfaces encode: background, border, border-radius, padding, shadow.
 * They intentionally omit: size, position, flex/grid (layout is your job).
 */

import type { CSSProperties } from 'react';
import { COLOR, RADIUS, SHADOW, SPACE, STROKE } from './tokens';

// ─── LAYOUT CONTAINERS ───────────────────────────────────────────────────────

export const LAYOUT = {

  /**
   * Full-bleed canvas — fills the entire frame with white.
   * The starting point of every composition.
   */
  canvas: {
    position: 'absolute',
    inset: 0,
    background: COLOR.white,
    overflow: 'hidden',
  } satisfies CSSProperties,

  /**
   * Safe zone — centres content within the broadcast margin.
   * Wrap your primary content in this.
   */
  safeZone: {
    position: 'absolute',
    inset: 0,
    paddingTop:    80,
    paddingBottom: 80,
    paddingLeft:  120,
    paddingRight: 120,
    display: 'flex',
    flexDirection: 'column',
  } satisfies CSSProperties,

  /**
   * Row — horizontal flex container, vertically centred.
   */
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies CSSProperties,

  /**
   * Column — vertical flex container, default start alignment.
   */
  col: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  } satisfies CSSProperties,

  /**
   * Centred — everything dead-centre. For hero frames.
   */
  centre: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies CSSProperties,

  /**
   * Split — space-between row. Left content, right content.
   */
  split: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  } satisfies CSSProperties,

} as const;

// ─── CARD SURFACES ────────────────────────────────────────────────────────────

export const SURFACE = {

  /**
   * Card — the workhorse surface.
   * White, rounded, softly elevated. Use for data panels, list items.
   */
  card: {
    background: COLOR.white,
    borderRadius: RADIUS.xl,
    padding: SPACE[10],
    boxShadow: SHADOW.md,
    border: `${STROKE.hairline}px solid ${COLOR.mist}`,
  } satisfies CSSProperties,

  /**
   * Card Raised — hero card variant. More elevation, more presence.
   */
  cardRaised: {
    background: COLOR.white,
    borderRadius: RADIUS['2xl'],
    padding: SPACE[12],
    boxShadow: SHADOW.xl,
    border: `${STROKE.hairline}px solid ${COLOR.cloud}`,
  } satisfies CSSProperties,

  /**
   * Card Flat — no shadow. Use on coloured backgrounds.
   */
  cardFlat: {
    background: COLOR.white,
    borderRadius: RADIUS.xl,
    padding: SPACE[10],
    border: `${STROKE.thin}px solid ${COLOR.mist}`,
  } satisfies CSSProperties,

  /**
   * Panel Tinted — slightly off-white surface for grouping.
   * Use inside a white card to create depth hierarchy.
   */
  panelTinted: {
    background: COLOR.parchment,
    borderRadius: RADIUS.lg,
    padding: SPACE[8],
    border: `${STROKE.hairline}px solid ${COLOR.mist}`,
  } satisfies CSSProperties,

  /**
   * Panel Cloud — cooler tint variant.
   */
  panelCloud: {
    background: COLOR.cloud,
    borderRadius: RADIUS.lg,
    padding: SPACE[8],
  } satisfies CSSProperties,

  /**
   * Ink block — full-black surface.
   * Dramatic contrast against white backgrounds.
   * Use for one dominant element per scene.
   */
  ink: {
    background: COLOR.ink,
    borderRadius: RADIUS.xl,
    padding: SPACE[10],
    boxShadow: SHADOW.ink,
  } satisfies CSSProperties,

  /**
   * Electric — cobalt accent surface.
   * Use for CTAs, highlighted stats, key numbers.
   */
  electric: {
    background: COLOR.electric,
    borderRadius: RADIUS.xl,
    padding: SPACE[8],
    boxShadow: SHADOW.electric,
  } satisfies CSSProperties,

  /**
   * Gold — premium accent surface.
   */
  gold: {
    background: COLOR.gold,
    borderRadius: RADIUS.xl,
    padding: SPACE[8],
    boxShadow: SHADOW.gold,
  } satisfies CSSProperties,

  // ── Glass / Frosted ────────────────────────────────────────────────────────

  /**
   * Glass — frosted white panel.
   * Works well over image backgrounds or subtle coloured surfaces.
   */
  glass: {
    background: 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: RADIUS.xl,
    padding: SPACE[10],
    border: `${STROKE.hairline}px solid rgba(255,255,255,0.60)`,
    boxShadow: SHADOW.lg,
  } satisfies CSSProperties,

  /**
   * Glass Dark — frosted charcoal panel.
   */
  glassDark: {
    background: 'rgba(13,13,13,0.72)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: RADIUS.xl,
    padding: SPACE[10],
    border: `${STROKE.hairline}px solid rgba(255,255,255,0.10)`,
    boxShadow: SHADOW.ink,
  } satisfies CSSProperties,

} as const;

// ─── PILLS / BADGES ───────────────────────────────────────────────────────────

export const BADGE = {

  /** Default neutral badge */
  default: {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: RADIUS.full,
    paddingTop:   SPACE[2],
    paddingBottom: SPACE[2],
    paddingLeft:  SPACE[5],
    paddingRight: SPACE[5],
    background:   COLOR.cloud,
    border:       `${STROKE.hairline}px solid ${COLOR.mist}`,
  } satisfies CSSProperties,

  /** Electric accent badge */
  electric: {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: RADIUS.full,
    paddingTop:   SPACE[2],
    paddingBottom: SPACE[2],
    paddingLeft:  SPACE[5],
    paddingRight: SPACE[5],
    background:   COLOR.electric50,
    border:       `${STROKE.thin}px solid ${COLOR.electric300}`,
  } satisfies CSSProperties,

  /** Positive / bullish */
  bullish: {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: RADIUS.full,
    paddingTop:   SPACE[2],
    paddingBottom: SPACE[2],
    paddingLeft:  SPACE[5],
    paddingRight: SPACE[5],
    background:   COLOR.emerald100,
  } satisfies CSSProperties,

  /** Negative / bearish */
  bearish: {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: RADIUS.full,
    paddingTop:   SPACE[2],
    paddingBottom: SPACE[2],
    paddingLeft:  SPACE[5],
    paddingRight: SPACE[5],
    background:   COLOR.crimson100,
  } satisfies CSSProperties,

  /** Gold premium */
  gold: {
    display:      'inline-flex',
    alignItems:   'center',
    borderRadius: RADIUS.full,
    paddingTop:   SPACE[2],
    paddingBottom: SPACE[2],
    paddingLeft:  SPACE[5],
    paddingRight: SPACE[5],
    background:   COLOR.gold100,
    border:       `${STROKE.thin}px solid ${COLOR.gold400}`,
  } satisfies CSSProperties,

} as const;

// ─── DIVIDERS / LINES ─────────────────────────────────────────────────────────

export const DIVIDER = {

  /** Hairline — barely visible, structural */
  thin: {
    width: '100%',
    height: 1,
    background: COLOR.mist,
  } satisfies CSSProperties,

  /** Medium — section separator */
  medium: {
    width: '100%',
    height: 2,
    background: COLOR.stone,
  } satisfies CSSProperties,

  /** Bold line — short decorative accent, use at 80–200px wide */
  accent: {
    height: 4,
    borderRadius: RADIUS.full,
    background: COLOR.electric,
  } satisfies CSSProperties,

  /** Gold accent line */
  accentGold: {
    height: 4,
    borderRadius: RADIUS.full,
    background: COLOR.gold,
  } satisfies CSSProperties,

  /** Vertical rule */
  vertical: {
    width: 2,
    alignSelf: 'stretch',
    background: COLOR.mist,
  } satisfies CSSProperties,

} as const;
