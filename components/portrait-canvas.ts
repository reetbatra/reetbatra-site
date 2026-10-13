"use client";

import { ascii, asciiRows, dither, sharpen, toLuma, type Ink, type Luma } from "@/lib/portrait";

const SRC = "/portrait.png";
let loading: Promise<HTMLImageElement> | null = null;

export function loadPortrait(): Promise<HTMLImageElement> {
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => {
        loading = null; // let the next hover try again
        reject(new Error(`portrait: failed to load ${SRC}`));
      };
      img.src = SRC;
    });
  }
  return loading;
}

type Rect = { x: number; y: number; w: number; h: number };

/** The head in portrait.png (320x360): hair to chin. The big ASCII uses only this. */
const HEAD: Rect = { x: 36, y: 22, w: 260, h: 220 };

function sample(img: HTMLImageElement, w: number, h: number, src?: Rect): Luma {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("portrait: 2d canvas unavailable");
  if (src) ctx.drawImage(img, src.x, src.y, src.w, src.h, 0, 0, w, h);
  else ctx.drawImage(img, 0, 0, w, h);
  return toLuma(ctx.getImageData(0, 0, w, h).data, w, h);
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Draws the portrait as a 1-bit dither with blocks of `scale` canvas pixels. */
export function drawDither(canvas: HTMLCanvasElement, img: HTMLImageElement, scale: number, ink: Ink) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("portrait: 2d canvas unavailable");
  const W = canvas.width;
  const H = canvas.height;
  const w = Math.max(1, Math.round(W / scale));
  const h = Math.max(1, Math.round(H / scale));
  const bits = dither(sample(img, w, h), ink);
  ctx.fillStyle = cssVar("--bg");
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = cssVar("--ink");
  const cw = W / w;
  const ch = H / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (bits[y * w + x]) ctx.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.ceil(cw), Math.ceil(ch));
    }
  }
}

/** Full-screen ASCII of the head, for press p. */
export function asciiPortrait(img: HTMLImageElement, cols: number, ink: Ink): string {
  return ascii(sharpen(sample(img, cols, asciiRows(cols, HEAD.w, HEAD.h), HEAD)), ink);
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Characters resolve from noise into `target` over `ms`. Returns a cancel function. */
export function scramble(el: HTMLElement, target: string, ms = 650): () => void {
  let raf = 0;
  const start = performance.now();
  const frame = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    let out = "";
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      if (ch === "\n" || ch === " ") {
        out += ch;
        continue;
      }
      const r = ((i * 9301 + 49297) % 233280) / 233280; // fixed per cell so it settles left to right-ish
      out += r < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
