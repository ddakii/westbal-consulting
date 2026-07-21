/**
 * Brand PNGs: icon-only + full wordmark, transparent BG.
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

function removeNavyBackground(rawBuffer, info, bgSample) {
  const data = Buffer.from(rawBuffer);
  const bg = bgSample;

  function isBg(r, g, b) {
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
      if (isBg(r, g, b)) data[i + 3] = 0;
    }
  }
  return data;
}

function toDarkWordmark(data, info) {
  const d = Buffer.from(data);
  const target = [15, 23, 42];
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const lum = (r + g + b) / 3;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (lum > 165 && chroma < 45) {
      d[i] = target[0];
      d[i + 1] = target[1];
      d[i + 2] = target[2];
    }
  }
  return d;
}

async function processExtract(extract, lightName, darkName) {
  const cropped = await sharp(src)
    .extract(extract)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const sample = (x, y) => {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const bg = sample(0, 0);

  const cleared = removeNavyBackground(data, info, bg);

  const transparentPng = await sharp(cleared, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await sharp(transparentPng).toFile(path.join(outDir, lightName));

  const trimmed = await sharp(transparentPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const darkData = toDarkWordmark(trimmed.data, trimmed.info);
  await sharp(darkData, {
    raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, darkName));

  const meta = await sharp(transparentPng).metadata();
  return meta;
}

/** W icon only */
const markMeta = await processExtract(
  { left: 72, top: 292, width: 198, height: 438 },
  "westbal-mark-light.png",
  "westbal-mark-dark.png",
);

/** Full logo: W + WESTBAL + CONSULTING + flag */
const logoMeta = await processExtract(
  { left: 48, top: 268, width: 928, height: 488 },
  "westbal-logo-light.png",
  "westbal-logo-dark.png",
);

console.log("Mark:", markMeta.width, "x", markMeta.height);
console.log("Logo:", logoMeta.width, "x", logoMeta.height);
console.log("Saved brand assets in", outDir);
