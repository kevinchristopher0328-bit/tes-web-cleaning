import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, TOTAL_FRAMES } from "./theme";

export const MyComposition = () => {
  return (
    <>
      {/* Normal reel on near-black */}
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ transparent: false }}
      />
      {/* Same reel with a transparent background — export with an alpha codec
          (ProRes 4444 / VP8-VP9 webm) to overlay on your own footage. */}
      <Composition
        id="ReelAlpha"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ transparent: true }}
      />
    </>
  );
};
