// Downloads a thumbnail for every video in VIDEOS (lib/content.ts) into public/videos/<id>.webp.
// The site's CSP only allows images from its own origin, so YouTube's image CDN can't be used
// directly. Run with `npm run videos` after adding a video.
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync("lib/content.ts", "utf8");
const block = src.slice(src.indexOf("export const VIDEOS"), src.indexOf("];", src.indexOf("export const VIDEOS")));
const ids = [...block.matchAll(/id: "([\w-]{11})"/g)].map((m) => m[1]);
if (!ids.length) throw new Error("videos: no ids found in VIDEOS");

mkdirSync("public/videos", { recursive: true });
for (const id of ids) {
  // maxres isn't made for every video; fall back to hq, which always exists.
  let buf;
  for (const size of ["maxresdefault", "hqdefault"]) {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`);
    if (res.ok) {
      buf = Buffer.from(await res.arrayBuffer());
      break;
    }
  }
  if (!buf) throw new Error(`videos: no thumbnail for ${id}`);
  await sharp(buf).resize(960, 540, { fit: "cover" }).webp({ quality: 78 }).toFile(`public/videos/${id}.webp`);
  console.log(`public/videos/${id}.webp`);
}
