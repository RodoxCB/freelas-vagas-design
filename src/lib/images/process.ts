import sharp from "sharp";

const MAX_SIZE = 512;
const QUALITY = 80;

export async function processImage(
  buffer: Buffer,
  options: { maxSize?: number; format?: "webp" | "jpeg" } = {}
): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
  const maxSize = options.maxSize ?? MAX_SIZE;
  const format = options.format ?? "webp";

  const pipeline = sharp(buffer)
    .rotate()
    .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true });

  if (format === "webp") {
    const processed = await pipeline.webp({ quality: QUALITY }).toBuffer();
    return { buffer: processed, contentType: "image/webp", extension: "webp" };
  }

  const processed = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  return { buffer: processed, contentType: "image/jpeg", extension: "jpg" };
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Formato inválido. Use JPEG, PNG ou WebP.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Imagem muito grande. Máximo 5MB.";
  }
  return null;
}
