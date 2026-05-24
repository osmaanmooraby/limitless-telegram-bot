import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import {
  COLOR, GRADIENT, LAYOUT, TEXT, SPACE, TIMING,
  fadeIn, fadeOut, gradientText, spr, SPRING, DIVIDER, CLAMP,
} from '../styles';

export const logoAnimationSchema = z.object({
  brand: z.string().default('10x Limitless'),
});

type Props = z.infer<typeof logoAnimationSchema>;

export const LogoAnimation: React.FC<Props> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();

  // Brand word entrance
  const brandS    = spr(frame, fps, SPRING.cinematic);
  const brandY    = interpolate(brandS, [0, 1], [80, 0]);
  const brandFade = fadeIn(frame, 0, TIMING.enter);

  // Line sweep (starts at frame 18)
  const lineS   = spr(frame, fps, SPRING.smooth, 18);
  const lineW   = lineS * (width * 0.42);

  // Tagline (starts at frame 40)
  const tagFade = fadeIn(frame, 40, 65);
  const tagY    = interpolate(
    spr(frame, fps, SPRING.gentle, 40),
    [0, 1],
    [30, 0],
  );

  // Scene fade-out
  const exitFade = fadeOut(frame, durationInFrames - TIMING.exit, durationInFrames);

  return (
    <AbsoluteFill style={{ ...LAYOUT.canvas, opacity: 1 - exitFade }}>
      {/* Page gradient */}
      <AbsoluteFill style={{ background: GRADIENT.pageFade }} />

      {/* Content centre */}
      <AbsoluteFill
        style={{
          ...LAYOUT.centre,
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Brand name */}
        <h1
          style={{
            ...TEXT.display1,
            opacity: brandFade,
            transform: `translateY(${brandY}px)`,
            ...gradientText(GRADIENT.textInk),
          }}
        >
          {brand}
        </h1>

        {/* Accent line — sweeps left to right */}
        <div
          style={{
            marginTop: SPACE[6],
            ...DIVIDER.accent,
            width: lineW,
            background: GRADIENT.spectrum,
          }}
        />

        {/* Tagline */}
        <p
          style={{
            ...TEXT.eyebrow,
            marginTop: SPACE[8],
            opacity: tagFade,
            transform: `translateY(${tagY}px)`,
            color: COLOR.steel,
          }}
        >
          by Osmaan Mooraby
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
