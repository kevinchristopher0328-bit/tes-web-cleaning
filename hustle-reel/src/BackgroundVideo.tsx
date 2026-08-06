import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

// Per-scene background clip with heavy editorial treatment: desaturated and
// darkened, a near-black overlay, and a scrim weighted to the lower-left where
// the text lives — so the brutalist black look holds and text stays readable.
// A slow ken-burns push keeps it breathing, like the rest of the comp.
export const BackgroundVideo: React.FC<{ src: string; durationInFrames: number }> = ({ src, durationInFrames }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: String(scale), transformOrigin: "center center" }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(1) contrast(1.05) brightness(0.42)",
          }}
        />
      </AbsoluteFill>
      {/* Flat near-black overlay */}
      <AbsoluteFill style={{ backgroundColor: "rgba(10,10,10,0.55)" }} />
      {/* Gradient scrim — darkest at the bottom (mini-text + marquee), then top */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.12) 38%, rgba(10,10,10,0.80) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
