import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const helloWorldSchema = z.object({
  title: z.string().default("Hello, World!"),
});

type Props = z.infer<typeof helloWorldSchema>;

/**
 * HelloWorld — a minimal composition demonstrating:
 *   • spring() for physics-based easing
 *   • interpolate() for color and opacity
 *   • useCurrentFrame / useVideoConfig hooks
 */
export const HelloWorld: React.FC<Props> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Bounce-in scale
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Fade out near the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Animated gradient hue shift
  const hue = interpolate(frame, [0, durationInFrames], [220, 320]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 12%), hsl(${hue + 40}, 80%, 6%))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: 120,
          fontFamily: "sans-serif",
          fontWeight: 900,
          letterSpacing: -4,
          transform: `scale(${scale})`,
          margin: 0,
          textShadow: `0 0 80px hsl(${hue + 20}, 100%, 70%)`,
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};
