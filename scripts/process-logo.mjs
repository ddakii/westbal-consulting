/**
 * One-off: extract W mark, transparent BG, icon-only crops.
 * Run: node scripts/process-logo.mjs
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const src = path.resolve(
  "C:/Users/Lorent/.cursor/projects/c-Users-Lorent-Desktop-Westbal-Consulting/assets/c__Users_Lorent_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_westlogo-f0c2d5a2-9d55-4552-b9c1-0839fb4f75f1.png",
);
const outDir = path.resolve("public/brand");

await fs.promises.mkdir(outDir, { recursive: true });

/** Crop only the left W symbol (no wordmark / flag). */
const cropped = await sharp(src)
  .extract({ left: 72, top: 292, width: 198, height: 438 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = cropped;
const sample = (x, y) => {
  const i = (y * info.width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};
const bg = sample(0, 0);

function key(r, g, b) {
  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  return Math.sqrt(dr * dr + dg * dg + db * db) < 55;
}

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (key(r, g, b)) data[i + 3] = 0;
  }
}

const transparentPng = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 10 })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();

await sharp(transparentPng).toFile(path.join(outDir, "westbal-mark-light.png"));

/** Dark mark for light backgrounds: white → brand navy */
const darkMeta = await sharp(transparentPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const d = darkMeta.data;
const target = [15, 23, 42]; // #0F172A
for (let i = 0; i < d.length; i += 4) {
  if (d[i + 3] === 0) continue;
  const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
  if (lum > 40) {
    d[i] = target[0];
    d[i + 1] = target[1];
    d[i + 2] = target[2];
  }
}
await sharp(d, {
  raw: { width: darkMeta.info.width, height: darkMeta.info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, "westbal-mark-dark.png"));

console.log("Saved:", path.join(outDir, "westbal-mark-light.png"));
console.log("Saved:", path.join(outDir, "westbal-mark-dark.png"));
