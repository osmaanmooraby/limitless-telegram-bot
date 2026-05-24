import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const logoAnimationSchema = z.object({
  brand: z.string().default("10x Limitless"),
});

type Props = z.infer<typeof logoAnimationSchema>;

/**
 * LogoAnimation — animated brand intro using:
 *   • Sequence for layered timing
 *   • spring() for smooth entrance
 *   • Animated SVG accent line
 */
export const LogoAnimation: React.FC<Props> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Logo drop-in
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Underline sweep
  const lineWidth = interpolate(frame, [20, 60], [0, width * 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fade (starts at frame 45)
  const taglineOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Brand name */}
      <div
        style={{
          color: "#fff",
          fontSize: 110,
          fontFamily: "sans-serif",
          fontWeight: 900,
          letterSpacing: -3,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        {brand}
      </div>

      {/* Animated accent line */}
      <div
        style={{
          height: 4,
          width: lineWidth,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          borderRadius: 2,
          marginTop: 20,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 32,
          fontFamily: "sans-serif",
          fontWeight: 400,
          letterSpacing: 6,
          textTransform: "uppercase",
          marginTop: 24,
          opacity: taglineOpacity,
        }}
      >
        by Osmaan Mooraby
      </div>
    </AbsoluteFill>
  );
};
