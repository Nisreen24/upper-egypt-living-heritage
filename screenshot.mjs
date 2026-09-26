// Full-page screenshot helper.
// Usage: node screenshot.mjs <url> [label] [viewportWidth]
//   node screenshot.mjs http://localhost:3001
//   node screenshot.mjs http://localhost:3001 hero
//   node screenshot.mjs http://localhost:3001 mobile 390
// Output: ./temporary screenshots/screenshot-N[-label].png (auto-incremented)
import puppeteer from "puppeteer";
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const OUT_DIR = join(ROOT, "temporary screenshots");

const [, , url = "http://localhost:3001", label = "", widthArg = "1440"] = process.argv;
const width = Number(widthArg) || 1440;

if (url.startsWith("file:")) {
  console.error("Refusing to screenshot a file:// URL. Serve on localhost first: node serve.mjs");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const existing = await readdir(OUT_DIR);
const next = existing.reduce((max, f) => {
  const m = /^screenshot-(\d+)/.exec(f);
  return m ? Math.max(max, Number(m[1])) : max;
}, 0) + 1;
const fileName = `screenshot-${next}${label ? `-${label}` : ""}.png`;
const outPath = join(OUT_DIR, fileName);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--font-render-hinting=none"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts?.ready);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved: temporary screenshots/${fileName} (viewport ${width}px)`);
} finally {
  await browser.close();
}
