import { AbsoluteFill, useCurrentFrame } from "remotion";

// Film-grain / noise overlay at low opacity so the black has depth and the
// comp is never fully static. Re-seeded every frame so the grain lives.
// Rendered from a small turbulence tile stretched to full frame (cheap).
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 97; // cycle seeds so grain flickers frame to frame

  return (
    <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 711"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="400" height="711" filter="url(#grain-noise)" />
      </svg>
    </AbsoluteFill>
  );
};
