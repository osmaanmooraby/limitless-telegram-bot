import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import {
  COLOR, GRADIENT, LAYOUT, TEXT, TIMING,
  fadeOut, gradientText, spr, SPRING, DIVIDER, SPACE,
} from '../styles';

export const helloWorldSchema = z.object({
  title: z.string().default('Hello, World!'),
});

type Props = z.infer<typeof helloWorldSchema>;

export const HelloWorld: React.FC<Props> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance
  const s = spr(frame, fps, SPRING.cinematic);
  const scale   = 0.88 + s * 0.12;
  const opacity = Math.min(frame / TIMING.enter, 1);

  // Fade-out
  const fade = fadeOut(frame, durationInFrames - TIMING.exit, durationInFrames);

  // Underline grows
  const lineS   = spr(frame, fps, SPRING.smooth, 12);
  const lineWidth = lineS * 520;

  return (
    <AbsoluteFill style={{ ...LAYOUT.canvas, opacity: 1 - fade }}>
      {/* Subtle mesh gradient on white */}
      <AbsoluteFill style={{ background: GRADIENT.pageBase, opacity: 0.6 }} />

      <AbsoluteFill style={{ ...LAYOUT.centre, flexDirection: 'column', gap: SPACE[6] }}>
        {/* Eyebrow */}
        <p
          style={{
            ...TEXT.eyebrow,
            opacity: opacity * 0.5,
            transform: `translateY(${(1 - s) * 20}px)`,
          }}
        >
          10x Limitless
        </p>

        {/* Main title */}
        <h1
          style={{
            ...TEXT.display1,
            transform: `scale(${scale})`,
            opacity,
            ...gradientText(GRADIENT.textElectric),
          }}
        >
          {title}
        </h1>

        {/* Animated accent line */}
        <div
          style={{
            ...DIVIDER.accent,
            width: lineWidth,
            transition: 'none',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
