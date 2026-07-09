import sharp from "sharp";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svg = readFileSync(join(root, "public/logo.svg"));

const outputs = [
  { path: join(root, "public/logo.png"), size: 512 },
  { path: join(root, "src/app/icon.png"), size: 32 },
  { path: join(root, "src/app/apple-icon.png"), size: 180 },
];

for (const { path, size } of outputs) {
  await sharp(svg).resize(size, size).png().toFile(path);
  console.log(`Generated ${path} (${size}x${size})`);
}
