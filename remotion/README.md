# 🎬 10x Limitless — Remotion Studio

Video animation workspace built with [Remotion](https://remotion.dev) v4.

## Quick Start

```bash
cd remotion

# Launch the visual studio (preview in browser)
npm run studio

# Render a specific composition to MP4
npm run render:hello      # → out/HelloWorld.mp4
npm run render:text       # → out/TextReveal.mp4
npm run render:logo       # → out/LogoAnimation.mp4

# Type-check without building
npm run typecheck
```

## Packages Installed

| Package | Purpose |
|---|---|
| `remotion` | Core engine |
| `@remotion/cli` | CLI + Studio |
| `@remotion/renderer` | Server-side rendering |
| `@remotion/bundler` | Webpack bundler |
| `@remotion/player` | React `<Player>` component |
| `@remotion/transitions` | Slide/fade/wipe transitions |
| `@remotion/shapes` | Circles, rects, stars, paths |
| `@remotion/noise` | Perlin noise animations |
| `@remotion/motion-blur` | Frame-blending motion blur |
| `@remotion/gif` | Render/embed GIFs |
| `@remotion/google-fonts` | Auto-loaded Google Fonts |
| `@remotion/fonts` | Custom font loading |
| `@remotion/layout-utils` | `measureText`, `fitText` |
| `@remotion/media-utils` | Audio duration, waveform |
| `@remotion/paths` | SVG path animation helpers |
| `@remotion/lottie` | Lottie/Bodymovin animations |
| `@remotion/captions` | Subtitle/caption rendering |
| `@remotion/three` | Three.js 3D scenes |
| `@remotion/animation-utils` | `interpolateStyles`, etc. |
| `@remotion/preload` | Preload video/audio assets |
| `@remotion/zod-types` | Zod schema for props |

## Folder Structure

```
remotion/
├── src/
│   ├── index.ts              ← Remotion entry point
│   ├── Root.tsx              ← Register compositions here
│   ├── compositions/         ← One file per video composition
│   │   ├── HelloWorld.tsx
│   │   ├── TextReveal.tsx
│   │   └── LogoAnimation.tsx
│   ├── components/           ← Reusable animated components
│   ├── transitions/          ← Custom transition definitions
│   └── assets/               ← Fonts, images, audio
├── remotion.config.ts        ← Render settings
└── tsconfig.json
```

## Adding a New Composition

1. Create `src/compositions/MyVideo.tsx`
2. Register it in `src/Root.tsx` with `<Composition id="MyVideo" ... />`
3. Preview with `npm run studio`
4. Render with `npx remotion render src/index.ts MyVideo`
