import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Scene, SceneProps } from "./Scene";
import { Marquee } from "./Marquee";
import { ProgressBar } from "./ProgressBar";
import { Captions } from "./Captions";
import { COLORS, SCENE_FRAMES } from "./theme";

const SCENES: SceneProps[] = [
  {
    index: "00",
    label: "INSIDE A 1-ON-1 SESSION",
    headline: "NOT JUST SHOWING UP.",
    accentWords: ["SHOWING UP"],
    sub: "Here's what a real session actually looks like.",
  },
  {
    index: "01",
    label: "ASSESS",
    headline: "WE CHECK HOW YOU MOVE FIRST.",
    accentWords: ["MOVE"],
    sub: "Mobility, strength baseline, and anything that needs attention before loading up.",
  },
  {
    index: "02",
    label: "TRAIN & CORRECT",
    headline: "EVERY REP GETS WATCHED.",
    accentWords: ["WATCHED"],
    sub: "Form corrected in real time — the part you can't fix training alone.",
  },
  {
    index: "03",
    label: "TRACK & ADJUST",
    headline: "THE PLAN EVOLVES.",
    accentWords: ["EVOLVES"],
    sub: "Nothing stays fixed — your program adjusts as you get stronger.",
    cta: "DM OR WHATSAPP TO START.",
  },
];

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Narration plays across the whole composition */}
      <Audio src={staticFile("voiceover.mp3")} />

      <Series>
        {SCENES.map((scene, i) => (
          <Series.Sequence
            key={scene.index}
            durationInFrames={SCENE_FRAMES[i]}
            name={`Scene ${scene.index}`}
          >
            <Scene {...scene} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Global overlays span all scenes so the reel reads as one system */}
      <ProgressBar />
      {/* Voice-synced TikTok captions, above the marquee */}
      <Captions />
      <Marquee />
    </AbsoluteFill>
  );
};
