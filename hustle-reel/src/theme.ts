import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted fonts (public/fonts) so rendering never needs a network fetch.
// Anton — condensed black display face for brutalist all-caps headlines.
// Inter — clean grotesque for labels + supporting copy.
export const FONT_DISPLAY = "Anton";
export const FONT_TEXT = "Inter";

void loadFont({ family: FONT_DISPLAY, url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" });
void loadFont({ family: FONT_TEXT, url: staticFile("fonts/Inter-Regular.woff2"), weight: "400" });
void loadFont({ family: FONT_TEXT, url: staticFile("fonts/Inter-SemiBold.woff2"), weight: "600" });

export const COLORS = {
  bg: "#0A0A0A", // near-black
  text: "#F5F5F5", // off-white
  white: "#FFFFFF", // flash-pop peak
  muted: "#9A9A9A", // muted grey
  accent: "#fdd000", // golden yellow — used sparingly
} as const;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const MARGIN = 96; // consistent left margin — all scenes share one system

export { FPS, TOTAL_FRAMES } from "./sync";
