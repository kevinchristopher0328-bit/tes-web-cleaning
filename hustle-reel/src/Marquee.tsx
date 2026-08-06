import { useCurrentFrame } from "remotion";
import { COLORS, FONT_TEXT } from "./theme";

const PHRASE = "REAL COACHING · EVERY REP WATCHED · PROGRESS TRACKED · ";
// Repeat enough times to cover the width plus the scroll offset.
const STRIP = PHRASE.repeat(8);
const PX_PER_FRAME = 1.4; // slow, steady drift

// Approx width of one PHRASE at the given font size, used to loop seamlessly.
const PHRASE_WIDTH = 900;

export const Marquee: React.FC = () => {
  const frame = useCurrentFrame();
  // Wrap the offset by a single phrase width so the loop is seamless.
  const offset = -((frame * PX_PER_FRAME) % PHRASE_WIDTH);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: 0,
        right: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-block",
          translate: `${offset}px 0`,
          fontFamily: FONT_TEXT,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: COLORS.accent,
          opacity: 0.32,
        }}
      >
        {STRIP}
      </div>
    </div>
  );
};
