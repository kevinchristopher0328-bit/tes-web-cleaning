// Transcribes public/voiceover.wav locally with whisper.cpp into word-level
// captions (public/captions.json) and prints a timestamped transcript so
// scene cut points can be aligned to the narration.
import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const cwd = process.cwd();
const to = path.join(cwd, "whisper.cpp");
const VERSION = "1.5.5";
const MODEL = "base.en";

await installWhisperCpp({ to, version: VERSION });
await downloadWhisperModel({ model: MODEL, folder: to });

const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath: to,
  whisperCppVersion: VERSION,
  inputPath: path.join(cwd, "public", "voiceover.wav"),
  tokenLevelTimestamps: true,
});

const { captions } = toCaptions({ whisperCppOutput });

fs.writeFileSync(
  path.join(cwd, "public", "captions.json"),
  JSON.stringify(captions, null, 2),
);

// Print a compact transcript for aligning scene boundaries.
console.log("\n===TRANSCRIPT===");
for (const c of captions) {
  console.log(`${String(Math.round(c.startMs)).padStart(6)}ms  ${c.text}`);
}
console.log("===END===");
console.log("total captions:", captions.length);
