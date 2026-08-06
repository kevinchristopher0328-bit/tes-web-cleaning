import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { measureText } from "@remotion/layout-utils";
import { COLORS, FONT_DISPLAY, FONT_TEXT, HEIGHT, MARGIN } from "./theme";
import { splitHeadline } from "./splitHeadline";
import { MiniScript } from "./MiniScript";
import type { SceneSync } from "./sync";

export type ScenePace = "cover" | "standard" | "payoff";

export type SceneProps = {
  index: string; // "00", "01", ...
  label: string; // kicker, ALL-CAPS
  headline: string[]; // ALL-CAPS, one entry per visual line (rises out of the baseline)
  accentWords: string[]; // headline words colored #fdd000
  cta?: string; // Scene 4 — solid pill
  baselineY: number; // this scene's baseline position (shifts down across scenes)
  pace: ScenePace; // motion feel
  sync: SceneSync; // audio-derived frames + word-level script (accent flash, cta, words)
  durationInFrames: number;
};

const SHARP = Easing.out(Easing.cubic); // movement curve — no linear easing anywhere
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PACE: Record<
  ScenePace,
  { damping: number; stagger: number; headStart: number; lineLand: number; pushTo: number; subStart: number }
> = {
  cover: { damping: 11, stagger: 5, headStart: 12, lineLand: 12, pushTo: 1.05, subStart: 34 },
  standard: { damping: 14, stagger: 4, headStart: 8, lineLand: 10, pushTo: 1.04, subStart: 28 },
  payoff: { damping: 18, stagger: 3, headStart: 7, lineLand: 8, pushTo: 1.035, subStart: 24 },
};

const HEAD_SIZE = 150;
const MASK_DIST = 170; // px a line is pushed below the baseline before it rises
const TICK_H = 18; // measurement notch height

// Find the first accent word across the headline lines (which line, and the
// text before it) so the tick notch can be positioned under it.
const findAccent = (lines: string[], accentWords: string[]) => {
  for (let li = 0; li < lines.length; li++) {
    const segs = splitHeadline(lines[li], accentWords);
    let pre = "";
    for (const s of segs) {
      if (s.accent) return { lineIndex: li, preText: pre, accentText: s.text };
      pre += s.text;
    }
  }
  return null;
};

export const Scene: React.FC<SceneProps> = ({
  index,
  label,
  headline,
  accentWords,
  cta,
  baselineY,
  pace,
  sync,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PACE[pace];

  // Ambient push-in + exit drift/fade (exit begins when the last word finishes).
  const pushScale = interpolate(frame, [0, durationInFrames], [1, p.pushTo], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const exitY = interpolate(frame, [sync.exitStart, durationInFrames], [0, -20], { ...clamp, easing: SHARP });
  const exitOpacity = interpolate(frame, [sync.exitStart, durationInFrames], [1, 0], { ...clamp, easing: SHARP });

  // Headline accent: landing frame of its line, then the flash-pop on the spoken word.
  const accent = findAccent(headline, accentWords);
  const accentLandFrame = accent ? p.headStart + accent.lineIndex * p.stagger + p.lineLand : 0;
  const accentFlash = Math.max(sync.accentFlash ?? accentLandFrame + 2, accentLandFrame + 1);

  // Tick notch x-position (centered under the accent word), measured from the font.
  let tickX: number | null = null;
  if (accent) {
    const w = (t: string) =>
      t.length === 0
        ? 0
        : measureText({ text: t, fontFamily: FONT_DISPLAY, fontSize: HEAD_SIZE, letterSpacing: "-1px", fontWeight: 400 })
            .width;
    tickX = MARGIN + w(accent.preText) + w(accent.accentText) / 2;
  }
  const tickScaleY = interpolate(frame, [accentFlash, accentFlash + 4], [0, 1], { ...clamp, easing: SHARP });

  // Index slides along the baseline into place; label letter-spacing tightens.
  const idP = spring({ frame, fps, config: { damping: 14, overshootClamping: true } });
  const indexX = interpolate(idP, [0, 1], [-40, 0]);
  const idFade = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: SHARP });
  const labelSpacing = interpolate(frame, [0, 8], [14, 5], { ...clamp, easing: SHARP });

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
        {/* Headline — hangs off the baseline, each line rises up through it */}
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            bottom: HEIGHT - baselineY,
            right: MARGIN,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontFamily: FONT_DISPLAY,
            fontSize: HEAD_SIZE,
            lineHeight: 0.92,
            letterSpacing: -1,
            textTransform: "uppercase",
            color: COLORS.text,
          }}
        >
          {headline.map((line, li) => {
            const revealStart = p.headStart + li * p.stagger;
            const rp = spring({
              frame: frame - revealStart,
              fps,
              config: { damping: p.damping, overshootClamping: true },
            });
            const ty = interpolate(rp, [0, 1], [MASK_DIST, 0]);
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
                    // Accent word: 1-frame flash-pop (near-white) then locks to yellow.
                    const lit = frame >= accentFlash;
                    const pop = frame === accentFlash;
                    const ap = spring({ frame: frame - accentFlash, fps, config: { damping: 12 } });
                    const aScale = frame < accentFlash ? 1 : interpolate(ap, [0, 1], [1.06, 1]);
                    return (
                      <span
                        key={si}
                        style={{
                          display: "inline-block",
                          transformOrigin: "left center",
                          scale: String(aScale),
                          color: pop ? COLORS.white : lit ? COLORS.accent : COLORS.text,
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
        </div>

        {/* Measurement tick rising from the baseline under the accent word */}
        {tickX !== null ? (
          <div
            style={{
              position: "absolute",
              left: tickX - 1.5,
              top: baselineY - TICK_H,
              width: 3,
              height: TICK_H,
              backgroundColor: COLORS.accent,
              transformOrigin: "bottom center",
              scale: `1 ${tickScaleY}`,
            }}
          />
        ) : null}

        {/* Lower cluster: index + label, sub, footer/CTA — hung under the baseline */}
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            top: baselineY + 22,
            right: MARGIN,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: idFade }}>
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
          </div>

          {/* Spoken script, word-synced karaoke — this is what follows the voice */}
          <MiniScript words={sync.words} />

          {cta ? <CtaPill cta={cta} land={sync.ctaLand} /> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// CTA — lands with a spring as the narrator says it, then one subtle pulse.
const CtaPill: React.FC<{ cta: string; land: number | null }> = ({ cta, land }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = land ?? 24;

  const sp = spring({ frame: frame - at, fps, config: { damping: 14 } });
  const baseScale = interpolate(sp, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: SHARP });

  const pulseStart = at + 12;
  const pulseT = interpolate(frame, [pulseStart, pulseStart + 8], [0, 1], { ...clamp });
  const pulseScale = 1 + 0.03 * Math.sin(Math.PI * pulseT);

  return (
    <div style={{ marginTop: 12, opacity, scale: String(baseScale * pulseScale), transformOrigin: "left center" }}>
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
