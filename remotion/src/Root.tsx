import { Composition } from "remotion";
import { HelloWorld, helloWorldSchema } from "./compositions/HelloWorld";
import { TextReveal, textRevealSchema } from "./compositions/TextReveal";
import { LogoAnimation, logoAnimationSchema } from "./compositions/LogoAnimation";

/**
 * Root — register all your Remotion compositions here.
 *
 * Pass `schema` (a Zod object) alongside `component` so Remotion can:
 *   • Validate props at runtime
 *   • Show typed GUI controls in Remotion Studio
 *   • Type-check defaultProps correctly
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Starter: simple animated hello ──────────────────── */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        schema={helloWorldSchema}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Hello, World!" }}
      />

      {/* ── Text Reveal: cinematic word-by-word reveal ───────── */}
      <Composition
        id="TextReveal"
        component={TextReveal}
        schema={textRevealSchema}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: "10x Limitless" }}
      />

      {/* ── Logo Animation: animated logo/brand intro ────────── */}
      <Composition
        id="LogoAnimation"
        component={LogoAnimation}
        schema={logoAnimationSchema}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ brand: "10x Limitless" }}
      />
    </>
  );
};
