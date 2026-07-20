import fs from "node:fs";
import path from "node:path";

/** Shton ?v=mtime që foto të reja në public/ të shfaqen menjëherë pa cache të vjetër. */
export function withAssetVersion(src: string): string {
  if (!src.startsWith("/")) return src;
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  try {
    const { mtimeMs } = fs.statSync(filePath);
    return `${src.split("?")[0]}?v=${Math.floor(mtimeMs)}`;
  } catch {
    return src;
  }
}
