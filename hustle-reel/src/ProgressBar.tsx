import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_DISPLAY, MARGIN, SCENE_FRAMES, TOTAL_FRAMES } from "./theme";

// Cumulative end-frame of each scene, for mapping frame -> current step.
const ENDS = SCENE_FRAMES.reduce<number[]>((acc, d) => {
  acc.push((acc[acc.length - 1] ?? 0) + d);
  return acc;
}, []);

const currentStep = (frame: number) => {
  const idx = ENDS.findIndex((end) => frame < end);
  return (idx === -1 ? SCENE_FRAMES.length : idx + 1);
};

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step = currentStep(frame);
  const total = SCENE_FRAMES.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: MARGIN,
        right: MARGIN,
      }}
    >
      {/* Thin accent progress track */}
      <div
        style={{
          position: "relative",
          height: 4,
          backgroundColor: "rgba(245,245,245,0.14)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: `${fill * 100}%`,
            backgroundColor: COLORS.accent,
          }}
        />
        {/* Tick marks dividing the track into scene segments */}
        {SCENE_FRAMES.slice(0, -1).map((_, i) => {
          const at = (ENDS[i] / TOTAL_FRAMES) * 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: -3,
                bottom: -3,
                left: `${at}%`,
                width: 2,
                backgroundColor: COLORS.bg,
              }}
            />
          );
        })}
      </div>

      {/* Step counter: 0X — 04 */}
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_DISPLAY,
          fontSize: 24,
          letterSpacing: 4,
          color: COLORS.text,
        }}
      >
        <span style={{ color: COLORS.accent }}>{pad(step)}</span>
        <span style={{ opacity: 0.5 }}>{"  —  "}</span>
        <span style={{ opacity: 0.7 }}>{pad(total)}</span>
      </div>
    </div>
  );
};
