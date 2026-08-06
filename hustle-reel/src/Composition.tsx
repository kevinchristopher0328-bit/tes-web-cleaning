import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, TOTAL_FRAMES } from "./theme";

export const MyComposition = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
