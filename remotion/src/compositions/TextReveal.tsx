import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const textRevealSchema = z.object({
  text: z.string().default("10x Limitless"),
});

type Props = z.infer<typeof textRevealSchema>;

/**
 * TextReveal — staggered word-by-word reveal with spring animations.
 * Great as a title card or intro slide.
 */
export const TextReveal: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 24,
        padding: 80,
      }}
    >
      {words.map((word, i) => {
        // Each word starts revealing 8 frames after the previous
        const delay = i * 8;

        const translateY = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.8 },
          durationInFrames: 30,
        });

        const opacity = interpolate(
          frame - delay,
          [0, 20],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={i}
            style={{
              color: "#fff",
              fontSize: 100,
              fontFamily: "sans-serif",
              fontWeight: 900,
              letterSpacing: -2,
              opacity,
              transform: `translateY(${interpolate(translateY, [0, 1], [60, 0])}px)`,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
