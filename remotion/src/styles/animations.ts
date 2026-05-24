/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ANIMATION SYSTEM — 10x Limitless
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A complete motion language built on Remotion's spring engine.
 *
 * Principles:
 *   1. Every animation should feel physically plausible.
 *   2. Things that are heavier should move slower. Bigger = slower.
 *   3. Exits should be faster than entrances. (25–30% shorter)
 *   4. Stagger delays give hierarchy. First element = most important.
 *   5. Never animate more than 3 things simultaneously.
 */

import { interpolate, spring as remotionSpring } from 'remotion';
import type { SpringConfig } from 'remotion';

// ─── SPRING PRESETS ───────────────────────────────────────────────────────────

/**
 * Named spring configurations.
 *
 * Tuning guide:
 *   damping   — resistance (higher = less bounce, settles faster)
 *   stiffness — pull-back force (higher = faster initial movement)
 *   mass      — weight (higher = slower overall, more momentum)
 */
export const SPRING: Record<string, SpringConfig> = {
  /**
   * Snap — instant response, no overshoot.
   * Use for: UI confirmations, data updates, toggling states.
   */
  snap: { damping: 220, stiffness: 400, mass: 0.5, overshootClamping: true },

  /**
   * Crisp — fast and decisive, hair of momentum.
   * Use for: icons, small elements, counters.
   */
  crisp: { damping: 160, stiffness: 300, mass: 0.7, overshootClamping: false },

  /**
   * Smooth — the workhorse. Balanced, professional feel.
   * Use for: cards, list items, most transitions.
   */
  smooth: { damping: 120, stiffness: 200, mass: 1.0, overshootClamping: false },

  /**
   * Gentle — relaxed, unhurried. Content-forward.
   * Use for: text reveals, background elements.
   */
  gentle: { damping: 90, stiffness: 130, mass: 1.1, overshootClamping: false },

  /**
   * Float — weightless and dreamy.
   * Use for: hero images, ambient background motion.
   */
  float: { damping: 65, stiffness: 85, mass: 1.3, overshootClamping: false },

  /**
   * Cinematic — slow, weighted, dramatic. The signature move.
   * Use for: primary hero entrances, major scene transitions.
   */
  cinematic: { damping: 45, stiffness: 60, mass: 1.6, overshootClamping: false },

  /**
   * Bounce — playful overshoot. Use very sparingly.
   * Use for: celebration moments, delight micro-interactions.
   */
  bounce: { damping: 28, stiffness: 180, mass: 0.8, overshootClamping: false },

  /**
   * Elastic — dramatic rubber-band. Brand moments only.
   * Use for: logo reveals, final frame emphasis.
   */
  elastic: { damping: 18, stiffness: 240, mass: 0.6, overshootClamping: false },
};

// ─── INTERPOLATE HELPERS ─────────────────────────────────────────────────────

/** Always clamp to the defined range — the most common case. */
export const CLAMP = {
  extrapolateLeft:  'clamp',
  extrapolateRight: 'clamp',
} as const;

/** Extend beyond the defined range — use for continuous loops. */
export const EXTEND = {
  extrapolateLeft:  'extend',
  extrapolateRight: 'extend',
} as const;

// ─── SPRING SHORTHAND ────────────────────────────────────────────────────────

/**
 * Convenience wrapper: `spr(frame, fps, config, delay?, duration?)`
 *
 * Returns a 0→1 spring value. Apply your own interpolate() on top.
 *
 * @example
 * const s = spr(frame, fps, SPRING.smooth, 10); // starts at frame 10
 * const y = interpolate(s, [0, 1], [60, 0]);
 */
export function spr(
  frame: number,
  fps: number,
  config: SpringConfig = SPRING.smooth,
  delay = 0,
  durationInFrames?: number,
): number {
  return remotionSpring({
    frame: frame - delay,
    fps,
    config,
    ...(durationInFrames !== undefined ? { durationInFrames } : {}),
  });
}

// ─── COMMON ANIMATION RECIPES ────────────────────────────────────────────────

/**
 * Fade in from 0 → 1 between startFrame and endFrame.
 */
export function fadeIn(frame: number, startFrame: number, endFrame: number): number {
  return interpolate(frame, [startFrame, endFrame], [0, 1], CLAMP);
}

/**
 * Fade out from 1 → 0 between startFrame and endFrame.
 */
export function fadeOut(frame: number, startFrame: number, endFrame: number): number {
  return interpolate(frame, [startFrame, endFrame], [1, 0], CLAMP);
}

/**
 * Slide in from `offset` pixels to 0, spring-powered.
 * Positive offset = slide from right/bottom. Negative = from left/top.
 */
export function slideIn(
  frame: number,
  fps: number,
  offset: number,
  config: SpringConfig = SPRING.smooth,
  delay = 0,
): number {
  const s = spr(frame, fps, config, delay);
  return interpolate(s, [0, 1], [offset, 0]);
}

/**
 * Scale in from `fromScale` to 1, spring-powered.
 */
export function scaleIn(
  frame: number,
  fps: number,
  fromScale = 0.85,
  config: SpringConfig = SPRING.smooth,
  delay = 0,
): number {
  const s = spr(frame, fps, config, delay);
  return interpolate(s, [0, 1], [fromScale, 1]);
}

/**
 * Stagger: returns the per-item delay for index `i` with `gap` frames between each.
 * Items stagger IN, not out — the first element is always first.
 */
export function stagger(index: number, gap = 6): number {
  return index * gap;
}

/**
 * Loop: maps frame to a 0→1→0 ping-pong cycle of `period` frames.
 * Useful for ambient pulsing, breathing effects.
 */
export function loop(frame: number, period: number): number {
  const t = (frame % period) / period;
  return t < 0.5 ? t * 2 : (1 - t) * 2;
}

/**
 * Oscillate: smooth sine wave between min and max.
 * `period` is in frames.
 */
export function oscillate(
  frame: number,
  period: number,
  min = -1,
  max = 1,
  phaseOffset = 0,
): number {
  const t = ((frame + phaseOffset) / period) * Math.PI * 2;
  const raw = Math.sin(t); // -1 to 1
  return interpolate(raw, [-1, 1], [min, max]);
}

/**
 * Remap: re-maps a spring value [0→1] through your own output range.
 * Sugar over interpolate to keep code readable.
 */
export function remap(
  springValue: number,
  outputMin: number,
  outputMax: number,
): number {
  return interpolate(springValue, [0, 1], [outputMin, outputMax]);
}

// ─── TIMING CONSTANTS ────────────────────────────────────────────────────────

/**
 * Standard scene timing presets (in frames @ 30fps).
 * Name them semantically so compositions are self-documenting.
 */
export const TIMING = {
  /** Half a second — minimum meaningful pause */
  beat:        15,
  /** Standard entrance duration */
  enter:       20,
  /** Standard exit duration (always shorter than enter) */
  exit:        14,
  /** One second — comfortable read time for short labels */
  second:      30,
  /** Comfortable reading time for a headline */
  headline:    60,
  /** Full scene — hero moment with breathing room */
  scene:       90,
  /** Long-form content hold */
  hold:       120,
  /** Transition between major sections */
  transition:  20,
} as const;
