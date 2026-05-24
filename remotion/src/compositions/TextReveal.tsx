import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import {
  LAYOUT, TEXT, COLOR, GRADIENT, TIMING, SPACE,
  fadeOut, spr, SPRING, stagger, gradientText,
} from '../styles';

export const textRevealSchema = z.object({
  text: z.string().default('10x Limitless'),
});

type Props = z.infer<typeof textRevealSchema>;

export const TextReveal: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(' ');

  const exitFade = fadeOut(frame, durationInFrames - TIMING.exit, durationInFrames);

  return (
    <AbsoluteFill style={{ ...LAYOUT.canvas, opacity: 1 - exitFade }}>
      <AbsoluteFill style={{ background: GRADIENT.pageFade }} />

      <AbsoluteFill
        style={{
          ...LAYOUT.centre,
          flexWrap: 'wrap',
          gap: SPACE[6],
          paddingLeft: 120,
          paddingRight: 120,
          alignContent: 'center',
        }}
      >
        {words.map((word, i) => {
          const delay = stagger(i, 8);
          const s     = spr(frame, fps, SPRING.smooth, delay);
          const y     = interpolate(s, [0, 1], [60, 0]);
          const scale = interpolate(s, [0, 1], [0.9, 1]);
          const fade  = interpolate(s, [0, 0.4], [0, 1], {
            extrapolateRight: 'clamp',
          });

          // Highlight the first word with gradient
          const isFirst = i === 0;

          return (
            <span
              key={i}
              style={{
                ...TEXT.display1,
                display: 'inline-block',
                opacity: fade,
                transform: `translateY(${y}px) scale(${scale})`,
                transformOrigin: 'bottom center',
                ...(isFirst
                  ? gradientText(GRADIENT.textElectric)
                  : { color: COLOR.ink }),
              }}
            >
              {word}
            </span>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
