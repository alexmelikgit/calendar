import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const directory = "out/illustrations";
for (const file of await readdir(directory)) {
  if (!file.endsWith(".png")) continue;
  const source = path.join(directory, file);
  await sharp(source).resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 }).toFile(source.replace(/\.png$/, ".webp"));
  await rm(source);
}
console.log("Prepared responsive WebP illustrations; originals remain in public/.");
