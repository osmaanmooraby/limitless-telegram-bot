/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 10x LIMITLESS — Design System
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Single import for everything:
 *
 *   import {
 *     COLOR, FONT, SPACE, RADIUS, SHADOW, STROKE, CANVAS,  // tokens
 *     SPRING, TIMING, spr, fadeIn, fadeOut,                // animations
 *     slideIn, scaleIn, stagger, oscillate, remap, loop,   // animations
 *     CLAMP, EXTEND,                                       // interpolation
 *     GRADIENT, animatedGradient, gradientText,            // gradients
 *     TEXT, scaleText,                                     // typography
 *     LAYOUT, SURFACE, BADGE, DIVIDER,                     // surfaces
 *   } from '../styles';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Tokens — raw values (colours, sizes, spacing)
export {
  COLOR,
  FONT,
  SPACE,
  RADIUS,
  SHADOW,
  STROKE,
  CANVAS,
} from './tokens';

export type { ColorToken } from './tokens';

// Animations — spring presets, helpers, timing
export {
  SPRING,
  TIMING,
  CLAMP,
  EXTEND,
  spr,
  fadeIn,
  fadeOut,
  slideIn,
  scaleIn,
  stagger,
  loop,
  oscillate,
  remap,
} from './animations';

// Gradients — static + dynamic gradient builders
export {
  GRADIENT,
  animatedGradient,
  conicGradient,
  meshGradient,
  gradientText,
} from './gradients';

// Typography — pre-composed text style objects
export {
  TEXT,
  scaleText,
} from './typography';

// Surfaces — containers, cards, badges, dividers
export {
  LAYOUT,
  SURFACE,
  BADGE,
  DIVIDER,
} from './surfaces';
