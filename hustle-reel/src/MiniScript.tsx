import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT_TEXT } from "./theme";
import type { Word } from "./sync";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const GREY = COLORS.muted;
const WHITE = COLORS.text;
const ACCENT = COLORS.accent;
const [aR, aG, aB] = hexToRgb(ACCENT);
const [wR, wG, wB] = hexToRgb(WHITE);
// Accent → off-white settle as the next word takes over.
const settle = (t: number) =>
  `rgb(${Math.round(aR + (wR - aR) * t)}, ${Math.round(aG + (wG - aG) * t)}, ${Math.round(aB + (wB - aB) * t)})`;

// The spoken script for the scene, revealed word-by-word in time with the VO:
// upcoming words sit dim grey, the live word is #fdd000, spoken words are
// off-white. Clean fade/brighten only — no per-word bounce.
export const MiniScript: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const blockFade = interpolate(frame, [2, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <div
      style={{
        maxWidth: 892, // full margin-to-margin width so long lines stay ≤2 rows
        opacity: blockFade,
        fontFamily: FONT_TEXT,
        fontWeight: 400,
        fontSize: 32,
        lineHeight: 1.42,
        textAlign: "left",
      }}
    >
      {words.map((w, i) => {
        const live = frame >= w.s && frame < w.e;
        let color: string;
        if (frame < w.s) color = GREY; // upcoming
        else if (live) color = ACCENT; // being spoken
        else color = settle(interpolate(frame, [w.e, w.e + 3], [0, 1], clamp)); // spoken → white

        // Dim upcoming words, brighten as each is reached.
        const opacity = interpolate(frame, [w.s - 4, w.s], [0.5, 1], clamp);

        return (
          <span key={i} style={{ color, opacity }}>
            {w.t}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
