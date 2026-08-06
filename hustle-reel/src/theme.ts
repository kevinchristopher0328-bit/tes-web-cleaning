import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted fonts (in public/fonts) so rendering never depends on a
// network fetch at render time.
// Anton — condensed black display face for brutalist all-caps headlines.
// Inter — clean grotesque for labels + supporting copy.
export const FONT_DISPLAY = "Anton";
export const FONT_TEXT = "Inter";

void loadFont({
  family: FONT_DISPLAY,
  url: staticFile("fonts/Anton-Regular.woff2"),
  weight: "400",
});
void loadFont({
  family: FONT_TEXT,
  url: staticFile("fonts/Inter-Regular.woff2"),
  weight: "400",
});
void loadFont({
  family: FONT_TEXT,
  url: staticFile("fonts/Inter-SemiBold.woff2"),
  weight: "600",
});

export const COLORS = {
  bg: "#0A0A0A", // near-black
  text: "#F5F5F5", // off-white
  muted: "#9A9A9A", // muted grey
  accent: "#fdd000", // golden yellow — used sparingly
} as const;

// Consistent left margin so all four scenes align to one system.
export const MARGIN = 96; // px from the left edge (safe area)
export const FPS = 30;

// Scene durations in frames (30fps). 4 + 4 + 4 + 5 = 17s.
export const SCENE_FRAMES = [120, 120, 120, 150] as const;
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);
