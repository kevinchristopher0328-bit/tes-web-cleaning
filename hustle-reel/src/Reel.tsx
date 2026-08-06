import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Scene, type ScenePace, type SceneProps } from "./Scene";
import { Baseline } from "./Baseline";
import { Marquee } from "./Marquee";
import { Grain } from "./Grain";
import { COLORS } from "./theme";
import { SCENE_SYNC } from "./sync";

// baselineY shifts down the frame across scenes so the eye travels down the reel.
const BASELINE_Y = [740, 880, 1010, 1180];
const PACE: ScenePace[] = ["cover", "standard", "standard", "payoff"];

// Optional per-scene background clip (in public/). Fill these once the treated
// clips exist, e.g. "bg-0.mp4"; undefined = keep the plain near-black bg.
const SCENE_BG: (string | undefined)[] = [undefined, undefined, undefined, undefined];

type SceneData = Omit<SceneProps, "baselineY" | "pace" | "sync" | "durationInFrames">;

const SCENES: SceneData[] = [
  {
    index: "00",
    label: "INSIDE A 1-ON-1 SESSION",
    headline: ["NOT JUST", "SHOWING UP."],
    accentWords: ["SHOWING UP"],
  },
  {
    index: "01",
    label: "ASSESS",
    headline: ["WE CHECK HOW", "YOU MOVE", "FIRST."],
    accentWords: ["MOVE"],
  },
  {
    index: "02",
    label: "TRAIN & CORRECT",
    headline: ["EVERY REP GETS", "WATCHED."],
    accentWords: ["WATCHED"],
  },
  {
    index: "03",
    label: "TRACK & ADJUST",
    headline: ["THE PLAN", "EVOLVES."],
    accentWords: ["EVOLVES"],
    cta: "DM OR WHATSAPP TO START.",
  },
];

const DURATIONS = SCENE_SYNC.map((s) => s.durationInFrames);

export const Reel: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: transparent ? "transparent" : COLORS.bg }}>
      {/* Narration plays across the whole composition */}
      <Audio src={staticFile("voiceover.mp3")} />

      <Series>
        {SCENES.map((scene, i) => (
          <Series.Sequence key={scene.index} durationInFrames={DURATIONS[i]} name={`Scene ${scene.index}`}>
            <Scene
              {...scene}
              bg={SCENE_BG[i]}
              transparent={transparent}
              baselineY={BASELINE_Y[i]}
              pace={PACE[i]}
              sync={SCENE_SYNC[i]}
              durationInFrames={DURATIONS[i]}
            />
          </Series.Sequence>
        ))}
      </Series>

      {/* One continuous baseline connecting all four scenes */}
      <Baseline baselineYs={BASELINE_Y} durations={DURATIONS} />
      {/* Signature marquee + film grain over the whole comp (grain off for alpha) */}
      <Marquee />
      {!transparent && <Grain />}
    </AbsoluteFill>
  );
};
