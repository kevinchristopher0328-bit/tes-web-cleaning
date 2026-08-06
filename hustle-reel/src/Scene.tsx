import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONT_DISPLAY, FONT_TEXT, MARGIN } from "./theme";
import { splitHeadline } from "./splitHeadline";

export type SceneProps = {
  index: string; // "00", "01", ...
  label: string; // kicker, ALL-CAPS
  headline: string; // ALL-CAPS
  sub: string; // sentence case, muted
  accentWords: string[]; // words in headline to color accent
  cta?: string; // optional CTA rendered as accent pill
};

const SHARP = Easing.out(Easing.cubic); // fast, no bounce

export const Scene: React.FC<SceneProps> = ({
  index,
  label,
  headline,
  sub,
  accentWords,
  cta,
}) => {
  const frame = useCurrentFrame();
  const segments = splitHeadline(headline, accentWords);

  // Fast black wipe-in on every scene entry (~0.2s).
  const wipe = interpolate(frame, [0, 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Reusable "snap + slide from left" helper.
  const slideIn = (start: number, dur: number, distance = 48) => ({
    opacity: interpolate(frame, [start, start + 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    translate: `${interpolate(frame, [start, start + dur], [-distance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SHARP,
    })}px 0`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div
        style={{
          position: "absolute",
          top: 220,
          bottom: 180,
          left: MARGIN,
          right: MARGIN,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Index marker + kicker label */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            marginBottom: 40,
            ...slideIn(3, 10),
          }}
        >
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 44,
              color: COLORS.accent,
              letterSpacing: 1,
            }}
          >
            {index}
          </span>
          <span
            style={{
              fontFamily: FONT_TEXT,
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: COLORS.text,
            }}
          >
            {label}
          </span>
        </div>

        {/* Headline — dominates the frame */}
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_DISPLAY,
            fontSize: 150,
            lineHeight: 0.92,
            letterSpacing: -1,
            textTransform: "uppercase",
            color: COLORS.text,
            ...slideIn(9, 12, 60),
          }}
        >
          {segments.map((seg, i) => (
            <span
              key={i}
              style={{ color: seg.accent ? COLORS.accent : COLORS.text }}
            >
              {seg.text}
            </span>
          ))}
        </h1>

        {/* Supporting line */}
        <p
          style={{
            margin: "44px 0 0 0",
            maxWidth: 760,
            fontFamily: FONT_TEXT,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.35,
            color: COLORS.muted,
            opacity: interpolate(frame, [18, 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0 ${interpolate(frame, [18, 30], [22, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: SHARP,
            })}px`,
          }}
        >
          {sub}
        </p>

        {/* Optional CTA pill */}
        {cta ? (
          <div
            style={{
              marginTop: 60,
              opacity: interpolate(frame, [30, 36], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              scale: String(
                interpolate(frame, [30, 40], [0.9, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: SHARP,
                }),
              ),
            }}
          >
            <span
              style={{
                display: "inline-block",
                backgroundColor: COLORS.accent,
                color: COLORS.bg,
                fontFamily: FONT_DISPLAY,
                fontSize: 38,
                letterSpacing: 1,
                textTransform: "uppercase",
                padding: "26px 48px",
                borderRadius: 100,
              }}
            >
              {cta}
            </span>
          </div>
        ) : null}
      </div>

      {/* Fast black wipe-in overlay */}
      <AbsoluteFill
        style={{ backgroundColor: COLORS.bg, opacity: wipe, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
