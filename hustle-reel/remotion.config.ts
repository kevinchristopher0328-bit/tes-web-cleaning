/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
// Fonts + captions.json load via delayRender(); give them headroom under
// render concurrency so a slow tab doesn't trip the default 30s timeout.
Config.setDelayRenderTimeoutInMilliseconds(120000);

// In sandboxes where Remotion can't download its own Chromium, point it at a
// pre-installed headless shell via REMOTION_BROWSER_EXECUTABLE. Ignored when
// the env var is unset (normal machines download/manage the browser).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
