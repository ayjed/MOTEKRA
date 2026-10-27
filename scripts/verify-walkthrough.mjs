import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve("docs/evidence/phase-02/index.html")).href);
  await page.locator("video").evaluate(async (video) => { video.muted = true; await video.play(); });
  await page.waitForFunction(() => (document.querySelector("video")?.currentTime ?? 0) > 1);
  const result = await page.locator("video").evaluate((video) => ({
    durationSeconds: video.duration, width: video.videoWidth, height: video.videoHeight,
    playbackReachedSeconds: video.currentTime, readyState: video.readyState, error: video.error?.message ?? null,
  }));
  if (result.error || result.durationSeconds < 5 || result.width !== 1280 || result.height !== 800) throw new Error("Walkthrough playback validation failed");
  await writeFile("docs/evidence/phase-02/video-playback.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
