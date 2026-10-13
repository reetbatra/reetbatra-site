// Builds every image the site serves from the two source photos in assets-src/.
// Run with `npm run assets` after changing a source photo. Outputs are committed.
//
//   assets-src/face-full.jpg  ETH India stage photo, square crop of the face
//   assets-src/cut-tight.png  portrait with the background removed (lift.swift, macOS Vision)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const FACE = "assets-src/face-full.jpg";
const CUT = "assets-src/cut-tight.png";

// Tight square around the face in face-full.jpg (300x300), so it still reads at 16px.
const FACE_BOX = { left: 18, top: 78, width: 196, height: 196 };

const circle = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);

async function roundFace(size, out) {
  await sharp(FACE)
    .extract(FACE_BOX)
    .resize(size, size)
    .grayscale()
    .linear(1.15, -(128 * 0.15)) // a touch more contrast so the face reads at 16px
    .composite([{ input: circle(size), blend: "dest-in" }])
    .png()
    .toFile(out);
}

mkdirSync("public", { recursive: true });

// Favicon: round greyscale face. Next serves app/icon.png as <link rel="icon">.
await roundFace(128, "app/icon.png");

// Home screen icon: square, iOS rounds the corners itself.
await sharp(FACE).extract(FACE_BOX).resize(180, 180).grayscale().linear(1.15, -(128 * 0.15)).png().toFile("app/apple-icon.png");

// /favicon.ico for clients that ask for it directly.
await roundFace(32, "assets-src/.favicon-32.png");
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", "assets-src/.favicon-32.png", "app/favicon.ico"]);

// Portrait source for the dither and ASCII renderers. They work from luminance + alpha,
// so a small greyscale PNG with the cutout alpha is all the browser needs.
await sharp(CUT).resize(320, 360).grayscale().png({ compressionLevel: 9 }).toFile("public/portrait.png");

console.log("assets: app/icon.png app/apple-icon.png app/favicon.ico public/portrait.png");
