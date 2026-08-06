import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, MARGIN, WIDTH } from "./theme";

const DRAW = 10; // frames to draw the line in at the very start
const MORPH_PRE = 8; // frames before a cut the line starts travelling
const MORPH_POST = 6; // frames after a cut it settles at the new Y

// The single #fdd000 line that anchors every scene. It draws in once, then
// travels down the frame and briefly retracts/redraws at each cut, so it reads
// as one continuous line connecting all four scenes.
export const Baseline: React.FC<{ baselineYs: number[]; durations: number[] }> = ({
  baselineYs,
  durations,
}) => {
  const frame = useCurrentFrame();

  const ends: number[] = [];
  durations.reduce((a, d) => {
    const e = a + d;
    ends.push(e);
    return e;
  }, 0);
  const cuts = ends.slice(0, -1); // interior scene boundaries

  // Y: hold each scene's baseline, morph across each cut (eye travels down).
  const yF = [0];
  const yV = [baselineYs[0]];
  cuts.forEach((c, i) => {
    yF.push(c - MORPH_PRE, c + MORPH_POST);
    yV.push(baselineYs[i], baselineYs[i + 1]);
  });
  yF.push(ends[ends.length - 1]);
  yV.push(baselineYs[baselineYs.length - 1]);
  const y = interpolate(frame, yF, yV, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // scaleX: draw in left→right, then a small retract/redraw dip at each cut.
  const sF = [0, DRAW];
  const sV = [0, 1];
  cuts.forEach((c) => {
    sF.push(c - MORPH_PRE, c, c + MORPH_POST);
    sV.push(1, 0.82, 1);
  });
  sF.push(ends[ends.length - 1]);
  sV.push(1);
  const scaleX = interpolate(frame, sF, sV, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        top: y,
        width: WIDTH - 2 * MARGIN,
        height: 2,
        backgroundColor: COLORS.accent,
        transformOrigin: "left center",
        scale: `${scaleX} 1`,
      }}
    />
  );
};
