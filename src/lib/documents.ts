import fs from "node:fs/promises";
import path from "node:path";

async function extractPdfText(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
}

export async function extractTextFromBuffer(filename: string, buffer: Buffer, mimeType: string) {
  const lower = filename.toLowerCase();
  if (mimeType.includes("pdf") || lower.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }
  if (
    mimeType.includes("word") ||
    lower.endsWith(".docx") ||
    mimeType.includes("officedocument.wordprocessingml")
  ) {
    const mammoth = await import("mammoth");
    const res = await mammoth.extractRawText({ buffer });
    return res.value || "";
  }
  if (mimeType.includes("text") || lower.endsWith(".txt")) {
    return buffer.toString("utf8");
  }
  return "";
}

/**
 * Files are not stored in PostgreSQL — only extracted text + metadata.
 * On Railway, set UPLOAD_STORE_FILES=false to skip disk writes (ephemeral FS).
 * For S3/R2 later: set UPLOAD_STORAGE=s3 and UPLOAD_PUBLIC_BASE_URL.
 */
export async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safe}`;
  const text = await extractTextFromBuffer(file.name, bytes, file.type);

  const storeFiles = process.env.UPLOAD_STORE_FILES !== "false";
  let filePath: string;

  if (!storeFiles) {
    filePath = `cloud-pending://${filename}`;
  } else {
    const uploadsDir =
      process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, bytes);
  }

  return { filePath, filename, text };
}

export function chunkText(text: string, size = 900) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks.filter(Boolean);
}
