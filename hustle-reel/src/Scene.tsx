import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_DISPLAY, FONT_TEXT, MARGIN } from "./theme";
import { splitHeadline } from "./splitHeadline";

export type SceneVariant = "cover" | "standard" | "payoff";

export type SceneProps = {
  index: string; // "00", "01", ...
  label: string; // kicker, ALL-CAPS
  headline: string[]; // ALL-CAPS, one entry per visual line (revealed line by line)
  sub: string; // sentence case, muted
  accentWords: string[]; // words in headline to color accent
  cta?: string; // optional CTA rendered as accent pill (Scene 4)
  variant: SceneVariant; // per-scene motion feel
  durationInFrames: number; // this scene's length, so the exit can land
};

// No linear easing anywhere — this is the movement curve, springs handle weight.
const SHARP = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Per-variant choreography. Scene 1 is heavier (opener), Scene 4 snappiest (payoff).
const VARIANTS: Record<
  SceneVariant,
  {
    damping: number; // headline position spring
    lineStagger: number; // frames between headline lines
    lineLand: number; // frames after a line starts until it's "landed"
    headStart: number; // frame the headline reveal begins
    pushTo: number; // ambient push-in scale target
    ctaPulse: boolean;
  }
> = {
  cover: { damping: 11, lineStagger: 5, lineLand: 12, headStart: 8, pushTo: 1.05, ctaPulse: false },
  standard: { damping: 14, lineStagger: 4, lineLand: 10, headStart: 6, pushTo: 1.04, ctaPulse: false },
  payoff: { damping: 18, lineStagger: 3, lineLand: 8, headStart: 6, pushTo: 1.035, ctaPulse: true },
};

const EXIT_DUR = 8; // final frames: drift up + fade, carrying motion through the cut
const MASK_DIST = 150; // px a line is pushed below its baseline before revealing
const GLOW_PERIOD = 90; // frames for one glow breath

export const Scene: React.FC<SceneProps> = ({
  index,
  label,
  headline,
  sub,
  accentWords,
  cta,
  variant,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = VARIANTS[variant];

  // --- Ambient push-in (always breathing) + exit drift/fade -------------------
  const pushScale = interpolate(frame, [0, durationInFrames], [1, v.pushTo], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const exitStart = durationInFrames - EXIT_DUR;
  const exitY = interpolate(frame, [exitStart, durationInFrames], [0, -20], {
    ...clamp,
    easing: SHARP,
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    ...clamp,
    easing: SHARP,
  });

  // --- Faint accent glow behind the headline, pulsing on a slow sine ----------
  const glowAlpha = interpolate(
    Math.sin((frame / GLOW_PERIOD) * Math.PI * 2),
    [-1, 1],
    [0.04, 0.08],
  );

  // --- Index + label (frames 0–8) ---------------------------------------------
  const idP = spring({ frame, fps, config: { damping: 14, overshootClamping: true } });
  const indexX = interpolate(idP, [0, 1], [-30, 0]);
  const idFade = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: SHARP });
  const labelSpacing = interpolate(frame, [0, 8], [14, 5], { ...clamp, easing: SHARP });
  const underline = interpolate(frame, [2, 10], [0, 1], { ...clamp, easing: SHARP });

  // --- Sub line (frames 18–28) ------------------------------------------------
  const subY = interpolate(frame, [18, 28], [12, 0], { ...clamp, easing: SHARP });
  const subFade = interpolate(frame, [18, 28], [0, 1], { ...clamp, easing: SHARP });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          scale: String(pushScale),
          translate: `0 ${exitY}px`,
          opacity: exitOpacity,
          transformOrigin: "center center",
        }}
      >
        {/* Pulsing accent glow behind the headline */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(62% 42% at 42% 52%, rgba(253,208,0,${glowAlpha}) 0%, rgba(253,208,0,0) 70%)`,
          }}
        />

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
              opacity: idFade,
            }}
          >
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 44,
                color: COLORS.accent,
                letterSpacing: 1,
                translate: `${indexX}px 0`,
              }}
            >
              {index}
            </span>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                style={{
                  fontFamily: FONT_TEXT,
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: labelSpacing,
                  textTransform: "uppercase",
                  color: COLORS.text,
                }}
              >
                {label}
              </span>
              {/* 2px accent underline wiping left-to-right */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -8,
                  height: 2,
                  backgroundColor: COLORS.accent,
                  scale: `${underline} 1`,
                  transformOrigin: "left center",
                }}
              />
            </span>
          </div>

          {/* Headline — line-by-line mask reveal, the hero move */}
          <h1
            style={{
              margin: 0,
              fontFamily: FONT_DISPLAY,
              fontSize: 150,
              lineHeight: 0.92,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: COLORS.text,
            }}
          >
            {headline.map((line, li) => {
              const revealStart = v.headStart + li * v.lineStagger;
              const p = spring({
                frame: frame - revealStart,
                fps,
                config: { damping: v.damping, overshootClamping: true },
              });
              const ty = interpolate(p, [0, 1], [MASK_DIST, 0]);
              const landFrame = revealStart + v.lineLand;
              const segments = splitHeadline(line, accentWords);

              return (
                <div key={li} style={{ overflow: "hidden" }}>
                  <div style={{ translate: `0 ${ty}px`, willChange: "transform" }}>
                    {segments.map((seg, si) => {
                      if (!seg.accent) {
                        return (
                          <span key={si} style={{ color: COLORS.text }}>
                            {seg.text}
                          </span>
                        );
                      }
                      // Accent word: scale settle (sprung) + 1-frame color flick.
                      const ap = spring({
                        frame: frame - landFrame,
                        fps,
                        config: { damping: 12 },
                      });
                      const aScale = interpolate(ap, [0, 1], [1.04, 1]);
                      const lit = frame >= landFrame + 1;
                      return (
                        <span
                          key={si}
                          style={{
                            display: "inline-block",
                            transformOrigin: "left center",
                            scale: String(aScale),
                            color: lit ? COLORS.accent : COLORS.text,
                          }}
                        >
                          {seg.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
              opacity: subFade,
              translate: `0 ${subY}px`,
            }}
          >
            {sub}
          </p>

          {/* CTA pill (Scene 4) */}
          {cta ? <CtaPill cta={cta} pulse={v.ctaPulse} /> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// CTA — springs up from 0.9, then (payoff) a single subtle pulse after it lands.
const CTA_START = 22;
const CTA_LAND = 10;

const CtaPill: React.FC<{ cta: string; pulse: boolean }> = ({ cta, pulse }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: frame - CTA_START, fps, config: { damping: 14 } });
  const baseScale = interpolate(p, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [CTA_START, CTA_START + 8], [0, 1], {
    ...clamp,
    easing: SHARP,
  });

  // Single 1.0 → 1.03 → 1.0 pulse after landing.
  const pulseStart = CTA_START + CTA_LAND;
  const pulseT = interpolate(frame, [pulseStart, pulseStart + 8], [0, 1], { ...clamp });
  const pulseScale = pulse ? 1 + 0.03 * Math.sin(Math.PI * pulseT) : 1;

  return (
    <div
      style={{
        marginTop: 60,
        opacity,
        scale: String(baseScale * pulseScale),
        transformOrigin: "left center",
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
  );
};
